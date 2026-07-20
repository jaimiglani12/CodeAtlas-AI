from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class RepositoryCreate(BaseModel):
    name: str
    path: str


class RepositoryUpdate(BaseModel):
    name: Optional[str] = None


class RepositoryResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    source: str
    language_summary: str
    file_count: int
    index_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LanguageBreakdown(BaseModel):
    name: str
    percentage: int


class RepositoryStatsResponse(BaseModel):
    languages: list[LanguageBreakdown]
    files: int
    functions: int
    classes: int
    dependencies: int
    embedding_status: str


class FileNode(BaseModel):
    name: str
    path: str
    type: Literal["folder", "file"]
    children: Optional[list["FileNode"]] = None


FileNode.model_rebuild()


class GraphNode(BaseModel):
    id: str
    label: str
    type: Literal["file", "function", "class"]


class GraphEdge(BaseModel):
    source: str
    target: str
    kind: Literal["imports", "calls", "inherits"]


class RepositoryGraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class FileContentResponse(BaseModel):
    path: str
    language: str
    content: str
    truncated: bool
