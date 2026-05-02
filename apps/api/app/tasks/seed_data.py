from app.core.database import async_session
from app.models.city import City, District
from app.models.coffee_type import CoffeeType
from app.models.coffee_shop import CoffeeShop
from sqlalchemy import select

CITIES = [
    {"name_cn": "上海", "name_en": "Shanghai", "slug": "shanghai", "province": "上海市", "latitude": 31.2304, "longitude": 121.4737},
    {"name_cn": "北京", "name_en": "Beijing", "slug": "beijing", "province": "北京市", "latitude": 39.9042, "longitude": 116.4074},
    {"name_cn": "深圳", "name_en": "Shenzhen", "slug": "shenzhen", "province": "广东省", "latitude": 22.5431, "longitude": 114.0579},
    {"name_cn": "杭州", "name_en": "Hangzhou", "slug": "hangzhou", "province": "浙江省", "latitude": 30.2741, "longitude": 120.1551},
    {"name_cn": "成都", "name_en": "Chengdu", "slug": "chengdu", "province": "四川省", "latitude": 30.5728, "longitude": 104.0668},
]

DISTRICTS = {
    "shanghai": [
        {"name": "静安区", "slug": "jingan", "latitude": 31.2265, "longitude": 121.4498},
        {"name": "徐汇区", "slug": "xuhui", "latitude": 31.1885, "longitude": 121.4366},
        {"name": "黄浦区", "slug": "huangpu", "latitude": 31.2222, "longitude": 121.4905},
        {"name": "长宁区", "slug": "changning", "latitude": 31.2204, "longitude": 121.4252},
        {"name": "浦东新区", "slug": "pudong", "latitude": 31.2212, "longitude": 121.5443},
    ],
    "beijing": [
        {"name": "朝阳区", "slug": "chaoyang", "latitude": 39.9219, "longitude": 116.4435},
        {"name": "东城区", "slug": "dongcheng", "latitude": 39.9225, "longitude": 116.4191},
        {"name": "西城区", "slug": "xicheng", "latitude": 39.9123, "longitude": 116.3661},
        {"name": "海淀区", "slug": "haidian", "latitude": 39.9591, "longitude": 116.3103},
    ],
}

COFFEE_TYPES = [
    {"name_cn": "美式咖啡", "name_en": "Americano", "slug": "americano", "category": "espresso", "short_description": "经典黑咖啡，口感清爽", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 4, "acidity_level": 3},
    {"name_cn": "拿铁", "name_en": "Latte", "slug": "latte", "category": "espresso", "short_description": "浓缩咖啡配蒸奶，奶香浓郁", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 2, "acidity_level": 2},
    {"name_cn": "卡布奇诺", "name_en": "Cappuccino", "slug": "cappuccino", "category": "espresso", "short_description": "浓缩咖啡配蒸奶和奶泡", "caffeine_level": "medium", "milk_level": "medium", "bitterness_level": 3, "acidity_level": 2},
    {"name_cn": "摩卡", "name_en": "Mocha", "slug": "mocha", "category": "espresso", "short_description": "浓缩咖啡配巧克力和蒸奶", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 2, "acidity_level": 1},
    {"name_cn": "澳白", "name_en": "Flat White", "slug": "flat-white", "category": "espresso", "short_description": "双份浓缩配细腻奶泡", "caffeine_level": "high", "milk_level": "medium", "bitterness_level": 3, "acidity_level": 2},
    {"name_cn": "Dirty", "name_en": "Dirty", "slug": "dirty", "category": "espresso", "short_description": "浓缩咖啡直接倒入冰牛奶", "caffeine_level": "high", "milk_level": "medium", "bitterness_level": 4, "acidity_level": 2},
    {"name_cn": "冷萃咖啡", "name_en": "Cold Brew", "slug": "cold-brew", "category": "cold", "short_description": "冷水长时间萃取，口感顺滑", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 3, "acidity_level": 2},
    {"name_cn": "手冲咖啡", "name_en": "Pour Over", "slug": "pour-over", "category": "brewed", "short_description": "单品咖啡豆手冲，风味纯净", "caffeine_level": "medium", "milk_level": "none", "bitterness_level": 3, "acidity_level": 4},
    {"name_cn": "意式浓缩", "name_en": "Espresso", "slug": "espresso", "category": "espresso", "short_description": "高压萃取，浓郁醇厚", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 5, "acidity_level": 3},
    {"name_cn": "玛奇朵", "name_en": "Macchiato", "slug": "macchiato", "category": "espresso", "short_description": "浓缩咖啡加少量奶泡", "caffeine_level": "high", "milk_level": "little", "bitterness_level": 4, "acidity_level": 3},
]

async def seed_cities():
    async with async_session() as db:
        for city_data in CITIES:
            result = await db.execute(select(City).where(City.slug == city_data["slug"]))
            if not result.scalar_one_or_none():
                city = City(**city_data)
                db.add(city)
                await db.flush()
                
                # Add districts
                if city.slug in DISTRICTS:
                    for district_data in DISTRICTS[city.slug]:
                        district = District(city_id=city.id, **district_data)
                        db.add(district)
        
        await db.commit()
        print("Cities and districts seeded")

async def seed_coffee_types():
    async with async_session() as db:
        for type_data in COFFEE_TYPES:
            result = await db.execute(select(CoffeeType).where(CoffeeType.slug == type_data["slug"]))
            if not result.scalar_one_or_none():
                coffee_type = CoffeeType(**type_data)
                db.add(coffee_type)
        
        await db.commit()
        print("Coffee types seeded")