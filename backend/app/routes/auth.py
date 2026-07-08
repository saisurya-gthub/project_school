from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import RegisterRequest
from app.services.auth_service import register_user

from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import register_user, login_user

from app.core.dependencies import get_db

router_auth = APIRouter()


@router_auth.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(data, db)

@router_auth.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data, db)