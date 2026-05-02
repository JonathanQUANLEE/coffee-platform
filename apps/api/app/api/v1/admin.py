from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.database import get_db
from app.models.analytics import MerchantApplication
from app.models.user import User
from app.models.coffee_shop import CoffeeShop
from app.models.interaction import Review
from app.api.v1.auth import get_current_user

router = APIRouter()

class AdminUser(User):
    pass

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    shop_name: str
    contact_name: str
    contact_phone: str
    address: str
    license_image_url: Optional[str]
    status: str
    reject_reason: Optional[str]
    created_at: str

class ApplicationReview(BaseModel):
    reject_reason: Optional[str] = None

@router.get("/merchant-applications", response_model=List[ApplicationResponse])
async def list_merchant_applications(
    status: Optional[str] = None,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(MerchantApplication)
    if status:
        query = query.where(MerchantApplication.status == status)
    query = query.order_by(MerchantApplication.created_at.desc())
    
    result = await db.execute(query)
    applications = result.scalars().all()
    
    return [
        ApplicationResponse(
            id=str(a.id),
            user_id=str(a.user_id),
            shop_name=a.shop_name,
            contact_name=a.contact_name,
            contact_phone=a.contact_phone,
            address=a.address,
            license_image_url=a.license_image_url,
            status=a.status,
            reject_reason=a.reject_reason,
            created_at=str(a.created_at),
        )
        for a in applications
    ]

@router.patch("/merchant-applications/{application_id}/approve")
async def approve_application(
    application_id: str,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MerchantApplication).where(MerchantApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = "approved"
    application.reviewed_at = datetime.utcnow()
    
    return {"message": "Application approved"}

@router.patch("/merchant-applications/{application_id}/reject")
async def reject_application(
    application_id: str,
    request: ApplicationReview,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MerchantApplication).where(MerchantApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = "rejected"
    application.reject_reason = request.reject_reason
    application.reviewed_at = datetime.utcnow()
    
    return {"message": "Application rejected"}

@router.get("/reviews")
async def list_reviews(
    status: Optional[str] = None,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Review)
    if status:
        query = query.where(Review.status == status)
    query = query.order_by(Review.created_at.desc()).limit(100)
    
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    return [
        {
            "id": str(r.id),
            "user_id": str(r.user_id),
            "shop_id": str(r.shop_id),
            "rating": r.rating_overall,
            "content": r.content,
            "status": r.status,
            "created_at": str(r.created_at),
        }
        for r in reviews
    ]

@router.patch("/reviews/{review_id}/hide")
async def hide_review(
    review_id: str,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.status = "hidden"
    return {"message": "Review hidden"}