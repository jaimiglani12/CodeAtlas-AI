from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db

from app.features.auth.models import User
from app.features.auth.security import get_current_user

from app.features.workspace.models import Workspace

from app.features.repository.models import Repository
from app.features.repository.schemas import (
    FileContentResponse,
    FileNode,
    RepositoryCreate,
    RepositoryGraphResponse,
    RepositoryResponse,
    RepositoryStatsResponse,
    RepositoryUpdate,
)
from app.features.repository.service import RepositoryService

router = APIRouter(
    prefix="/repository",
    tags=["Repository"],
)


def _get_owned_workspace(
    workspace_id: int,
    db: Session,
    current_user: User,
) -> Workspace:

    workspace = (
        db.query(Workspace)
        .filter(
            Workspace.id == workspace_id,
            Workspace.owner_id == current_user.id,
        )
        .first()
    )

    if workspace is None:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found",
        )

    return workspace


@router.get(
    "/workspace/{workspace_id}",
    response_model=list[RepositoryResponse],
)
def get_repositories(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    _get_owned_workspace(workspace_id, db, current_user)

    return RepositoryService.get_all(
        db,
        workspace_id,
    )


@router.post(
    "/workspace/{workspace_id}",
    response_model=RepositoryResponse,
)
def create_repository(
    workspace_id: int,
    data: RepositoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    _get_owned_workspace(workspace_id, db, current_user)

    return RepositoryService.create(
        db,
        workspace_id,
        data,
    )


@router.post(
    "/upload",
    response_model=RepositoryResponse,
)
def upload_repository(
    workspace_id: int = Form(...),
    name: str = Form(...),
    file: Optional[UploadFile] = File(None),
    github_url: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    _get_owned_workspace(workspace_id, db, current_user)

    return RepositoryService.create_from_upload(
        db,
        workspace_id,
        name,
        file.file if file else None,
        github_url or None,
    )


@router.get(
    "/{repository_id}",
    response_model=RepositoryResponse,
)
def get_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )


@router.get(
    "/{repository_id}/stats",
    response_model=RepositoryStatsResponse,
)
def get_repository_stats(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return RepositoryService.get_stats(repository)


@router.get(
    "/{repository_id}/files",
    response_model=list[FileNode],
)
def get_repository_files(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return RepositoryService.get_files(repository)


@router.get(
    "/{repository_id}/files/content",
    response_model=FileContentResponse,
)
def get_repository_file_content(
    repository_id: int,
    path: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return RepositoryService.get_file_content(repository, path)


@router.get(
    "/{repository_id}/graph",
    response_model=RepositoryGraphResponse,
)
def get_repository_graph(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return RepositoryService.get_graph(repository)


@router.put(
    "/{repository_id}",
    response_model=RepositoryResponse,
)
def update_repository(
    repository_id: int,
    data: RepositoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return RepositoryService.update(
        db,
        repository,
        data,
    )


@router.delete("/{repository_id}")
def delete_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    RepositoryService.delete(
        db,
        repository,
    )

    return {
        "message": "Repository deleted successfully"
    }
