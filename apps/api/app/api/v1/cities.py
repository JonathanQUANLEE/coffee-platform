from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.city import City, District
from app.models.coffee_shop import CoffeeShop

router = APIRouter()

class CityResponse(BaseModel):
    id: str
    name_cn: str
    name_en: str
    slug: str
    province: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

class CityWithStatsResponse(CityResponse):
    total_shops: int = 0
    avg_rating: float = 0

class DistrictResponse(BaseModel):
    id: str
    name: str
    slug: str

@router.get("/", response_model=List[CityWithStatsResponse])
async def list_cities(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(City).where(City.is_active == True).offset(skip).limit(limit)
    )
    cities = result.scalars().all()
    
    response = []
    for city in cities:
        # Get shop stats
        shop_count_result = await db.execute(
            select(CoffeeShop).where(CoffeeShop.city_id == city.id)
        )
        shops = shop_count_result.scalars().all()
        
        response.append(CityWithStatsResponse(
            id=str(city.id),
            name_cn=city.name_cn,
            name_en=city.name_en,
            slug=city.slug,
            province=city.province,
            latitude=city.latitude,
            longitude=city.longitude,
            total_shops=len(shops),
            avg_rating=sum(s.rating for s in shops) / len(shops) if shops else 0,
        ))
    
    return response

@router.get("/{city_id}", response_model=CityWithStatsResponse)
async def get_city(city_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    # Get shop stats
    shop_count_result = await db.execute(
        select(CoffeeShop).where(CoffeeShop.city_id == city.id)
    )
    shops = shop_count_result.scalars().all()
    
    return CityWithStatsResponse(
        id=str(city.id),
        name_cn=city.name_cn,
        name_en=city.name_en,
        slug=city.slug,
        province=city.province,
        latitude=city.latitude,
        longitude=city.longitude,
        total_shops=len(shops),
        avg_rating=sum(s.rating for s in shops) / len(shops) if shops else 0,
    )

@router.get("/{city_id}/districts", response_model=List[DistrictResponse])
async def list_districts(city_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(District).where(District.city_id == city_id)
    )
    districts = result.scalars().all()
    
    return [
        DistrictResponse(
            id=str(d.id),
            name=d.name,
            slug=d.slug,
        )
        for d in districts
    ]