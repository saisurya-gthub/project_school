from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    abstract = Column(Text, nullable=False)

    department = Column(String(100), nullable=False)

    year = Column(Integer)

    guide_id = Column(Integer,ForeignKey("users.id"),nullable=False)

    technologies = Column(String(255), nullable=False)

    github_link = Column(String(255), nullable=True)

    report_path = Column(String(255), nullable=True)

    status = Column(String(20), default="Pending")

    student_id = Column(Integer, ForeignKey("users.id"),nullable = False)

    student = relationship("User",foreign_keys=[student_id], back_populates="student_projects")

    guide = relationship("User",foreign_keys=[guide_id],back_populates = "guided_projects")

    @property
    def guide_name(self):
        return self.guide.name

    @property
    def student_name(self):
        return self.student.name