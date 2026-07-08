from sqlalchemy.orm import Session
from app.core.security import hash_password

from app.models.user import User
from app.schemas.auth import RegisterRequest

from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def register_user(data: RegisterRequest, db: Session):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        return {"message": "Email already registered"}

    # Hash password
    hashed_password = hash_password(data.password)

    # Create User object
    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password=hashed_password
    )

    # Save user
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully"
    }

def login_user(data: LoginRequest, db: Session):

    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return {
            "message": "Invalid email or password"
        }

    # Verify password
    if not verify_password(data.password, user.password):
        return {
            "message": "Invalid email or password"
        }

    # Generate JWT token
    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }