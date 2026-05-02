from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from uuid import uuid4
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterRequest(BaseModel):
    email: str
    password: str
    nickname: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="无效token")
    except JWTError:
        raise HTTPException(status_code=401, detail="无效token")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user

@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="邮箱已被注册")
    
    user = User(
        id=str(uuid4()),
        nickname=request.nickname,
        email=request.email,
        password_hash=pwd_context.hash(request.password),
    )
    db.add(user)
    await db.flush()
    
    token = create_access_token(data={"sub": user.id})
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "nickname": user.nickname,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "role": user.role,
        }
    }

@router.post("/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user or not pwd_context.verify(request.password, user.password_hash or ""):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    
    token = create_access_token(data={"sub": user.id})
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "nickname": user.nickname,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "role": user.role,
        }
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nickname": current_user.nickname,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "role": current_user.role,
    }

@router.put("/me")
async def update_me(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if request.nickname:
        current_user.nickname = request.nickname
    if request.avatar_url:
        current_user.avatar_url = request.avatar_url
    await db.flush()
    return {
        "id": current_user.id,
        "nickname": current_user.nickname,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "role": current_user.role,
    }