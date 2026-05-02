from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    rating_overall = Column(Integer, nullable=False)  # 1-5
    rating_taste = Column(Integer, nullable=True)  # 1-5
    rating_environment = Column(Integer, nullable=True)  # 1-5
    rating_service = Column(Integer, nullable=True)  # 1-5
    rating_value = Column(Integer, nullable=True)  # 1-5
    content = Column(Text, nullable=True)
    images = Column(JSON, default=list)
    status = Column(String(20), default="visible")  # visible, hidden, pending
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="reviews")
    shop = relationship("CoffeeShop", back_populates="reviews")

class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint('user_id', 'shop_id', name='uq_user_shop_favorite'),)
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="favorites")
    shop = relationship("CoffeeShop", back_populates="favorites")

class Checkin(Base):
    __tablename__ = "checkins"
    
    id = Column(String(36), primary_key=True, server_default="gen_random_uuid()")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    shop_id = Column(String(36), ForeignKey("coffee_shops.id"), nullable=False)
    content = Column(Text, nullable=True)
    images = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="checkins")
    shop = relationship("CoffeeShop", back_populates="checkins")