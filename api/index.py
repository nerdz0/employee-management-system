from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

app = FastAPI()

# --- Big Company Security: CORS ---
# This allows your Next.js frontend to safely talk to your Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd replace "*" with your actual domain
    allow_methods=["*"],
    allow_headers=["*"],
)

class Employee(BaseModel):
    id: int
    name: str
    role: str
    department: str
    status: str

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