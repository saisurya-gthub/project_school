from fastapi import APIRouter
from app.schemas.auth import RegisterRequest

router_auth = APIRouter()

@router_auth.post("/register")
def register(data : RegisterRequest):
    return {
        "message" : "User received successfully",
        "data" : data
    
    }