from fastapi import HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
from threading import Lock

from app.core.database import SessionLocal
from app.features.repository.indexer import RepositoryIndexer
from app.features.repository.models import Repository
from app.features.repository.schemas import (
    RepositoryCreate,
    RepositoryUpdate,
)
from app.features.repository.utils import (
    build_file_tree,
    build_graph,
    build_stats,
    clone_github_repo,
    compute_language_summary,
    extract_zip,
    read_file_content,
)
from app.features.workspace.models import Workspace


class RepositoryService:

    _index_lock = Lock()

    @staticmethod
    def get_all(
        db: Session,
        workspace_id: int,
    ):

        return (
            db.query(Repository)
            .filter(
                Repository.workspace_id == workspace_id
            )
            .order_by(Repository.created_at.desc())
            .all()
        )

    @staticmethod
    def get_owned(
        db: Session,
        repository_id: int,
        owner_id: int,
    ) -> Repository:

        repository = (
            db.query(Repository)
            .join(Workspace)
            .filter(
                Repository.id == repository_id,
                Workspace.owner_id == owner_id,
            )
            .first()
        )

        if repository is None:
            raise HTTPException(
                status_code=404,
                detail="Repository not found",
            )

        return repository

    @staticmethod
    def create(
        db: Session,
        workspace_id: int,
        data: RepositoryCreate,
    ):

        repository = Repository(
            name=data.name,
            path=data.path,
            workspace_id=workspace_id,
            status="INDEXING",
            source="local",
        )

        db.add(repository)
        db.commit()
        db.refresh(repository)

        RepositoryService._run_index(db, repository)

        return repository

    @staticmethod
    def create_from_upload(
        db: Session,
        workspace_id: int,
        name: str,
        file,
        github_url: str | None,
        background_tasks,
    ):

        if not file and not github_url:
            raise HTTPException(
                status_code=400,
                detail="Provide either a .zip file or a GitHub URL.",
            )

        source = "github" if github_url else "zip"

        try:
            if github_url:
                path = clone_github_repo(github_url, workspace_id, name)
            else:
                path = extract_zip(file, workspace_id, name)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        repository = Repository(
            name=name,
            path=path,
            workspace_id=workspace_id,
            status="INDEXING",
            source=source,
            source_url=github_url,
        )

        db.add(repository)
        db.commit()
        db.refresh(repository)

        background_tasks.add_task(
            RepositoryService._run_index_in_background,
            repository.id,
        )

        return repository

    @staticmethod
    def _run_index_in_background(repository_id: int):

        db = SessionLocal()

        try:
            repository = db.get(Repository, repository_id)

            if repository is not None:
                RepositoryService._run_index(db, repository)
        finally:
            db.close()

    @staticmethod
    def _run_index(db: Session, repository: Repository):

        try:
            with RepositoryService._index_lock:
                index = RepositoryIndexer.index(
                    repository.id,
                    repository.path,
                )

            language_summary, file_count = compute_language_summary(index)

            repository.language_summary = language_summary
            repository.file_count = file_count
            repository.status = "READY"

        except Exception as e:

            repository.status = "FAILED"

            print("=" * 60)
            print("INDEXING ERROR")
            print(e)
            print("=" * 60)

        db.commit()
        db.refresh(repository)

        return repository

    @staticmethod
    def get_stats(repository: Repository) -> dict:

        index = RepositoryService._require_index(repository)

        return build_stats(index, repository.index_status)

    @staticmethod
    def get_files(repository: Repository) -> list[dict]:

        index = RepositoryService._require_index(repository)

        return build_file_tree(index, repository.path)

    @staticmethod
    def get_graph(repository: Repository) -> dict:

        index = RepositoryService._require_index(repository)

        return build_graph(index)

    @staticmethod
    def get_file_content(repository: Repository, path: str) -> dict:

        RepositoryService._require_index(repository)

        try:
            return read_file_content(repository.path, path)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def _require_index(repository: Repository):

        if repository.index_status == "failed":
            raise HTTPException(
                status_code=409,
                detail="Repository indexing failed. Try re-uploading it.",
            )

        if repository.index_status != "ready":
            raise HTTPException(
                status_code=409,
                detail="Repository is still indexing. Try again shortly.",
            )

        try:
            with RepositoryService._index_lock:
                index = RepositoryIndexer.get_cached(repository.id)

                if index is not None:
                    return index

                if not Path(repository.path).exists():
                    if repository.source != "github" or not repository.source_url:
                        raise ValueError("Repository files are no longer available.")

                    repository.path = clone_github_repo(
                        repository.source_url,
                        repository.workspace_id,
                        repository.name,
                    )

                return RepositoryIndexer.index(
                    repository.id,
                    repository.path,
                )
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Could not load the repository index.",
            )

    @staticmethod
    def update(
        db: Session,
        repository: Repository,
        data: RepositoryUpdate,
    ):

        if data.name is not None:
            repository.name = data.name

        db.commit()
        db.refresh(repository)

        return repository

    @staticmethod
    def delete(
        db: Session,
        repository: Repository,
    ):

        db.delete(repository)
        db.commit()
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.features.repository.indexer import RepositoryIndexer
from app.features.repository.models import Repository
from app.features.repository.schemas import (
    RepositoryCreate,
    RepositoryUpdate,
)
from app.features.repository.utils import (
    build_file_tree,
    build_graph,
    build_stats,
    clone_github_repo,
    compute_language_summary,
    extract_zip,
    read_file_content,
)
from app.features.workspace.models import Workspace


class RepositoryService:

    @staticmethod
    def get_all(
        db: Session,
        workspace_id: int,
    ):

        return (
            db.query(Repository)
            .filter(
                Repository.workspace_id == workspace_id
            )
            .order_by(Repository.created_at.desc())
            .all()
        )

    @staticmethod
    def get_owned(
        db: Session,
        repository_id: int,
        owner_id: int,
    ) -> Repository:

        repository = (
            db.query(Repository)
            .join(Workspace)
            .filter(
                Repository.id == repository_id,
                Workspace.owner_id == owner_id,
            )
            .first()
        )

        if repository is None:
            raise HTTPException(
                status_code=404,
                detail="Repository not found",
            )

        return repository

    @staticmethod
    def create(
        db: Session,
        workspace_id: int,
        data: RepositoryCreate,
    ):

        repository = Repository(
            name=data.name,
            path=data.path,
            workspace_id=workspace_id,
            status="INDEXING",
            source="local",
        )

        db.add(repository)
        db.commit()
        db.refresh(repository)

        RepositoryService._run_index(db, repository)

        return repository

    @staticmethod
    def create_from_upload(
        db: Session,
        workspace_id: int,
        name: str,
        file,
        github_url: str | None,
        background_tasks=None,
    ):

        if not file and not github_url:
            raise HTTPException(
                status_code=400,
                detail="Provide either a .zip file or a GitHub URL.",
            )

        source = "github" if github_url else "zip"

        try:
            if github_url:
                path = clone_github_repo(github_url, workspace_id, name)
            else:
                path = extract_zip(file, workspace_id, name)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        repository = Repository(
            name=name,
            path=path,
            workspace_id=workspace_id,
            status="INDEXING",
            source=source,
        )

        db.add(repository)
        db.commit()
        db.refresh(repository)

        if background_tasks is None:
            RepositoryService._run_index(db, repository)
        else:
            background_tasks.add_task(
                RepositoryService._run_index_in_background,
                repository.id,
            )

        return repository

    @staticmethod
    def _run_index_in_background(repository_id: int):

        db = SessionLocal()

        try:
            repository = db.get(Repository, repository_id)

            if repository is not None:
                RepositoryService._run_index(db, repository)
        finally:
            db.close()

    @staticmethod
    def _run_index(db: Session, repository: Repository):

        try:
            index = RepositoryIndexer.index(
                repository.id,
                repository.path,
            )

            language_summary, file_count = compute_language_summary(index)

            repository.language_summary = language_summary
            repository.file_count = file_count
            repository.status = "READY"

        except Exception as e:

            repository.status = "FAILED"

            print("=" * 60)
            print("INDEXING ERROR")
            print(e)
            print("=" * 60)

        db.commit()
        db.refresh(repository)

        return repository

    @staticmethod
    def get_stats(repository: Repository) -> dict:

        index = RepositoryService._require_index(repository)

        return build_stats(index, repository.index_status)

    @staticmethod
    def get_files(repository: Repository) -> list[dict]:

        index = RepositoryService._require_index(repository)

        return build_file_tree(index, repository.path)

    @staticmethod
    def get_graph(repository: Repository) -> dict:

        index = RepositoryService._require_index(repository)

        return build_graph(index)

    @staticmethod
    def get_file_content(repository: Repository, path: str) -> dict:

        RepositoryService._require_index(repository)

        try:
            return read_file_content(repository.path, path)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def _require_index(repository: Repository):

        if repository.index_status == "failed":
            raise HTTPException(
                status_code=409,
                detail="Repository indexing failed. Try re-uploading it.",
            )

        if repository.index_status != "ready":
            raise HTTPException(
                status_code=409,
                detail="Repository is still indexing. Try again shortly.",
            )

        try:
            return RepositoryIndexer.get_or_build(
                repository.id,
                repository.path,
            )
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Could not load the repository index.",
            )

    @staticmethod
    def update(
        db: Session,
        repository: Repository,
        data: RepositoryUpdate,
    ):

        if data.name is not None:
            repository.name = data.name

        db.commit()
        db.refresh(repository)

        return repository

    @staticmethod
    def delete(
        db: Session,
        repository: Repository,
    ):

        db.delete(repository)
        db.commit()
