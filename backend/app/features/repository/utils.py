import os
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

from engine.analyzer.repository_analyzer import RepositoryAnalyzer


STORAGE_ROOT = Path(
    os.getenv(
        "REPOSITORY_STORAGE_ROOT",
        Path(__file__).resolve().parents[3] / "storage" / "repositories",
    )
)


def _unique_dest(workspace_id: int, name: str) -> Path:

    safe_name = "".join(
        ch if ch.isalnum() or ch in ("-", "_") else "-"
        for ch in name
    ).strip("-") or "repository"

    dest = STORAGE_ROOT / str(workspace_id) / safe_name

    counter = 1
    original = dest

    while dest.exists():
        dest = Path(f"{original}-{counter}")
        counter += 1

    dest.parent.mkdir(parents=True, exist_ok=True)

    return dest


def _collapse_single_root(path: Path) -> Path:
    """
    Zip exports (e.g. from GitHub) often wrap the whole repository in a
    single top-level folder. If that's the only thing extracted, treat
    that folder as the repository root instead.
    """

    entries = list(path.iterdir())

    if len(entries) == 1 and entries[0].is_dir():
        return entries[0]

    return path


def extract_zip(file_obj, workspace_id: int, name: str) -> str:

    dest = _unique_dest(workspace_id, name)
    dest.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp:
        shutil.copyfileobj(file_obj, tmp)
        tmp_path = tmp.name

    try:
        with zipfile.ZipFile(tmp_path) as archive:
            destination_root = dest.resolve()

            for member in archive.infolist():
                member_path = (destination_root / member.filename).resolve()

                if destination_root not in member_path.parents and member_path != destination_root:
                    raise ValueError("Archive contains an unsafe file path.")

            archive.extractall(dest)
    except (zipfile.BadZipFile, ValueError):
        shutil.rmtree(dest, ignore_errors=True)
        raise ValueError("Uploaded file is not a valid or safe .zip archive.")
    finally:
        os.remove(tmp_path)

    return str(_collapse_single_root(dest))


def clone_github_repo(github_url: str, workspace_id: int, name: str) -> str:

    dest = _unique_dest(workspace_id, name)

    try:
        result = subprocess.run(
            ["git", "clone", "--depth", "1", github_url, str(dest)],
            capture_output=True,
            text=True,
            timeout=300,
        )
    except FileNotFoundError:
        raise ValueError(
            "git is not available on the server. Install git or upload a .zip instead."
        )
    except subprocess.TimeoutExpired:
        raise ValueError("Cloning the repository timed out.")

    if result.returncode != 0:
        shutil.rmtree(dest, ignore_errors=True)
        raise ValueError(f"Failed to clone repository: {result.stderr.strip()[:300]}")

    return str(dest)


def compute_language_summary(index) -> tuple[str, int]:

    analyzer = RepositoryAnalyzer(index)
    languages = analyzer.languages()
    file_count = analyzer.total_files()

    if not languages:
        return "No source files detected", file_count

    ranked = sorted(languages.items(), key=lambda item: item[1], reverse=True)
    top = [lang.capitalize() for lang, _ in ranked[:3]]

    return " · ".join(top), file_count


def build_stats(index, embedding_status: str) -> dict:

    analyzer = RepositoryAnalyzer(index)
    languages = analyzer.languages()
    total = sum(languages.values()) or 1

    breakdown = [
        {
            "name": lang.capitalize(),
            "percentage": round((count / total) * 100),
        }
        for lang, count in sorted(
            languages.items(), key=lambda item: item[1], reverse=True
        )
    ]

    return {
        "languages": breakdown,
        "files": analyzer.total_files(),
        "functions": analyzer.total_functions(),
        "classes": analyzer.total_classes(),
        "dependencies": analyzer.total_imports(),
        "embedding_status": embedding_status,
    }


def build_file_tree(index, root_path: str) -> list[dict]:

    root = Path(root_path)
    tree: dict = {}

    for file in index.files:

        try:
            relative = Path(file.path).relative_to(root)
        except ValueError:
            relative = Path(os.path.relpath(file.path, root_path))

        parts = relative.parts

        if not parts:
            continue

        cursor = tree

        for part in parts[:-1]:
            cursor = cursor.setdefault(part, {})

        cursor.setdefault("__files__", []).append(parts[-1])

    def to_nodes(subtree: dict, prefix: str) -> list[dict]:

        folders = []
        files = []

        for key, value in subtree.items():

            if key == "__files__":
                continue

            folder_path = f"{prefix}/{key}" if prefix else key

            folders.append({
                "name": key,
                "path": folder_path,
                "type": "folder",
                "children": to_nodes(value, folder_path),
            })

        for file_name in subtree.get("__files__", []):

            file_path = f"{prefix}/{file_name}" if prefix else file_name

            files.append({
                "name": file_name,
                "path": file_path,
                "type": "file",
            })

        folders.sort(key=lambda node: node["name"].lower())
        files.sort(key=lambda node: node["name"].lower())

        return folders + files

    return to_nodes(tree, "")


MAX_FILE_PREVIEW_BYTES = 400_000

LANGUAGE_BY_EXTENSION = {
    ".py": "python", ".js": "javascript", ".jsx": "javascript",
    ".ts": "typescript", ".tsx": "typescript", ".json": "json",
    ".md": "markdown", ".css": "css", ".scss": "scss", ".html": "html",
    ".yml": "yaml", ".yaml": "yaml", ".sh": "bash", ".go": "go",
    ".rs": "rust", ".java": "java", ".rb": "ruby", ".php": "php",
    ".c": "c", ".h": "c", ".cpp": "cpp", ".hpp": "cpp", ".sql": "sql",
    ".toml": "toml", ".ini": "ini", ".env": "bash",
}


def guess_language(path: str) -> str:

    suffix = Path(path).suffix.lower()

    return LANGUAGE_BY_EXTENSION.get(suffix, "text")


def read_file_content(root_path: str, relative_path: str) -> dict:
    """
    Safely reads a text file inside a repository's checkout on disk.
    Raises ValueError for missing/binary/out-of-bounds files.
    """

    root = Path(root_path).resolve()
    target = (root / relative_path).resolve()

    if root not in target.parents and target != root:
        raise ValueError("Invalid file path.")

    if not target.is_file():
        raise ValueError("File not found.")

    size = target.stat().st_size
    truncated = size > MAX_FILE_PREVIEW_BYTES

    try:
        with open(target, "rb") as f:
            raw = f.read(MAX_FILE_PREVIEW_BYTES)
    except OSError:
        raise ValueError("Could not read file.")

    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise ValueError("This file isn't a text file that can be previewed.")

    return {
        "path": relative_path,
        "language": guess_language(relative_path),
        "content": content,
        "truncated": truncated,
    }


def build_graph(index) -> dict:

    nodes = {}

    for function in index.functions:
        nodes.setdefault(function.name, {
            "id": function.name,
            "label": f"{function.name}()",
            "type": "function",
        })

    for cls in index.classes:
        nodes.setdefault(cls.name, {
            "id": cls.name,
            "label": cls.name,
            "type": "class",
        })

    edges = []
    seen = set()

    for caller, callees in index.dependency_graph.items():

        if caller not in nodes:
            continue

        for callee in callees:

            if callee not in nodes:
                continue

            key = (caller, callee)

            if key in seen:
                continue

            seen.add(key)

            edges.append({
                "source": caller,
                "target": callee,
                "kind": "calls",
            })

    return {
        "nodes": list(nodes.values()),
        "edges": edges,
    }
