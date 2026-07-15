from pydantic import BaseModel
from typing import Literal

class ProjectCreate(BaseModel):
    title: str
    abstract: str
    department: str
    year: int
    guide_id : int
    technologies: str
    github_link: str | None = None


class ProjectResponse(BaseModel):
    id: int

    title: str
    abstract: str

    department: str
    year: int

    technologies: str

    github_link: str | None

    status: str

    guide_id: int

    guide_name: str

    student_name: str

    class Config:
        from_attributes = True

class ProjectStatusUpdate(BaseModel):
    status: Literal["Pending", "Approved", "Rejected"]

class ProjectEdit(BaseModel):
    title: str
    abstract: str
    department: str
    year: int
    guide_id : int
    technologies: str
    github_link: str | None = None

class FilterOptionsResponse(BaseModel):
    departments: list[str]
    years: list[int]
    guides: list[str]
    technologies: list[str]