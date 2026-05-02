from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.interaction import Review
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()

class ReviewCreate(BaseModel):
    shop_id: str
    rating_overall: int
    rating_taste: Optional[int] = None
    rating_environment: Optional[int] = None
    rating_service: Optional[int] = None
    rating_value: Optional[int] = None
    content: Optional[str] = None
    images: List[str] = []

class ReviewResponse(BaseModel):
    id: str
    user: dict
    rating_overall: int
    rating_taste: Optional[int]
    rating_environment: Optional[int]
    rating_service: Optional[int]
    rating_value: Optional[int]
    content: Optional[str]
    images: List[str]
    created_at: str

@router.get("/shop/{shop_id}", response_model=List[ReviewResponse])
async def get_shop_reviews(
    shop_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Review)
        .where(Review.shop_id == shop_id, Review.status == "visible")
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    reviews = result.scalars().all()
    
    return [
        ReviewResponse(
            id=str(r.id),
            user={"id": str(r.user_id), "nickname": "User"},
            rating_overall=r.rating_overall,
            rating_taste=r.rating_taste,
            rating_environment=r.rating_environment,
            rating_service=r.rating_service,
            rating_value=r.rating_value,
            content=r.content,
            images=r.images or [],
            created_at=str(r.created_at),
        )
        for r in reviews
    ]

@router.post("/", response_model=ReviewResponse)
async def create_review(
    request: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    review = Review(
        user_id=current_user.id,
        shop_id=request.shop_id,
        rating_overall=request.rating_overall,
        rating_taste=request.rating_taste,
        rating_environment=request.rating_environment,
        rating_service=request.rating_service,
        rating_value=request.rating_value,
        content=request.content,
        images=request.images,
    )
    db.add(review)
    await db.flush()
    
    return ReviewResponse(
        id=str(review.id),
        user={"id": str(current_user.id), "nickname": current_user.nickname},
        rating_overall=review.rating_overall,
        rating_taste=review.rating_taste,
        rating_environment=review.rating_environment,
        rating_service=review.rating_service,
        rating_value=review.rating_value,
        content=review.content,
        images=review.images or [],
        created_at=str(review.created_at),
    )