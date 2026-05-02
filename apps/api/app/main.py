from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import auth, cities, shops, reviews, favorites, checkins, merchant, admin, coffee_types

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(cities.router, prefix="/api/v1/cities", tags=["城市"])
app.include_router(shops.router, prefix="/api/v1/shops", tags=["咖啡馆"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["评价"])
app.include_router(favorites.router, prefix="/api/v1/favorites", tags=["收藏"])
app.include_router(checkins.router, prefix="/api/v1/checkins", tags=["打卡"])
app.include_router(merchant.router, prefix="/api/v1/merchant", tags=["商家"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["管理"])
app.include_router(coffee_types.router, prefix="/api/v1/coffee-types", tags=["咖啡种类"])

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "咖啡热度平台 API", "version": settings.APP_VERSION}

@app.get("/health")
async def health():
    return {"status": "ok"}