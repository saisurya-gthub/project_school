from fastapi import APIRouter
router_project = APIRouter()

@router_project.post("/projects")
def create_project():
    return {
        "message" : "Project created successfully"
    }
@router_project.get("/projects")
def get_projects():
    return {
        "message" : "List of projects"
    }
@router_project.get("/projects/test")
def test() : {
    "status" : "project Router not Working"
}