from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email : EmailStr
    password : str = Field(min_length=6)