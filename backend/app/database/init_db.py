from app.database.database import Base, engine

from app.models.user import User
from app.models.project import Project


def init_database():
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")


if __name__ == "__main__":
    init_database()