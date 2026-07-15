from pydantic import BaseModel, EmailStr, Field

from typing import Literal

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["student", "faculty", "admin"]

class LoginRequest(BaseModel):
    email : EmailStr
    password : str = Field(min_length=6)


class FacultyResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    name: str
    email: EmailStr

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str