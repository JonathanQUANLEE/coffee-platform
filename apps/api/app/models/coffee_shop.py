from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CoffeeShop(Base):
    __tablename__ = "coffee_shops"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    city_id = Column(String(36), ForeignKey("cities.id"), nullable=False)
    district_id = Column(String(36), ForeignKey("districts.id"), nullable=True)
    owner_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    name_en = Column(String(100), nullable=True)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String(1000), nullable=True)
    address = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    phone = Column(String(20), nullable=True)
    avg_price = Column(Integer, nullable=True)
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    favorite_count = Column(Integer, default=0)
    checkin_count = Column(Integer, default=0)
    status = Column(String(20), default="pending")
    is_verified = Column(Boolean, default=False)
    opening_hours = Column(JSON, default=dict)
    features = Column(JSON, default=list)
    cover_image_url = Column(String(500), nullable=True)
    popularity_score = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    city = relationship("City", back_populates="shops")
    district = relationship("District", back_populates="shops")
    owner = relationship("User", backref="owned_shops")
    photos = relationship("ShopPhoto", back_populates="shop", cascade="all, delete-orphan")
    menu_items = relationship("MenuItem", back_populates="shop", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="shop", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="shop", cascade="all, delete-orphan")
    checkins = relationship("Checkin", back_populates="shop", cascade="all, delete-orphan")

class ShopPhoto(Base):
    __tablename__ = "shop_photos"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    url = Column(String(500), nullable=False)
    caption = Column(String(200), nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    shop = relationship("CoffeeShop", back_populates="photos")