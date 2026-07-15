from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.dependencies.auth import (
    get_current_user,
    get_current_student,
    get_current_faculty
)

from app.models.user import User

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectStatusUpdate,
    ProjectEdit,
    FilterOptionsResponse
)

from app.services.project_service import (
    create_project,
    get_all_my_projects,
    get_project_by_id,
    get_review_queue,
    update_project_status,
    edit_project,
    delete_project,
    browse_projects,
    get_filter_options,
    upload_project_report,
    download_project_report,
    get_all_projects
)

router_project = APIRouter()


# -----------------------------
# Upload Project (Student Only)
# -----------------------------
@router_project.post(
    "/upload",
    response_model=ProjectResponse
)
def upload_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    return create_project(
        db=db,
        project=project,
        current_user=current_user
    )


# -----------------------------
# Get My Projects
# -----------------------------
@router_project.get(
    "/all-my-projects",
    response_model=list[ProjectResponse]
)
def my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_my_projects(
        current_user=current_user,
        db=db
    )



# -----------------------------
# Get All Projects
# -----------------------------
@router_project.get(
    "/all",
    response_model=list[ProjectResponse]
)
def all_projects(
    db: Session =Depends(get_db),
    current_user: User = Depends(get_current_faculty)
):
    return get_all_projects(db)

# -----------------------------
# Approve / Reject Project
# Faculty/Admin Only
# -----------------------------
@router_project.put("/{project_id}/status")
def change_status(
    project_id: int,
    data: ProjectStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_faculty)
):
    return update_project_status(
        project_id=project_id,
        status=data.status,
        db=db
    )


# -----------------------------
# Edit Project (Student Only)
# -----------------------------
@router_project.put(
    "/edit/{project_id}",
    response_model=ProjectResponse
)
def update(
    project_id: int,
    project: ProjectEdit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    return edit_project(
        project_id=project_id,
        project=project,
        db=db,
        current_user=current_user
    )


# -----------------------------
# Delete Project (Student Only)
# -----------------------------
@router_project.delete("/delete/{project_id}")
def delete(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    return delete_project(
        project_id=project_id,
        db=db,
        current_user=current_user
    )


# -----------------------------
# Browse Projects (Public)
# -----------------------------
@router_project.get(
    "/browse",
    response_model=list[ProjectResponse]
)
def browse(
    department: Optional[str] = None,
    year: Optional[int] = None,
    guide: Optional[str] = None,
    technology: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return browse_projects(
        db=db,
        department=department,
        year=year,
        guide=guide,
        technology=technology
    )


# -----------------------------
# Filter Options (Public)
# -----------------------------
@router_project.get(
    "/filter-options",
    response_model=FilterOptionsResponse
)
def filter_options(
    db: Session = Depends(get_db)
):
    return get_filter_options(db)


# -----------------------------
# Upload Report (Student Only)
# -----------------------------
@router_project.post("/upload-report/{project_id}")
def upload_report(
    project_id: int,
    report: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    return upload_project_report(
        project_id=project_id,
        report=report,
        db=db,
        current_user=current_user
    )


# Download Report (Public)
@router_project.get("/download-report/{project_id}")
def download_report(
    project_id: int,
    db: Session = Depends(get_db)
):
    return download_project_report(
        project_id=project_id,
        db=db
    )


# -----------------------------
# Get Project for review (faculty)
# -----------------------------
@router_project.get(
    "/review",
    response_model=list[ProjectResponse]
)
def review_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_faculty)
):
    return get_review_queue(
        db=db,
        current_user=current_user,
    )


# -----------------------------
# Get Project By ID (Public)
# -----------------------------
@router_project.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    return get_project_by_id(
        project_id=project_id,
        db=db
    )