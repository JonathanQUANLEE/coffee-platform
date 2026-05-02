from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.analytics import MerchantApplication
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()

class MerchantApplyRequest(BaseModel):
    shop_name: str
    contact_name: str
    contact_phone: str
    address: str
    license_image_url: Optional[str] = None

class MerchantApplicationResponse(BaseModel):
    id: str
    shop_name: str
    status: str
    reject_reason: Optional[str]
    created_at: str

@router.post("/apply", response_model=MerchantApplicationResponse)
async def apply_merchant(
    request: MerchantApplyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    application = MerchantApplication(
        user_id=current_user.id,
        shop_name=request.shop_name,
        contact_name=request.contact_name,
        contact_phone=request.contact_phone,
        address=request.address,
        license_image_url=request.license_image_url,
    )
    db.add(application)
    await db.flush()
    
    return MerchantApplicationResponse(
        id=str(application.id),
        shop_name=application.shop_name,
        status=application.status,
        reject_reason=application.reject_reason,
        created_at=str(application.created_at),
    )

@router.get("/my-applications", response_model=List[MerchantApplicationResponse])
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MerchantApplication)
        .where(MerchantApplication.user_id == current_user.id)
        .order_by(MerchantApplication.created_at.desc())
    )
    applications = result.scalars().all()
    
    return [
        MerchantApplicationResponse(
            id=str(a.id),
            shop_name=a.shop_name,
            status=a.status,
            reject_reason=a.reject_reason,
            created_at=str(a.created_at),
        )
        for a in applications
    ]