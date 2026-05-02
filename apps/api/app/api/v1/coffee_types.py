from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.coffee_type import CoffeeType

router = APIRouter()

class CoffeeTypeResponse(BaseModel):
    id: str
    name_cn: str
    name_en: str
    slug: str
    category: str
    short_description: Optional[str]
    description: Optional[str]
    flavor_tags: List[str]
    caffeine_level: Optional[str]
    milk_level: Optional[str]
    bitterness_level: Optional[int]
    acidity_level: Optional[int]
    image_url: Optional[str]

@router.get("/", response_model=List[CoffeeTypeResponse])
async def list_coffee_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CoffeeType).order_by(CoffeeType.name_cn))
    types = result.scalars().all()
    
    return [
        CoffeeTypeResponse(
            id=str(t.id),
            name_cn=t.name_cn,
            name_en=t.name_en,
            slug=t.slug,
            category=t.category,
            short_description=t.short_description,
            description=t.description,
            flavor_tags=t.flavor_tags or [],
            caffeine_level=t.caffeine_level,
            milk_level=t.milk_level,
            bitterness_level=t.bitterness_level,
            acidity_level=t.acidity_level,
            image_url=t.image_url,
        )
        for t in types
    ]

@router.get("/{slug}", response_model=CoffeeTypeResponse)
async def get_coffee_type(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CoffeeType).where(CoffeeType.slug == slug))
    coffee_type = result.scalar_one_or_none()
    
    if not coffee_type:
        raise HTTPException(status_code=404, detail="Coffee type not found")
    
    return CoffeeTypeResponse(
        id=str(coffee_type.id),
        name_cn=coffee_type.name_cn,
        name_en=coffee_type.name_en,
        slug=coffee_type.slug,
        category=coffee_type.category,
        short_description=coffee_type.short_description,
        description=coffee_type.description,
        flavor_tags=coffee_type.flavor_tags or [],
        caffeine_level=coffee_type.caffeine_level,
        milk_level=coffee_type.milk_level,
        bitterness_level=coffee_type.bitterness_level,
        acidity_level=coffee_type.acidity_level,
        image_url=coffee_type.image_url,
    )