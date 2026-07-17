from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.project import router_project as project_router
from app.routes.auth import router_auth as authentication_router
from fastapi.staticfiles import StaticFiles
from app.database.database import Base, engine
from app.models.user import User
from app.models.project import Project
import os

app = FastAPI()
Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

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

app.include_router(
    authentication_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)