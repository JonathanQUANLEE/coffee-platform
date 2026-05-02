from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, server_default="(lower(hex(randomblob(16))))")
    nickname = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(200), nullable=True)
    role = Column(String(20), default="user", nullable=False)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())