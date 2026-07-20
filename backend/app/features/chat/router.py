from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.features.auth.models import User
from app.features.auth.security import get_current_user

from app.features.chat.schemas import (
    ChatMessageResponse,
    ChatRequest,
)

from app.features.chat.service import ChatService
from app.features.repository.service import RepositoryService


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.get(
    "/history",
    response_model=list[ChatMessageResponse],
)
def get_chat_history(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    RepositoryService.get_owned(
        db,
        repository_id,
        current_user.id,
    )

    return ChatService.get_history(
        db,
        repository_id,
    )


@router.post(
    "",
    response_model=ChatMessageResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    repository = RepositoryService.get_owned(
        db,
        request.repository_id,
        current_user.id,
    )

    return ChatService.ask(
        db,
        repository,
        request.message,
    )
