from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.interaction import Checkin
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()

class CheckinCreate(BaseModel):
    shop_id: str
    content: Optional[str] = None
    images: List[str] = []

class CheckinResponse(BaseModel):
    id: str
    user: dict
    shop_id: str
    content: Optional[str]
    images: List[str]
    created_at: str

@router.get("/user/me", response_model=List[CheckinResponse])
async def get_my_checkins(
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Checkin)
        .where(Checkin.user_id == current_user.id)
        .order_by(Checkin.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    checkins = result.scalars().all()
    
    return [
        CheckinResponse(
            id=str(c.id),
            user={"id": str(c.user_id), "nickname": current_user.nickname},
            shop_id=str(c.shop_id),
            content=c.content,
            images=c.images or [],
            created_at=str(c.created_at),
        )
        for c in checkins
    ]

@router.post("/", response_model=CheckinResponse)
async def create_checkin(
    request: CheckinCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    checkin = Checkin(
        user_id=current_user.id,
        shop_id=request.shop_id,
        content=request.content,
        images=request.images,
    )
    db.add(checkin)
    await db.flush()
    
    return CheckinResponse(
        id=str(checkin.id),
        user={"id": str(current_user.id), "nickname": current_user.nickname},
        shop_id=str(checkin.shop_id),
        content=checkin.content,
        images=checkin.images or [],
        created_at=str(checkin.created_at),
    )