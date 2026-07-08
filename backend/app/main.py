from fastapi import FastAPI
from app.routes.project import router_project as project_router
from app.routes.auth import router_auth as authentication_router

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


app.include_router(
    authentication_router,
    prefix = "/auth",
    tags=["Authentication"]
)