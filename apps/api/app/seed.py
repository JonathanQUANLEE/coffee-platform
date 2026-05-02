"""
种子数据脚本 - 灌入真实咖啡馆数据到MySQL
运行方式: python -m app.seed
"""
import asyncio
from uuid import uuid4
from datetime import datetime, timedelta
import random

from app.core.database import engine, async_session, Base
from app.models.user import User
from app.models.city import City, District
from app.models.coffee_shop import CoffeeShop, ShopPhoto
from app.models.coffee_type import CoffeeType, MenuItem
from app.models.interaction import Review, Favorite, Checkin
from app.models.analytics import PopularityDaily


# ==================== 城市数据 ====================
CITIES = [
    {"name_cn": "上海", "name_en": "Shanghai", "slug": "shanghai", "province": "上海", "latitude": 31.23, "longitude": 121.47},
    {"name_cn": "北京", "name_en": "Beijing", "slug": "beijing", "province": "北京", "latitude": 39.90, "longitude": 116.40},
    {"name_cn": "广州", "name_en": "Guangzhou", "slug": "guangzhou", "province": "广东", "latitude": 23.13, "longitude": 113.26},
    {"name_cn": "深圳", "name_en": "Shenzhen", "slug": "shenzhen", "province": "广东", "latitude": 22.54, "longitude": 114.06},
    {"name_cn": "杭州", "name_en": "Hangzhou", "slug": "hangzhou", "province": "浙江", "latitude": 30.27, "longitude": 120.15},
    {"name_cn": "成都", "name_en": "Chengdu", "slug": "chengdu", "province": "四川", "latitude": 30.57, "longitude": 104.07},
]

DISTRICTS = {
    "上海": ["浦东新区", "静安区", "黄浦区", "徐汇区", "长宁区", "虹口区", "杨浦区"],
    "北京": ["朝阳区", "东城区", "西城区", "海淀区", "丰台区"],
    "广州": ["天河区", "越秀区", "海珠区", "荔湾区", "白云区"],
    "深圳": ["南山区", "福田区", "罗湖区", "宝安区", "龙岗区"],
    "杭州": ["西湖区", "上城区", "拱墅区", "滨江区", "萧山区"],
    "成都": ["锦江区", "青羊区", "武侯区", "高新区", "成华区"],
}

# ==================== 真实咖啡馆数据 ====================
SHOPS_DATA = [
    # 上海
    {"name": "Manner Coffee陆家嘴店", "city": "上海", "district": "浦东新区", "address": "上海市浦东新区陆家嘴环路1000号", "rating": 4.8, "avg_price": 20, "features": "高性价比,自带杯减5元,快速出品", "popularity": 98},
    {"name": "Manner Coffee静安店", "city": "上海", "district": "静安区", "address": "上海市静安区南京西路1515号", "rating": 4.7, "avg_price": 22, "features": "高性价比,写字楼,白领最爱", "popularity": 95},
    {"name": "Manner Coffee徐汇店", "city": "上海", "district": "徐汇区", "address": "上海市徐汇区淮海中路999号", "rating": 4.7, "avg_price": 20, "features": "高性价比,商场店,品质稳定", "popularity": 93},
    {"name": "Seesaw Coffee愚园路店", "city": "上海", "district": "静安区", "address": "上海市静安区愚园路1018号", "rating": 4.7, "avg_price": 45, "features": "精品咖啡,创意特调,空间设计", "popularity": 95},
    {"name": "Seesaw Coffee新天地店", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区太仓路181号", "rating": 4.6, "avg_price": 48, "features": "创意特调,新天地,约会圣地", "popularity": 92},
    {"name": "%Arabica新天地店", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区新天地太仓路181号", "rating": 4.6, "avg_price": 55, "features": "网红打卡,日系简约,拍照圣地", "popularity": 93},
    {"name": "%Arabica武康路店", "city": "上海", "district": "徐汇区", "address": "上海市徐汇区武康路376号", "rating": 4.5, "avg_price": 55, "features": "武康路,梧桐区,拍照好看", "popularity": 90},
    {"name": "Blue Bottle Coffee", "city": "上海", "district": "静安区", "address": "上海市静安区南京西路1376号", "rating": 4.9, "avg_price": 65, "features": "精品咖啡,新鲜烘焙,世界顶级", "popularity": 97},
    {"name": "星巴克臻选上海烘焙工坊", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区南京西路789号", "rating": 4.5, "avg_price": 48, "features": "全球最大星巴克,现场烘焙,咖啡体验", "popularity": 88},
    {"name": "Peet's Coffee南京西路店", "city": "上海", "district": "静安区", "address": "上海市静安区南京西路1266号", "rating": 4.6, "avg_price": 38, "features": "深度烘焙,美式传统,精品咖啡之父", "popularity": 86},
    {"name": "M Stand新天地店", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区马当路245号", "rating": 4.5, "avg_price": 42, "features": "工业风,创意咖啡,一店一设计", "popularity": 89},
    {"name": "M Stand武康路店", "city": "上海", "district": "徐汇区", "address": "上海市徐汇区武康路98号", "rating": 4.4, "avg_price": 42, "features": "武康路,梧桐区,拍照好看", "popularity": 87},
    {"name": "Metal Hands铁手咖啡永嘉路店", "city": "上海", "district": "徐汇区", "address": "上海市徐汇区永嘉路309弄", "rating": 4.8, "avg_price": 35, "features": "精品手冲,社区咖啡,豆子丰富", "popularity": 92},
    {"name": "Metal Hands铁手咖啡愚园路店", "city": "上海", "district": "长宁区", "address": "上海市长宁区愚园路1088号", "rating": 4.7, "avg_price": 35, "features": "精品手冲,愚园路,安静", "popularity": 89},
    {"name": "Egg Coffee鸡蛋咖啡", "city": "上海", "district": "静安区", "address": "上海市静安区愚园路1018号", "rating": 4.7, "avg_price": 32, "features": "创意咖啡,性价比高,社区氛围", "popularity": 87},
    {"name": "Distrito Coffee", "city": "上海", "district": "静安区", "address": "上海市静安区延平路135号", "rating": 4.8, "avg_price": 38, "features": "自烘豆,精品咖啡,专业冲煮", "popularity": 91},
    {"name": "堀口咖啡", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区圆明园路169号", "rating": 4.7, "avg_price": 58, "features": "日式精品,手冲大师,安静空间", "popularity": 90},
    {"name": "Onirii Coffee", "city": "上海", "district": "徐汇区", "address": "上海市徐汇区武康路376号", "rating": 4.6, "avg_price": 42, "features": "精品手冲,武康路,拍照好看", "popularity": 88},
    {"name": "O.P.S. Cafe", "city": "上海", "district": "静安区", "address": "上海市静安区太原路177号", "rating": 4.7, "avg_price": 48, "features": "创意特调,精品咖啡,太原路", "popularity": 86},
    {"name": "Tequila Espresso", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区南昌路204号", "rating": 4.5, "avg_price": 42, "features": "创意咖啡,夜间营业,南昌路", "popularity": 84},
    {"name": "Rumors Coffee", "city": "上海", "district": "静安区", "address": "上海市静安区奉贤路118号", "rating": 4.6, "avg_price": 40, "features": "精品手冲,安静,专业", "popularity": 86},
    {"name": "FUMI Coffee", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区南昌路204号", "rating": 4.7, "avg_price": 45, "features": "创意特调,精品咖啡,南昌路", "popularity": 87},
    {"name": "Slab Town", "city": "上海", "district": "静安区", "address": "上海市静安区富民路184号", "rating": 4.6, "avg_price": 42, "features": "精品咖啡,富民路,安静", "popularity": 86},
    {"name": "Radar Coffee", "city": "上海", "district": "静安区", "address": "上海市静安区奉贤路118号", "rating": 4.5, "avg_price": 38, "features": "精品手冲,安静,专业", "popularity": 84},
    {"name": "Drops", "city": "上海", "district": "黄浦区", "address": "上海市黄浦区南昌路204号", "rating": 4.6, "avg_price": 42, "features": "创意特调,精品咖啡,南昌路", "popularity": 85},
    # 北京
    {"name": "Metal Hands铁手咖啡五道营店", "city": "北京", "district": "东城区", "address": "北京市东城区五道营胡同59号", "rating": 4.8, "avg_price": 35, "features": "精品手冲,胡同文化,社区咖啡", "popularity": 94},
    {"name": "Metal Hands铁手咖啡鼓楼店", "city": "北京", "district": "东城区", "address": "北京市东城区鼓楼东大街227号", "rating": 4.7, "avg_price": 35, "features": "精品手冲,鼓楼,胡同", "popularity": 88},
    {"name": "Fisheye鱼眼咖啡三里屯店", "city": "北京", "district": "朝阳区", "address": "北京市朝阳区三里屯太古里", "rating": 4.6, "avg_price": 42, "features": "创意特调,网红打卡,三里屯地标", "popularity": 90},
    {"name": "Voyage Coffee南锣鼓巷店", "city": "北京", "district": "东城区", "address": "北京市东城区南锣鼓巷82号", "rating": 4.7, "avg_price": 38, "features": "精品手冲,南锣鼓巷,胡同文化", "popularity": 89},
    {"name": "Cafe de Lugano", "city": "北京", "district": "朝阳区", "address": "北京市朝阳区三里屯路19号", "rating": 4.5, "avg_price": 45, "features": "精品咖啡,三里屯,时尚", "popularity": 86},
    {"name": "大小咖啡五道营店", "city": "北京", "district": "东城区", "address": "北京市东城区五道营胡同42号", "rating": 4.6, "avg_price": 32, "features": "精品手冲,胡同,社区", "popularity": 85},
    {"name": "Metal Hands铁手咖啡朝外店", "city": "北京", "district": "朝阳区", "address": "北京市朝阳区朝外大街乙6号", "rating": 4.7, "avg_price": 35, "features": "精品手冲,朝外,商务", "popularity": 87},
    {"name": "Berry Beans前门店", "city": "北京", "district": "西城区", "address": "北京市西城区前门大栅栏杨梅竹斜街16号", "rating": 4.6, "avg_price": 40, "features": "精品手冲,前门,历史街区", "popularity": 86},
    {"name": "Soloist Coffee朝阳店", "city": "北京", "district": "朝阳区", "address": "北京市朝阳区朝外大街乙6号", "rating": 4.5, "avg_price": 38, "features": "精品手冲,朝阳,安静", "popularity": 84},
    {"name": "Moka Bros三里屯店", "city": "北京", "district": "朝阳区", "address": "北京市朝阳区三里屯太古里北区", "rating": 4.4, "avg_price": 42, "features": "精品咖啡,三里屯,时尚", "popularity": 83},
    # 广州
    {"name": "Something Coffee", "city": "广州", "district": "越秀区", "address": "广州市越秀区东山口庙前西街36号", "rating": 4.7, "avg_price": 35, "features": "社区咖啡,东山口文化,手冲", "popularity": 88},
    {"name": ".jpg咖啡体育西路店", "city": "广州", "district": "天河区", "address": "广州市天河区体育西路191号", "rating": 4.6, "avg_price": 28, "features": "高性价比,连锁品牌,快速出品", "popularity": 86},
    {"name": "Nearly Coffee", "city": "广州", "district": "越秀区", "address": "广州市越秀区东山口署前路1号", "rating": 4.7, "avg_price": 38, "features": "精品手冲,东山口,老洋房", "popularity": 87},
    {"name": "So A Coffee天河南店", "city": "广州", "district": "天河区", "address": "广州市天河区天河南一路48号", "rating": 4.5, "avg_price": 35, "features": "精品咖啡,天河南,社区", "popularity": 84},
    {"name": "Sheep Cafe", "city": "广州", "district": "海珠区", "address": "广州市海珠区江南西路青凤大街1号", "rating": 4.6, "avg_price": 32, "features": "精品手冲,江南西,安静", "popularity": 83},
    {"name": "PP Coffee东山口店", "city": "广州", "district": "越秀区", "address": "广州市越秀区东山口龟岗路1号", "rating": 4.5, "avg_price": 30, "features": "社区咖啡,东山口,性价比", "popularity": 82},
    {"name": "Hope Coffee珠江新城店", "city": "广州", "district": "天河区", "address": "广州市天河区珠江新城华就路12号", "rating": 4.5, "avg_price": 40, "features": "精品咖啡,珠江新城,商务", "popularity": 84},
    {"name": "来回咖啡天河店", "city": "广州", "district": "天河区", "address": "广州市天河区天河路228号", "rating": 4.4, "avg_price": 35, "features": "精品手冲,天河,社区", "popularity": 82},
    {"name": "陆山客厅", "city": "广州", "district": "越秀区", "address": "广州市越秀区东山口庙前西街18号", "rating": 4.6, "avg_price": 38, "features": "精品咖啡,老洋房,东山口", "popularity": 85},
    {"name": "玫瑰咖啡东山口店", "city": "广州", "district": "越秀区", "address": "广州市越秀区东山口署前路8号", "rating": 4.5, "avg_price": 35, "features": "精品手冲,东山口,老洋房", "popularity": 83},
    # 深圳
    {"name": "KUDDO COFFEE科技园店", "city": "深圳", "district": "南山区", "address": "深圳市南山区科技园科苑路8号", "rating": 4.7, "avg_price": 35, "features": "精品手冲,科技园,高性价比", "popularity": 88},
    {"name": "AKIMBO CAFE海上世界店", "city": "深圳", "district": "南山区", "address": "深圳市南山区蛇口海上世界", "rating": 4.6, "avg_price": 42, "features": "精品咖啡,海上世界,海景", "popularity": 87},
    {"name": "Forrest Coffee中心城店", "city": "深圳", "district": "福田区", "address": "深圳市福田区中心城", "rating": 4.5, "avg_price": 38, "features": "精品咖啡,中心城,商务", "popularity": 85},
    {"name": "Something For华侨城店", "city": "深圳", "district": "南山区", "address": "深圳市南山区华侨城创意园", "rating": 4.6, "avg_price": 36, "features": "精品手冲,华侨城,创意园", "popularity": 86},
    {"name": "FeeCoffee福田店", "city": "深圳", "district": "福田区", "address": "深圳市福田区福华三路", "rating": 4.4, "avg_price": 32, "features": "社区咖啡,手冲,福田", "popularity": 83},
    {"name": "集福咖啡南山店", "city": "深圳", "district": "南山区", "address": "深圳市南山区南海大道", "rating": 4.5, "avg_price": 40, "features": "精品咖啡,创意,南山", "popularity": 84},
    # 杭州
    {"name": "九月咖啡龙井路店", "city": "杭州", "district": "西湖区", "address": "杭州市西湖区龙井路1号", "rating": 4.7, "avg_price": 38, "features": "西湖,环境优美,手冲", "popularity": 87},
    {"name": "Hous Coffee南山路店", "city": "杭州", "district": "上城区", "address": "杭州市上城区南山路218号", "rating": 4.6, "avg_price": 42, "features": "精品手冲,南山路,安静", "popularity": 86},
    {"name": "Random Coffee西湖店", "city": "杭州", "district": "西湖区", "address": "杭州市西湖区北山街", "rating": 4.5, "avg_price": 40, "features": "精品手冲,西湖,创意", "popularity": 85},
    {"name": "1%咖啡河坊街店", "city": "杭州", "district": "上城区", "address": "杭州市上城区河坊街", "rating": 4.4, "avg_price": 35, "features": "精品咖啡,河坊街,老街", "popularity": 83},
    {"name": "沙县咖啡西湖店", "city": "杭州", "district": "西湖区", "address": "杭州市西湖区龙井路", "rating": 4.3, "avg_price": 30, "features": "社区咖啡,手冲,西湖", "popularity": 82},
    {"name": "Creeper Coffee上城店", "city": "杭州", "district": "上城区", "address": "杭州市上城区延安路", "rating": 4.5, "avg_price": 38, "features": "精品手冲,安静,上城", "popularity": 84},
    # 成都
    {"name": "瑞幸咖啡天府店", "city": "成都", "district": "高新区", "address": "成都市高新区天府大道中段688号", "rating": 4.2, "avg_price": 18, "features": "高性价比,便捷服务,本土品牌", "popularity": 84},
    {"name": "Nuage Coffee太古里店", "city": "成都", "district": "锦江区", "address": "成都市锦江区太古里", "rating": 4.6, "avg_price": 42, "features": "精品咖啡,太古里,时尚", "popularity": 86},
    {"name": "Let's Grind锦江店", "city": "成都", "district": "锦江区", "address": "成都市锦江区春熙路", "rating": 4.5, "avg_price": 35, "features": "精品手冲,社区,春熙路", "popularity": 85},
    {"name": "UID Cafe武侯店", "city": "成都", "district": "武侯区", "address": "成都市武侯区科华北路", "rating": 4.4, "avg_price": 38, "features": "精品咖啡,创意,武侯", "popularity": 83},
    {"name": "常识咖啡锦江店", "city": "成都", "district": "锦江区", "address": "成都市锦江区红星路", "rating": 4.3, "avg_price": 32, "features": "社区咖啡,手冲,锦江", "popularity": 82},
    {"name": "白胡子咖啡青羊店", "city": "成都", "district": "青羊区", "address": "成都市青羊区宽窄巷子", "rating": 4.5, "avg_price": 40, "features": "精品手冲,宽窄巷子,老街", "popularity": 84},
]

# ==================== 评论模板 ====================
REVIEW_TEMPLATES = [
    "这家的{drink}真的很好喝，强烈推荐！",
    "环境很不错，适合{activity}。咖啡品质也很好。",
    "第三次来了，{drink}是我的最爱。店员服务态度也很好。",
    "价格合理，性价比很高。推荐大家来试试。",
    "和朋友一起来的，大家都觉得不错。{drink}很推荐。",
    "位置很好找，环境安静。适合一个人来喝咖啡。",
    "店里的氛围很舒服，{drink}做得很好。",
    "周末来的，人有点多，但是{drink}值得等。",
    "外卖点过很多次了，品质一直很稳定。",
    "第一次来，被{drink}惊艳到了。以后会常来。",
    "朋友推荐的，果然没失望。{drink}很好喝。",
    "环境很有设计感，适合拍照。{drink}也不错。",
    "价格比其他店便宜，但品质不输。{drink}推荐。",
    "下班后来坐坐，很放松。{drink}是今天的惊喜。",
    "咖啡师很专业，给我推荐了{drink}，很满意。",
    "这里的{drink}是我喝过最好的之一。",
    "环境干净整洁，{drink}做得很好。会再来。",
    "和闺蜜来的，点了{drink}和蛋糕，完美的下午茶。",
    "出差来这个城市，找到这家店很幸运。{drink}很棒。",
    "早上的{drink}开启美好的一天。",
    "这里的{drink}很特别，和其他店不一样。",
    "安静的环境，好喝的{drink}，完美的组合。",
    "每次来都点{drink}，从没让我失望过。",
    "店里的音乐很好听，{drink}也很好喝。",
    "带朋友来的，他们都说{drink}很好喝。",
    "下雨天来喝{drink}，特别有感觉。",
    "这里的{drink}让我爱上了咖啡。",
    "工作日人不多，很安静。{drink}品质很好。",
    "外卖送得很快，{drink}还是热的。",
    "性价比超高，{drink}价格便宜品质好。",
]

DRINKS = ["拿铁", "美式", "dirty", "手冲", "澳白", "卡布奇诺", "摩卡", "冷萃"]
ACTIVITIES = ["办公", "看书", "聊天", "拍照", "下午茶", "独处", "约会", "学习"]
SOURCES = ["大众点评", "小红书", "B站", "抖音"]
USERNAMES = [
    "咖啡爱好者", "打工人", "周末探店", "咖啡小白", "精品咖啡控",
    "下午茶时光", "拍照达人", "上班族", "学生党", "自由职业者",
    "咖啡日记", "探店小能手", "美食博主", "生活家", "咖啡新手",
    "魔都吃货", "帝都探店", "羊城美食", "鹏城生活", "杭城漫步",
]


async def seed():
    """灌入种子数据"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as db:
        # 0. 创建系统用户（用于评论）
        system_user = User(
            id="system-user-001",
            nickname="系统用户",
            email="system@coffee.com",
            role="user",
        )
        db.add(system_user)
        await db.flush()
        
        # 1. 创建城市和商圈
        city_map = {}
        district_map = {}
        
        for city_data in CITIES:
            city = City(id=str(uuid4()), **city_data)
            db.add(city)
            city_map[city_data["name_cn"]] = city.id
            
            for dist_name in DISTRICTS[city_data["name_cn"]]:
                district = District(
                    id=str(uuid4()),
                    city_id=city.id,
                    name=dist_name,
                    slug=dist_name.lower().replace("区", ""),
                )
                db.add(district)
                district_map[f"{city_data['name_cn']}-{dist_name}"] = district.id
        
        await db.flush()
        
        # 2. 创建咖啡馆
        shop_ids = []
        for shop_data in SHOPS_DATA:
            city_key = shop_data["city"]
            dist_key = f"{shop_data['city']}-{shop_data['district']}"
            
            shop = CoffeeShop(
                id=str(uuid4()),
                city_id=city_map[city_key],
                district_id=district_map.get(dist_key),
                name=shop_data["name"],
                slug=shop_data["name"].lower().replace(" ", "-").replace("'", ""),
                address=shop_data["address"],
                rating=shop_data["rating"],
                review_count=0,
                avg_price=shop_data["avg_price"],
                features=shop_data["features"].split(","),
                description=f"{shop_data['name']}是{shop_data['city']}{shop_data['district']}的知名咖啡馆，以{shop_data['features'].split(',')[0]}著称。",
                status="active",
                is_verified=True,
                popularity_score=shop_data["popularity"],
            )
            db.add(shop)
            shop_ids.append(shop.id)
        
        await db.flush()
        
        # 3. 创建评论
        for shop_id in shop_ids:
            for i in range(50):
                template = random.choice(REVIEW_TEMPLATES)
                drink = random.choice(DRINKS)
                activity = random.choice(ACTIVITIES)
                content = template.replace("{drink}", drink).replace("{activity}", activity)
                
                review = Review(
                    id=str(uuid4()),
                    shop_id=shop_id,
                    user_id="system-user-001",
                    rating_overall=random.choice([4, 4, 4, 5, 5, 5, 5]),
                    content=content,
                    status="visible",
                    created_at=datetime.now() - timedelta(days=random.randint(0, 90)),
                )
                db.add(review)
        
        # 4. 创建咖啡种类
        coffee_types_data = [
            {"name_cn": "美式咖啡", "name_en": "Americano", "slug": "americano", "category": "espresso", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 3, "acidity_level": 3},
            {"name_cn": "拿铁", "name_en": "Latte", "slug": "latte", "category": "espresso", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 2, "acidity_level": 1},
            {"name_cn": "卡布奇诺", "name_en": "Cappuccino", "slug": "cappuccino", "category": "espresso", "caffeine_level": "medium", "milk_level": "medium", "bitterness_level": 3, "acidity_level": 2},
            {"name_cn": "意式浓缩", "name_en": "Espresso", "slug": "espresso", "category": "espresso", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 5, "acidity_level": 3},
            {"name_cn": "摩卡", "name_en": "Mocha", "slug": "mocha", "category": "espresso", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 2, "acidity_level": 1},
            {"name_cn": "馥芮白", "name_en": "Flat White", "slug": "flat-white", "category": "espresso", "caffeine_level": "high", "milk_level": "medium", "bitterness_level": 3, "acidity_level": 2},
            {"name_cn": "冷萃咖啡", "name_en": "Cold Brew", "slug": "cold-brew", "category": "cold", "caffeine_level": "high", "milk_level": "none", "bitterness_level": 3, "acidity_level": 1},
            {"name_cn": "手冲咖啡", "name_en": "Pour Over", "slug": "pour-over", "category": "brewed", "caffeine_level": "medium", "milk_level": "none", "bitterness_level": 3, "acidity_level": 4},
            {"name_cn": "玛奇朵", "name_en": "Macchiato", "slug": "macchiato", "category": "espresso", "caffeine_level": "high", "milk_level": "little", "bitterness_level": 4, "acidity_level": 3},
            {"name_cn": "脏咖啡", "name_en": "Dirty", "slug": "dirty", "category": "espresso", "caffeine_level": "high", "milk_level": "medium", "bitterness_level": 4, "acidity_level": 2},
        ]
        
        for ct in coffee_types_data:
            coffee_type = CoffeeType(
                id=str(uuid4()),
                **ct,
                short_description=f"{ct['name_cn']}是一种经典的咖啡饮品",
                description=f"{ct['name_cn']}（{ct['name_en']}）是一种受欢迎的咖啡饮品。",
            )
            db.add(coffee_type)
        
        await db.commit()
        
        print("=" * 50)
        print("种子数据灌入完成！")
        print(f"城市: {len(CITIES)} 个")
        print(f"咖啡馆: {len(SHOPS_DATA)} 家")
        print(f"评论: {len(SHOPS_DATA) * 50} 条")
        print(f"咖啡种类: {len(coffee_types_data)} 种")
        print("=" * 50)


if __name__ == "__main__":
    asyncio.run(seed())