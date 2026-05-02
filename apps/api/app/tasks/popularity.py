from datetime import datetime, timedelta
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.coffee_shop import CoffeeShop
from app.models.interaction import Favorite, Checkin, Review
from app.models.analytics import PopularityDaily

async def calculate_popularity():
    """Calculate daily popularity scores for all active shops"""
    async with async_session() as db:
        # Get all active shops
        result = await db.execute(
            select(CoffeeShop).where(CoffeeShop.status == "active")
        )
        shops = result.scalars().all()
        
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)
        
        for shop in shops:
            # Calculate scores based on recent activity
            # View score (simplified - in real app would track views)
            view_score = shop.popularity_score * 0.3  # Base from previous
            
            # Favorite score
            favorites_result = await db.execute(
                select(func.count(Favorite.id)).where(
                    Favorite.shop_id == shop.id,
                    Favorite.created_at >= datetime.combine(yesterday, datetime.min.time())
                )
            )
            favorite_count = favorites_result.scalar() or 0
            favorite_score = min(favorite_count * 10, 100)
            
            # Checkin score
            checkins_result = await db.execute(
                select(func.count(Checkin.id)).where(
                    Checkin.shop_id == shop.id,
                    Checkin.created_at >= datetime.combine(yesterday, datetime.min.time())
                )
            )
            checkin_count = checkins_result.scalar() or 0
            checkin_score = min(checkin_count * 15, 100)
            
            # Review score
            reviews_result = await db.execute(
                select(func.count(Review.id)).where(
                    Review.shop_id == shop.id,
                    Review.created_at >= datetime.combine(yesterday, datetime.min.time())
                )
            )
            review_count = reviews_result.scalar() or 0
            review_score = min(review_count * 20, 100)
            
            # Rating score
            rating_score = shop.rating * 20  # Max 100 for 5-star
            
            # Trend score (simplified)
            trend_score = 50  # Base score
            
            # Calculate final popularity score
            popularity_score = (
                view_score * 0.20 +
                favorite_score * 0.20 +
                checkin_score * 0.20 +
                review_score * 0.15 +
                rating_score * 0.15 +
                trend_score * 0.10
            )
            
            # Update shop
            shop.popularity_score = round(popularity_score, 2)
            
            # Save daily record
            daily_record = PopularityDaily(
                shop_id=shop.id,
                date=today,
                views_count=0,  # Would track in real app
                favorites_count=favorite_count,
                checkins_count=checkin_count,
                reviews_count=review_count,
                rating_avg=shop.rating,
                popularity_score=round(popularity_score, 2),
            )
            db.add(daily_record)
        
        await db.commit()
        print(f"Updated popularity for {len(shops)} shops")