from app.database.database import Base, engine

# Import all models here
from app.models.user import User


def init_database():
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully!")


if __name__ == "__main__":
    init_database()