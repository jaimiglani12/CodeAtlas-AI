from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    repository_id: int
    message: str


class SourceItem(BaseModel):
    file: str
    lines: str


class ChatMessageResponse(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    sources: Optional[list[SourceItem]] = None
    created_at: datetime
