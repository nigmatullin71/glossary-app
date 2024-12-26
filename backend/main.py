from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlite3 import Connection
from backend.database import get_db_connection, init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080","http://127.0.0.1:8080", "http://frontend:8080"],  # адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

class TermCreate(BaseModel):
    term: str
    definition: str

class TermUpdate(BaseModel):
    definition: str

# Получение всех терминов
@app.get("/terms", response_model=List[dict])
def get_terms():
    conn = get_db_connection()
    terms = conn.execute("SELECT * FROM terms").fetchall()
    conn.close()
    return [dict(term) for term in terms]

# Получение конкретного термина по названию
@app.get("/terms/{term}", response_model=dict)
def get_term(term: str):
    conn = get_db_connection()
    result = conn.execute("SELECT * FROM terms WHERE term = ?", (term,)).fetchone()
    conn.close()
    if result:
        return dict(result)
    raise HTTPException(status_code=404, detail="Term not found")

# Добавление нового термина
@app.post("/terms", response_model=dict)
def add_term(term: TermCreate):
    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO terms (term, definition) VALUES (?, ?)", (term.term, term.definition))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    conn.close()
    return {"term": term.term, "definition": term.definition}

# Обновление термина
@app.put("/terms/{term}", response_model=dict)
def update_term(term: str, update_data: TermUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE terms SET definition = ? WHERE term = ?", (update_data.definition, term))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Term not found")
    conn.commit()
    conn.close()
    return {"term": term, "definition": update_data.definition}

# Удаление термина
@app.delete("/terms/{term}", response_model=dict)
def delete_term(term: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM terms WHERE term = ?", (term,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Term not found")
    conn.commit()
    conn.close()
    return {"message": f"Term '{term}' deleted successfully"}
