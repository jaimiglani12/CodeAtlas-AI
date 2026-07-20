# Languages with a tree-sitter grammar wired up in engine/parser/parser.py.
# Files in these languages get full structural analysis: functions,
# classes, imports and call graphs (see engine/metadata/extractor.py).

AST_LANGUAGES = {

    "python",
    "javascript",
    "typescript",
    "tsx",
    "java",
    "cpp",
    "c",
    "go",
    "rust",

}


# Every recognized file extension. Languages outside AST_LANGUAGES are
# still scanned, shown in the file explorer, and chunked as searchable
# text for chat — they just don't get function/class/call extraction
# since no tree-sitter grammar is installed for them.

EXTENSION_TO_LANGUAGE = {

    ".py": "python",

    ".js": "javascript",
    ".jsx": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",

    ".ts": "typescript",
    ".tsx": "tsx",

    ".java": "java",

    ".cpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".hpp": "cpp",
    ".hh": "cpp",

    ".c": "c",
    ".h": "c",

    ".go": "go",

    ".rs": "rust",

    # Recognized, but without a bundled tree-sitter grammar — scanned and
    # chunked as plain text so they're still searchable in chat.
    ".rb": "ruby",
    ".php": "php",
    ".cs": "csharp",
    ".kt": "kotlin",
    ".kts": "kotlin",
    ".swift": "swift",
    ".scala": "scala",
    ".m": "objective-c",
    ".dart": "dart",
    ".lua": "lua",
    ".r": "r",
    ".pl": "perl",

    ".sh": "shell",
    ".bash": "shell",

    ".sql": "sql",

    ".html": "html",
    ".htm": "html",

    ".css": "css",
    ".scss": "scss",
    ".less": "less",

    ".vue": "vue",

    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".xml": "xml",

    ".md": "markdown",
    ".markdown": "markdown",

}


# Ignore these folders

IGNORE_FOLDERS = [

    ".git",

    "__pycache__",

    "node_modules",

    "venv",

    ".venv",

    "build",

    "dist"

]