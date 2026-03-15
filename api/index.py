from fastapi import FastAPI
from typing import List
from pydantic import BaseModel

app = FastAPI()

# This is a 'Schema' - big companies use these to ensure data is correct
class Employee(BaseModel):
    id: int
    name: str
    role: str
    department: str
    status: str

# Mock database - later we can connect this to PostgreSQL
employees_db = [
    {"id": 1, "name": "Bhaskar Roy", "role": "System Architect", "department": "Engineering", "status": "Active"},
    {"id": 2, "name": "Jane Doe", "role": "Product Manager", "department": "Product", "status": "On Leave"},
]

@app.get("/api/python")
def hello_world():
    return {"message": "Hello from FastAPI running on Vercel!"}

@app.get("/api/employees", response_model=List[Employee])
def get_all_employees():
    return employees_db
