"""
Auth routes.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.db.mongo_client import db
from src.auth.utils import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
async def register(req: AuthRequest):
    user = await db.users.find_one({"username": req.username})
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(req.password)
    await db.users.insert_one(
        {"username": req.username, "hashed_password": hashed_password}
    )

    access_token = create_access_token(data={"sub": req.username})
    return {"token": access_token}


@router.post("/login")
async def login(req: AuthRequest):
    user = await db.users.find_one({"username": req.username})
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": req.username})
    return {"token": access_token}
