from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class Repository(Base):

    __tablename__ = "repositories"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    path = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        default="PENDING",
    )

    source = Column(
        String,
        default="upload",
    )

    file_count = Column(
        Integer,
        default=0,
    )

    language_summary = Column(
        String,
        default="",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False,
    )

    workspace = relationship(
        "Workspace",
        back_populates="repositories",
    )

    @property
    def index_status(self) -> str:
        return (self.status or "pending").lower()
