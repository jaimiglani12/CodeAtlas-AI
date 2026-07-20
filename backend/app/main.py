from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.core.config import settings
from app.core.database import Base
from app.core.database import engine

from app.features.auth.models import User
from app.features.auth.router import router as auth_router
from app.features.workspace.models import Workspace
from app.features.workspace.router import router as workspace_router
from app.features.repository.models import Repository
from app.features.repository.router import router as repository_router
from app.features.chat.models import ChatMessage
from app.features.chat.router import router as chat_router
app = FastAPI(

    title=settings.PROJECT_NAME,

    version=settings.VERSION,

    description=settings.DESCRIPTION

)

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)
Base.metadata.create_all(bind=engine)
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(repository_router)
app.include_router(chat_router)
@app.get("/")
def root():

    return {

        "message": "Welcome to CodeAtlas AI"

    }
