from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.security import hash_password,verify_password,hash_password

from app.models.user import User
from app.schemas.auth import RegisterRequest,UpdateProfileRequest,ChangePasswordRequest

from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def register_user(data: RegisterRequest, db: Session):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(data.password)

    # Create User object
    user = User(
    name=data.name,
    email=data.email,
    password=hashed_password,
    role=data.role
    )

    # Save user
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully"
    }

def login_user(email: str, password: str, db: Session):

    # Find user by email
    user = (
    db.query(User)
    .filter(User.email == email)
    .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        ) 
        

    # Generate JWT token
    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
}

def get_all_faculty(db: Session):

    return (
        db.query(User)
        .filter(User.role == "faculty")
        .order_by(User.name)
        .all()
    )


def get_current_profile(current_user: User):
    return current_user


def update_profile(
    data: UpdateProfileRequest,
    current_user: User,
    db: Session
):
    current_user.name = data.name
    current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully"
    }


def change_password(
    data: ChangePasswordRequest,
    current_user: User,
    db: Session
):
    if not verify_password(
        data.current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message":"Password updated successfully"
    }