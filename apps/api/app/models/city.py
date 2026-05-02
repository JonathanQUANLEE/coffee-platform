from sqlalchemy import Column, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class City(Base):
    __tablename__ = "cities"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    name_cn = Column(String(50), nullable=False)
    name_en = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    country = Column(String(50), default="中国")
    province = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    districts = relationship("District", back_populates="city")
    shops = relationship("CoffeeShop", back_populates="city")

class District(Base):
    __tablename__ = "districts"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    city_id = Column(String(36), ForeignKey("cities.id"), nullable=False)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    city = relationship("City", back_populates="districts")
    shops = relationship("CoffeeShop", back_populates="district")