from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.models.interaction import Favorite
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()

class FavoriteResponse(BaseModel):
    id: str
    shop_id: str
    created_at: str

@router.get("/", response_model=List[FavoriteResponse])
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
    )
    favorites = result.scalars().all()
    
    return [
        FavoriteResponse(
            id=str(f.id),
            shop_id=str(f.shop_id),
            created_at=str(f.created_at),
        )
        for f in favorites
    ]

@router.post("/{shop_id}")
async def add_favorite(
    shop_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if already favorited
    existing = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.shop_id == shop_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already favorited")
    
    favorite = Favorite(user_id=current_user.id, shop_id=shop_id)
    db.add(favorite)
    await db.flush()
    
    return {"message": "Added to favorites"}

@router.delete("/{shop_id}")
async def remove_favorite(
    shop_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.shop_id == shop_id
        )
    )
    favorite = result.scalar_one_or_none()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    await db.delete(favorite)
    return {"message": "Removed from favorites"}