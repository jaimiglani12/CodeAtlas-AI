from sqlalchemy.orm import Session

from app.features.workspace.models import Workspace
from app.features.workspace.schemas import (
    WorkspaceCreate,
    WorkspaceUpdate,
)


class WorkspaceService:

    @staticmethod
    def get_all(db: Session, owner_id: int):

        return (
            db.query(Workspace)
            .filter(Workspace.owner_id == owner_id)
            .order_by(Workspace.created_at.desc())
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        owner_id: int,
        data: WorkspaceCreate,
    ):

        workspace = Workspace(
            name=data.name,
            description=data.description,
            owner_id=owner_id,
        )

        db.add(workspace)
        db.commit()
        db.refresh(workspace)

        return workspace

    @staticmethod
    def update(
        db: Session,
        workspace: Workspace,
        data: WorkspaceUpdate,
    ):

        if data.name is not None:
            workspace.name = data.name

        if data.description is not None:
            workspace.description = data.description

        db.commit()
        db.refresh(workspace)

        return workspace

    @staticmethod
    def delete(
        db: Session,
        workspace: Workspace,
    ):

        db.delete(workspace)
        db.commit()