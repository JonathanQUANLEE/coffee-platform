from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CoffeeType(Base):
    __tablename__ = "coffee_types"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    name_cn = Column(String(50), nullable=False)
    name_en = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    category = Column(String(50), nullable=False)  # espresso, brewed, cold, etc.
    short_description = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    flavor_tags = Column(JSON, default=list)
    caffeine_level = Column(String(20), nullable=True)  # low, medium, high
    milk_level = Column(String(20), nullable=True)  # none, little, medium, lots
    bitterness_level = Column(Integer, nullable=True)  # 1-5
    acidity_level = Column(Integer, nullable=True)  # 1-5
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    menu_items = relationship("MenuItem", back_populates="coffee_type")

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    coffee_type_id = Column(String(36), ForeignKey("coffee_types.id"), nullable=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    price = Column(Integer, nullable=True)
    image_url = Column(String(500), nullable=True)
    flavor_tags = Column(JSON, default=list)
    is_signature = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    shop = relationship("CoffeeShop", back_populates="menu_items")
    coffee_type = relationship("CoffeeType", back_populates="menu_items")