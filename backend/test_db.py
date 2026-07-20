from app.core.database import engine

with engine.connect() as conn:
    result = conn.exec_driver_sql("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name='workspaces'
        ORDER BY ordinal_position;
    """)

    for row in result:
        print(row[0])