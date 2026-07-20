# CodeAtlas AI

An AI-powered repository understanding platform. Upload a codebase, get it indexed by a custom analysis engine (tree-sitter parsing, embeddings, call-graph resolution), then explore it through a Cursor-style three-panel UI and chat with an LLM that's grounded in your actual code.

## Features

- **Multi-language structural parsing** — tree-sitter grammars for Python, JavaScript, TypeScript/TSX, Java, C, C++, Go, and Rust give full function/class/import/call-graph extraction. ~15 more languages (Ruby, PHP, C#, Kotlin, Swift, HTML/CSS, SQL, YAML, etc.) are recognized and indexed as searchable text even without an AST.
- **Hybrid retrieval** — combines BM25 keyword search, dense embedding similarity (`sentence-transformers`), dependency-graph expansion, and symbol lookup, then reranks before sending context to the LLM.
- **Repo-grounded chat** — powered by Groq (`llama-3.3-70b-versatile`) via LangChain.
- **Workspaces** — repositories are organized under user-owned workspaces.
- **JWT auth** — signup/login/password change.
- **Three-panel repository explorer** — file tree, code view, and chat side by side (React + TypeScript).
- **Retrieval evaluation harness** — a benchmark + metrics setup for measuring retrieval quality.

## Tech Stack

**Backend:** FastAPI, PostgreSQL + pgvector, SQLAlchemy, tree-sitter, sentence-transformers, scikit-learn, rank-bm25, LangChain + langchain-groq, python-jose + passlib (auth)

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, React Hook Form, shadcn/ui, Axios

## Project Structure
CodeAtlas-AI/
├── backend/
│ ├── app/ # FastAPI application
│ │ ├── main.py # entrypoint — registers all routers
│ │ ├── core/ # config.py, database.py (SQLAlchemy engine/session)
│ │ ├── api/ # health check endpoint
│ │ └── features/
│ │ ├── auth/ # signup / login / JWT / password change
│ │ ├── workspace/ # workspace CRUD
│ │ ├── repository/ # upload, indexing trigger, stats, file tree, file content, dep graph
│ │ └── chat/ # chat history + RAG chat endpoint
│ ├── engine/ # the repository-understanding engine
│ │ ├── scanner/ # walks the repo, skips ignored folders, maps extension → language
│ │ ├── parser/ # tree-sitter parsers per language
│ │ ├── metadata/ # extracts functions/classes/imports/calls from the AST
│ │ ├── chunker/ # one chunk per function/class, or ≤3000-char text chunks otherwise
│ │ ├── embeddings/ # sentence-transformers embedder (all-MiniLM-L6-v2)
│ │ ├── graph/ # call/dependency graph
│ │ ├── resolver/ # cross-file symbol resolution
│ │ ├── index/ # in-memory RepositoryIndex (files, functions, classes, imports)
│ │ ├── cache/ # per-repository index cache
│ │ ├── retrieval/ # BM25 + dense + graph + symbol retrievers, hybrid combiner, reranker
│ │ ├── llm/ # Groq-backed chat engine + prompt builder
│ │ ├── builder/ # orchestrates scan → parse → extract → chunk → embed
│ │ ├── analyzer/ # repository-level stats
│ │ └── evaluation/ # benchmark.json + evaluator + metrics
│ └── requirements.txt
└── frontend/
├── src/
│ ├── api/ # axios clients (auth, workspace, repository, chat)
│ ├── components/ # auth, chat, common, dashboard, landing, repository, workspace
│ ├── context/ # AuthContext
│ ├── layouts/ # AuthLayout, DashboardLayout
│ ├── pages/ # Landing, Login, Signup, Dashboard, Workspace, Repository, Settings
│ └── routes/ # AppRoutes, ProtectedRoute
└── package.json

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL with the `pgvector` extension enabled
- A [Groq API key](https://console.groq.com) (for chat)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
SECRET_KEY=<a-long-random-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=<your-groq-api-key>

Run it:

```bash
uvicorn app.main:app --reload
```

Tables are created automatically on startup (`Base.metadata.create_all`). The API comes up at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` — this is the origin currently allowed in the backend's CORS config.

## API Overview

| Router | Prefix | Handles |
|---|---|---|
| Auth | `/auth` | signup, login, current user, change password |
| Workspace | `/workspace` | CRUD, scoped to the logged-in user |
| Repository | `/repository` | create/upload, list, stats, file tree, file content, dependency graph, update, delete |
| Chat | `/chat` | chat history, send message (RAG over the indexed repository) |

## How Indexing Works

1. **Scan** — walk the repo, skip `.git`, `node_modules`, `venv`, `build`, `dist`, etc.; map each file extension to a language.
2. **Parse** — build an AST for the 9 tree-sitter-backed languages.
3. **Extract** — pull functions, classes, imports, and calls out of the AST.
4. **Chunk** — one chunk per function/class where possible; everything else is split into ≤3000-character text chunks.
5. **Embed** — each chunk is embedded with `all-MiniLM-L6-v2`.
6. **Graph + resolve** — build the call/dependency graph and resolve symbols across files.
7. **Cache** — the resulting index is cached in memory per repository.

At query time, `HybridRetriever` merges BM25 + dense results, expands them along the dependency graph, reranks, and hands the context to `ChatEngine` (Groq).

## Evaluation

`backend/engine/evaluation/` has a benchmark (`benchmark.json`), an evaluator, and metrics for scoring retrieval quality — useful when tuning the hybrid retriever's weighting.

## Known Cleanup Items

- `backend/main.py` is a minimal, unused stray FastAPI app — the real entrypoint is `backend/app/main.py`.
- `backend/repository.json` and `backend/engine_zip.zip` are currently committed; consider `.gitignore`-ing them if they're generated artifacts.
