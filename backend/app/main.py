from fastapi import FastAPI
from app.routes.project import router as project_router

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Welcome to College Project Repository API"
    }

app.include_router(
    project_router,
    prefix="/projects",
    tags=["Projects"]
)