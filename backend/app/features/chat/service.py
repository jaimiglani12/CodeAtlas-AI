import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.features.chat.models import ChatMessage
from app.features.chat.schemas import ChatMessageResponse
from app.features.repository.indexer import RepositoryIndexer
from app.features.repository.models import Repository

from engine.retrieval.hybrid_retriever import HybridRetriever
from engine.retrieval.context_expander import ContextExpander
from engine.llm.prompt_builder import PromptBuilder
from engine.llm.chat_engine import ChatEngine


class ChatService:

    @staticmethod
    def ask(
        db: Session,
        repository: Repository,
        question: str,
    ) -> ChatMessageResponse:

        if repository.index_status == "failed":
            raise HTTPException(
                status_code=400,
                detail="Repository indexing failed. Re-upload it before chatting.",
            )

        if repository.index_status != "ready":
            raise HTTPException(
                status_code=400,
                detail="Repository is still indexing. Try again shortly.",
            )

        try:
            index = RepositoryIndexer.get_or_build(
                repository.id,
                repository.path,
            )
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Could not load the repository index.",
            )

        if index is None:
            raise HTTPException(
                status_code=400,
                detail="Repository not indexed.",
            )

        user_message = ChatMessage(
            repository_id=repository.id,
            role="user",
            content=question,
        )

        db.add(user_message)
        db.commit()

        if not index.chunks:

            assistant_message = ChatMessage(
                repository_id=repository.id,
                role="assistant",
                content=(
                    "I couldn't find any indexed functions or classes in this "
                    "repository, so I don't have anything to answer from. "
                    "Right now this tool only extracts functions/classes from "
                    "Python files — if this repo is in another language, that's "
                    "likely why."
                ),
            )

            db.add(assistant_message)
            db.commit()
            db.refresh(assistant_message)

            return ChatService._to_response(assistant_message)

        retriever = HybridRetriever(index)

        results = retriever.retrieve(question)

        results = ContextExpander(index).expand(question, results)

        prompt = PromptBuilder().build(
            question,
            results,
        )

        answer = ChatEngine().generate(prompt)

        citations = ChatService._build_citations(results)

        assistant_message = ChatMessage(
            repository_id=repository.id,
            role="assistant",
            content=answer,
            sources=json.dumps(citations) if citations else None,
        )

        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)

        return ChatService._to_response(assistant_message)

    @staticmethod
    def get_history(
        db: Session,
        repository_id: int,
    ) -> list[ChatMessageResponse]:

        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.repository_id == repository_id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )

        return [ChatService._to_response(m) for m in messages]

    @staticmethod
    def _build_citations(results, limit: int = 5) -> list[dict]:

        seen = set()
        citations = []

        for result in results:

            chunk = result["chunk"]

            if chunk.file_path in seen:
                continue

            seen.add(chunk.file_path)

            citations.append({
                "file": chunk.file_path,
                "lines": f"{chunk.start_line}-{chunk.end_line}",
            })

            if len(citations) >= limit:
                break

        return citations

    @staticmethod
    def _to_response(message: ChatMessage) -> ChatMessageResponse:

        sources = json.loads(message.sources) if message.sources else None

        return ChatMessageResponse(
            id=str(message.id),
            role=message.role,
            content=message.content,
            sources=sources,
            created_at=message.created_at,
        )
