from sqlalchemy.orm import Session, joinedload
from fastapi.responses import FileResponse
import os
import shutil
from fastapi import UploadFile
from fastapi import HTTPException
from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectEdit
)

#create project
def create_project(
    db: Session,
    project: ProjectCreate,
    current_user: User
):
    new_project = Project(
        title=project.title,
        abstract=project.abstract,
        department=project.department,
        year=project.year,

        guide_id=project.guide_id,

        technologies=project.technologies,

        github_link=project.github_link,

        student_id=current_user.id,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


#get project by id
def get_project_by_id(
    project_id: int,
    db: Session
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project

#update project status
def update_project_status(
    project_id: int,
    status: str,
    db: Session
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.status = status

    db.commit()
    db.refresh(project)

    return project

#get all my projects
def get_all_my_projects(
    db: Session,
    current_user: User
):
    projects = (
        db.query(Project)
        .filter(Project.student_id == current_user.id)
        .all()
    )

    return projects

#get all projects 
def get_all_projects(db: Session):

    return (
        db.query(Project)
        .options(
            joinedload(Project.guide),
            joinedload(Project.student),
        )
        .order_by(Project.id.desc())
        .all()
    )


#edit project
def edit_project(
    project_id: int,
    project: ProjectEdit,
    db: Session,
    current_user: User
):
    existing_project = (
    db.query(Project)
    .filter(Project.id == project_id)
    .first()
)
    if existing_project is None:
        raise HTTPException(
        status_code=404,
        detail="Project not found"
    )
    if existing_project.student_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only edit your own project"
        )
    existing_project.title = project.title

    existing_project.abstract = project.abstract

    existing_project.department = project.department

    existing_project.year = project.year

    existing_project.guide_id = project.guide_id

    existing_project.technologies = project.technologies

    existing_project.github_link = project.github_link
    db.commit()

    db.refresh(existing_project)

    return existing_project

#delete project
def delete_project(
    project_id: int,
    db: Session,
    current_user: User
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    if project.student_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own project"
        )

    db.delete(project)
    db.commit()

    return {
    "message": "Project deleted successfully"
    }


#Browse projects
def browse_projects(
    db: Session,
    department: str | None = None,
    year: int | None = None,
    guide: str | None = None,
    technology: str | None = None
):

    query = (
        db.query(Project)
        .filter(Project.status == "Approved")
    )

    if department:
        query = query.filter(
            Project.department == department
        )

    if year:
        query = query.filter(
            Project.year == year
        )

    if guide:
        query = (
            query.join(Project.guide)
            .filter(User.name == guide)
        )

    if technology:
        query = query.filter(
            Project.technologies.ilike(
                f"%{technology}%"
            )
        )

    return query.all()


#fetching filter options
def get_filter_options(db: Session):

    departments = (
        db.query(Project.department)
        .filter(Project.status == "Approved")
        .distinct()
        .all()
    )

    department_list = [department for (department,) in departments]


    years = (
        db.query(Project.year)
        .filter(Project.status == "Approved")
        .distinct()
        .all()
    )

    year_list = [year for (year,) in years]


    guides = (
        db.query(User.name)
        .join(Project, Project.guide_id == User.id)
        .filter(Project.status == "Approved")
        .distinct()
        .all()
    )

    guide_list = [g for (g,) in guides]


    technology_rows = (
        db.query(Project.technologies)
        .filter(Project.status == "Approved")
        .all()
    )

    technology_set = set()

    for row in technology_rows:
        tech_list = row.technologies.split(",")

        for tech in tech_list:
            technology_set.add(
                tech.strip()
            )


    return {
        "departments": sorted(department_list),
        "years": sorted(year_list),
        "guides": sorted(guide_list),
        "technologies": sorted(technology_set)
    }


#upload project report
def upload_project_report(
    project_id: int,
    report: UploadFile,
    db: Session,
    current_user: User
):

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if report.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
    if project.student_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only upload a report for your own project"
        )

    UPLOAD_FOLDER = "uploads/reports"

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    filename = f"project_{project_id}.pdf"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            report.file,
            buffer
        )

    project.report_path = file_path

    db.commit()
    db.refresh(project)

    return {
    "message": "Report uploaded successfully",
    "report_path": file_path
    }


#download project report
def download_project_report(
    project_id: int,
    db: Session
):

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if not project.report_path:
        raise HTTPException(
            status_code=404,
            detail="Report not uploaded"
        )

    if not os.path.exists(project.report_path):
        raise HTTPException(
            status_code=404,
            detail="Report file not found"
        )

    return FileResponse(
        path=project.report_path,
        media_type="application/pdf",
        filename=f"project_{project_id}.pdf"
    )


#get project for review 
def get_review_queue(
    db: Session,
    current_user: User
):
    return (
        db.query(Project)
        .filter(Project.guide_id == current_user.id)
        .order_by(Project.id.desc())
        .all()
    )