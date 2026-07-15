from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    FacultyResponse,
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest)
from app.services.auth_service import (
    change_password,
    register_user,
    login_user,
    get_all_faculty,
    get_current_profile,
    update_profile
)

router_auth = APIRouter()


@router_auth.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register_user(data, db)


@router_auth.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return login_user(
        email=form_data.username,
        password=form_data.password,
        db=db
    )


@router_auth.get(
    "/faculty",
    response_model=list[FacultyResponse]
)
def faculty_list(
    db: Session = Depends(get_db)
):
    return get_all_faculty(db)


@router_auth.get(
    "/me",
    response_model=UserProfileResponse
)
def my_profile(
    current_user: User = Depends(get_current_user)
):
    return get_current_profile(current_user)

@router_auth.put("/profile")
def update_my_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_profile(
        data=data,
        current_user=current_user,
        db=db
    )

@router_auth.put("/change-password")
def update_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return change_password(
        data=data,
        current_user=current_user,
        db=db
    )