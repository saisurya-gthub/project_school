from fastapi import APIRouter
router = APIRouter()

@router.post("/projects")
def create_project():
    return {
        "message" : "Project created successfully"
    }
@router.get("/projects")
def get_projects():
    return {
        "message" : "List of projects"
    }
@router.get("/projects/test")
def test() : {
    "status" : "project Router not Working"
}