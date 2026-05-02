from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.coffee_shop import CoffeeShop, ShopPhoto
from app.models.city import City, District
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()

class ShopResponse(BaseModel):
    id: str
    name: str
    name_en: Optional[str]
    slug: str
    description: Optional[str]
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    avg_price: Optional[int]
    rating: float
    review_count: int
    favorite_count: int
    checkin_count: int
    status: str
    is_verified: bool
    opening_hours: dict
    features: list
    cover_image_url: Optional[str]
    popularity_score: float

class ShopDetailResponse(ShopResponse):
    city: Optional[dict]
    district: Optional[dict]
    photos: List[dict]
    menu_items: List[dict]

class ShopListResponse(BaseModel):
    id: str
    name: str
    name_en: Optional[str]
    slug: str
    address: str
    avg_price: Optional[int]
    rating: float
    review_count: int
    favorite_count: int
    cover_image_url: Optional[str]
    popularity_score: float
    distance: Optional[float] = None

@router.get("/", response_model=List[ShopListResponse])
async def list_shops(
    city_id: Optional[str] = None,
    district_id: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None,
    features: Optional[str] = None,  # comma separated
    sort_by: str = "popularity_score",
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(CoffeeShop).where(CoffeeShop.status == "active")
    
    if city_id:
        query = query.where(CoffeeShop.city_id == city_id)
    if district_id:
        query = query.where(CoffeeShop.district_id == district_id)
    if min_price is not None:
        query = query.where(CoffeeShop.avg_price >= min_price)
    if max_price is not None:
        query = query.where(CoffeeShop.avg_price <= max_price)
    if min_rating is not None:
        query = query.where(CoffeeShop.rating >= min_rating)
    
    # Sort
    if sort_by == "popularity_score":
        query = query.order_by(CoffeeShop.popularity_score.desc())
    elif sort_by == "rating":
        query = query.order_by(CoffeeShop.rating.desc())
    elif sort_by == "review_count":
        query = query.order_by(CoffeeShop.review_count.desc())
    elif sort_by == "newest":
        query = query.order_by(CoffeeShop.created_at.desc())
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    shops = result.scalars().all()
    
    return [
        ShopListResponse(
            id=str(shop.id),
            name=shop.name,
            name_en=shop.name_en,
            slug=shop.slug,
            address=shop.address,
            avg_price=shop.avg_price,
            rating=shop.rating,
            review_count=shop.review_count,
            favorite_count=shop.favorite_count,
            cover_image_url=shop.cover_image_url,
            popularity_score=shop.popularity_score,
        )
        for shop in shops
    ]

@router.get("/{shop_id}", response_model=ShopDetailResponse)
async def get_shop(shop_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CoffeeShop).where(CoffeeShop.id == shop_id))
    shop = result.scalar_one_or_none()
    
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    # Get photos
    photos_result = await db.execute(
        select(ShopPhoto).where(ShopPhoto.shop_id == shop.id).order_by(ShopPhoto.sort_order)
    )
    photos = photos_result.scalars().all()
    
    # Get city and district
    city_result = await db.execute(select(City).where(City.id == shop.city_id))
    city = city_result.scalar_one_or_none()
    
    district_result = await db.execute(select(District).where(District.id == shop.district_id))
    district = district_result.scalar_one_or_none()
    
    return ShopDetailResponse(
        id=str(shop.id),
        name=shop.name,
        name_en=shop.name_en,
        slug=shop.slug,
        description=shop.description,
        address=shop.address,
        latitude=shop.latitude,
        longitude=shop.longitude,
        phone=shop.phone,
        avg_price=shop.avg_price,
        rating=shop.rating,
        review_count=shop.review_count,
        favorite_count=shop.favorite_count,
        checkin_count=shop.checkin_count,
        status=shop.status,
        is_verified=shop.is_verified,
        opening_hours=shop.opening_hours,
        features=shop.features,
        cover_image_url=shop.cover_image_url,
        popularity_score=shop.popularity_score,
        city={"id": str(city.id), "name_cn": city.name_cn, "name_en": city.name_en} if city else None,
        district={"id": str(district.id), "name": district.name} if district else None,
        photos=[{"id": str(p.id), "url": p.url, "caption": p.caption} for p in photos],
        menu_items=[],
    )

@router.get("/search/")
async def search_shops(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    query = select(CoffeeShop).where(
        CoffeeShop.status == "active",
        CoffeeShop.name.contains(q)
    ).limit(limit)
    
    result = await db.execute(query)
    shops = result.scalars().all()
    
    return [
        {
            "id": str(shop.id),
            "name": shop.name,
            "city": "上海",  # 需要关联查询
            "district": "静安区",  # 需要关联查询
            "address": shop.address,
            "rating": shop.rating,
            "avg_price": shop.avg_price,
            "features": shop.features,
        }
        for shop in shops
    ]

@router.get("/ranking/{city_id}")
async def get_city_ranking(
    city_id: str,
    ranking_type: str = "popularity",
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(CoffeeShop).where(
        CoffeeShop.city_id == city_id,
        CoffeeShop.status == "active"
    )
    
    if ranking_type == "popularity":
        query = query.order_by(CoffeeShop.popularity_score.desc())
    elif ranking_type == "rating":
        query = query.order_by(CoffeeShop.rating.desc())
    elif ranking_type == "reviews":
        query = query.order_by(CoffeeShop.review_count.desc())
    elif ranking_type == "favorites":
        query = query.order_by(CoffeeShop.favorite_count.desc())
    
    query = query.limit(limit)
    
    result = await db.execute(query)
    shops = result.scalars().all()
    
    return [
        {
            "rank": idx + 1,
            "id": str(shop.id),
            "name": shop.name,
            "name_en": shop.name_en,
            "rating": shop.rating,
            "review_count": shop.review_count,
            "popularity_score": shop.popularity_score,
            "cover_image_url": shop.cover_image_url,
        }
        for idx, shop in enumerate(shops)
    ]