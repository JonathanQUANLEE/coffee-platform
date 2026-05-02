from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PopularityDaily(Base):
    __tablename__ = "popularity_daily"
    __table_args__ = (UniqueConstraint('shop_id', 'date', name='uq_shop_date'),)
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    date = Column(Date, nullable=False)
    views_count = Column(Integer, default=0)
    favorites_count = Column(Integer, default=0)
    checkins_count = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    rating_avg = Column(Float, default=0)
    popularity_score = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MerchantApplication(Base):
    __tablename__ = "merchant_applications"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    shop_name = Column(String(100), nullable=False)
    contact_name = Column(String(50), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    address = Column(String(200), nullable=False)
    license_image_url = Column(String(500), nullable=True)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    reject_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", backref="merchant_applications")