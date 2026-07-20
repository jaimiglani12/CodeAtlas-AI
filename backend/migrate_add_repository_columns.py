"""
One-off migration: adds the columns that RepositoryService/RepositoryResponse
now expect on the `repositories` table (source, file_count, language_summary).

Base.metadata.create_all() only creates missing tables, it never alters an
existing one, so this has to be applied by hand once. Safe to run multiple
times and safe to delete after running.
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))

STATEMENTS = [
    "ALTER TABLE repositories ADD COLUMN IF NOT EXISTS source VARCHAR DEFAULT 'upload'",
    "ALTER TABLE repositories ADD COLUMN IF NOT EXISTS file_count INTEGER DEFAULT 0",
    "ALTER TABLE repositories ADD COLUMN IF NOT EXISTS language_summary VARCHAR DEFAULT ''",
]

with engine.begin() as conn:
    for statement in STATEMENTS:
        print("Running:", statement)
        conn.execute(text(statement))

print("Done. The repositories table now has source/file_count/language_summary.")
