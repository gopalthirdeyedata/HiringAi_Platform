from database import engine
from sqlalchemy import text

# Add the started_at column to the assessments table
with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE assessments ADD COLUMN started_at DATETIME NULL AFTER created_at'))
        conn.commit()
        print('✓ Column started_at added successfully to assessments table')
    except Exception as e:
        if '1060' in str(e):  # Duplicate column error
            print('✓ Column started_at already exists')
        else:
            print(f'✗ Error: {e}')
            raise
