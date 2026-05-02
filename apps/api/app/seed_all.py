"""
全国咖啡馆种子数据 - 覆盖30+城市，每城市10-30家咖啡馆
运行: python -m app.seed_all
"""
import asyncio
from uuid import uuid4
from datetime import datetime, timedelta
import random

from app.core.database import engine, async_session, Base
from app.models.user import User
from app.models.city import City, District
from app.models.coffee_shop import CoffeeShop
from app.models.coffee_type import CoffeeType
from app.models.interaction import Review


# ==================== 全国城市数据 ====================
CITIES_DATA = [
    {"name_cn": "上海", "name_en": "Shanghai", "slug": "shanghai", "province": "上海"},
    {"name_cn": "北京", "name_en": "Beijing", "slug": "beijing", "province": "北京"},
    {"name_cn": "广州", "name_en": "Guangzhou", "slug": "guangzhou", "province": "广东"},
    {"name_cn": "深圳", "name_en": "Shenzhen", "slug": "shenzhen", "province": "广东"},
    {"name_cn": "成都", "name_en": "Chengdu", "slug": "chengdu", "province": "四川"},
    {"name_cn": "杭州", "name_en": "Hangzhou", "slug": "hangzhou", "province": "浙江"},
    {"name_cn": "武汉", "name_en": "Wuhan", "slug": "wuhan", "province": "湖北"},
    {"name_cn": "南京", "name_en": "Nanjing", "slug": "nanjing", "province": "江苏"},
    {"name_cn": "天津", "name_en": "Tianjin", "slug": "tianjin", "province": "天津"},
    {"name_cn": "重庆", "name_en": "Chongqing", "slug": "chongqing", "province": "重庆"},
    {"name_cn": "西安", "name_en": "Xian", "slug": "xian", "province": "陕西"},
    {"name_cn": "长沙", "name_en": "Changsha", "slug": "changsha", "province": "湖南"},
    {"name_cn": "沈阳", "name_en": "Shenyang", "slug": "shenyang", "province": "辽宁"},
    {"name_cn": "青岛", "name_en": "Qingdao", "slug": "qingdao", "province": "山东"},
    {"name_cn": "郑州", "name_en": "Zhengzhou", "slug": "zhengzhou", "province": "河南"},
    {"name_cn": "大连", "name_en": "Dalian", "slug": "dalian", "province": "辽宁"},
    {"name_cn": "东莞", "name_en": "Dongguan", "slug": "dongguan", "province": "广东"},
    {"name_cn": "宁波", "name_en": "Ningbo", "slug": "ningbo", "province": "浙江"},
    {"name_cn": "厦门", "name_en": "Xiamen", "slug": "xiamen", "province": "福建"},
    {"name_cn": "福州", "name_en": "Fuzhou", "slug": "fuzhou", "province": "福建"},
    {"name_cn": "无锡", "name_en": "Wuxi", "slug": "wuxi", "province": "江苏"},
    {"name_cn": "合肥", "name_en": "Hefei", "slug": "hefei", "province": "安徽"},
    {"name_cn": "昆明", "name_en": "Kunming", "slug": "kunming", "province": "云南"},
    {"name_cn": "哈尔滨", "name_en": "Harbin", "slug": "harbin", "province": "黑龙江"},
    {"name_cn": "济南", "name_en": "Jinan", "slug": "jinan", "province": "山东"},
    {"name_cn": "佛山", "name_en": "Foshan", "slug": "foshan", "province": "广东"},
    {"name_cn": "长春", "name_en": "Changchun", "slug": "changchun", "province": "吉林"},
    {"name_cn": "温州", "name_en": "Wenzhou", "slug": "wenzhou", "province": "浙江"},
    {"name_cn": "石家庄", "name_en": "Shijiazhuang", "slug": "shijiazhuang", "province": "河北"},
    {"name_cn": "南宁", "name_en": "Nanning", "slug": "nanning", "province": "广西"},
    {"name_cn": "常州", "name_en": "Changzhou", "slug": "changzhou", "province": "江苏"},
    {"name_cn": "泉州", "name_en": "Quanzhou", "slug": "quanzhou", "province": "福建"},
    {"name_cn": "南昌", "name_en": "Nanchang", "slug": "nanchang", "province": "江西"},
    {"name_cn": "贵阳", "name_en": "Guiyang", "slug": "guiyang", "province": "贵州"},
    {"name_cn": "太原", "name_en": "Taiyuan", "slug": "taiyuan", "province": "山西"},
]

# ==================== 咖啡馆品牌/模板 ====================
SHOP_TEMPLATES = [
    # 连锁品牌
    {"name": "Manner Coffee", "features": ["高性价比", "自带杯减5元"], "avg_price": 20, "rating": 4.7},
    {"name": "星巴克", "features": ["连锁品牌", "环境优雅"], "avg_price": 38, "rating": 4.3},
    {"name": "瑞幸咖啡", "features": ["高性价比", "便捷服务"], "avg_price": 18, "rating": 4.2},
    {"name": "库迪咖啡", "features": ["高性价比", "快速出品"], "avg_price": 15, "rating": 4.0},
    {"name": "Tims咖啡", "features": ["加拿大品牌", "贝果"], "avg_price": 30, "rating": 4.1},
    {"name": "Peet's Coffee", "features": ["深度烘焙", "精品咖啡"], "avg_price": 38, "rating": 4.5},
    {"name": "Seesaw Coffee", "features": ["创意特调", "精品咖啡"], "avg_price": 45, "rating": 4.6},
    {"name": "%Arabica", "features": ["网红打卡", "日系简约"], "avg_price": 50, "rating": 4.5},
    {"name": "M Stand", "features": ["工业风", "创意咖啡"], "avg_price": 42, "rating": 4.4},
    {"name": "代数学家", "features": ["精品咖啡", "社区"], "avg_price": 35, "rating": 4.3},
    # 独立咖啡馆模板
    {"name": "{city}手冲咖啡", "features": ["精品手冲", "安静"], "avg_price": 38, "rating": 4.6},
    {"name": "{city}咖啡实验室", "features": ["创意特调", "精品"], "avg_price": 42, "rating": 4.5},
    {"name": "大树咖啡", "features": ["社区咖啡", "温馨"], "avg_price": 32, "rating": 4.4},
    {"name": "月球咖啡", "features": ["精品手冲", "安静"], "avg_price": 38, "rating": 4.5},
    {"name": "猫咖{num}号店", "features": ["猫咪", "休闲"], "avg_price": 40, "rating": 4.3},
    {"name": "转角咖啡", "features": ["社区咖啡", "街角"], "avg_price": 30, "rating": 4.2},
    {"name": "晨光咖啡", "features": ["早餐咖啡", "快速"], "avg_price": 25, "rating": 4.1},
    {"name": "老街咖啡", "features": ["老街", "复古"], "avg_price": 35, "rating": 4.4},
    {"name": "创意咖啡工坊", "features": ["创意特调", "手冲"], "avg_price": 45, "rating": 4.6},
    {"name": "精品咖啡馆", "features": ["精品咖啡", "手冲"], "avg_price": 40, "rating": 4.5},
]

DISTRICTS = {
    "上海": ["浦东新区", "静安区", "黄浦区", "徐汇区", "长宁区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区"],
    "北京": ["朝阳区", "东城区", "西城区", "海淀区", "丰台区", "石景山区", "通州区", "顺义区", "昌平区", "大兴区"],
    "广州": ["天河区", "越秀区", "海珠区", "荔湾区", "白云区", "番禺区", "花都区", "南沙区", "黄埔区", "增城区"],
    "深圳": ["南山区", "福田区", "罗湖区", "宝安区", "龙岗区", "龙华区", "光明区", "坪山区", "盐田区", "大鹏新区"],
    "成都": ["锦江区", "青羊区", "武侯区", "高新区", "成华区", "金牛区", "龙泉驿区", "新都区", "温江区", "双流区"],
    "杭州": ["西湖区", "上城区", "拱墅区", "滨江区", "萧山区", "余杭区", "临平区", "富阳区", "临安区", "钱塘区"],
    "武汉": ["武昌区", "江岸区", "江汉区", "硚口区", "汉阳区", "洪山区", "东西湖区", "江夏区", "蔡甸区", "黄陂区"],
    "南京": ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区"],
    "天津": ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "滨海新区", "东丽区", "西青区", "津南区"],
    "重庆": ["渝中区", "江北区", "南岸区", "九龙坡区", "沙坪坝区", "大渡口区", "渝北区", "巴南区", "北碚区", "两江新区"],
    "西安": ["新城区", "碑林区", "莲湖区", "灞桥区", "未央区", "雁塔区", "阎良区", "临潼区", "长安区", "高陵区"],
    "长沙": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县", "浏阳市", "宁乡市"],
    "沈阳": ["和平区", "沈河区", "大东区", "皇姑区", "铁西区", "苏家屯区", "浑南区", "沈北新区", "于洪区", "辽中区"],
    "青岛": ["市南区", "市北区", "黄岛区", "崂山区", "李沧区", "城阳区", "即墨区", "胶州市", "平度市", "莱西市"],
    "郑州": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "中牟县", "巩义市", "荥阳市", "新密市"],
    "大连": ["中山区", "西岗区", "沙河口区", "甘井子区", "旅顺口区", "金州区", "普兰店区", "瓦房店市", "庄河市", "长海县"],
    "东莞": ["莞城街道", "南城街道", "东城街道", "万江街道", "石龙镇", "石碣镇", "茶山镇", "企石镇", "横沥镇", "桥头镇"],
    "宁波": ["海曙区", "江北区", "北仑区", "鄞州区", "奉化区", "镇海区", "余姚市", "慈溪市", "宁海县", "象山县"],
    "厦门": ["思明区", "海沧区", "湖里区", "集美区", "同安区", "翔安区"],
    "福州": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区", "闽侯县", "连江县", "罗源县", "闽清县"],
    "无锡": ["锡山区", "惠山区", "滨湖区", "梁溪区", "新吴区", "江阴市", "宜兴市"],
    "合肥": ["瑶海区", "庐阳区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县", "庐江县", "巢湖市"],
    "昆明": ["五华区", "盘龙区", "官渡区", "西山区", "东川区", "呈贡区", "晋宁区", "富民县", "宜良县", "石林县"],
    "哈尔滨": ["道里区", "南岗区", "道外区", "平房区", "松北区", "香坊区", "呼兰区", "阿城区", "双城区", "依兰县"],
    "济南": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区", "济阳区", "莱芜区", "钢城区"],
    "佛山": ["禅城区", "南海区", "顺德区", "三水区", "高明区"],
    "长春": ["南关区", "宽城区", "朝阳区", "二道区", "绿园区", "双阳区", "九台区", "农安县", "榆树市", "德惠市"],
    "温州": ["鹿城区", "龙湾区", "瓯海区", "洞头区", "永嘉县", "平阳县", "苍南县", "文成县", "泰顺县", "瑞安市"],
    "石家庄": ["长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区", "井陉县", "正定县"],
    "南宁": ["兴宁区", "青秀区", "江南区", "西乡塘区", "良庆区", "邕宁区", "武鸣区", "隆安县", "马山县", "上林县"],
    "常州": ["天宁区", "钟楼区", "新北区", "武进区", "金坛区", "溧阳市"],
    "泉州": ["鲤城区", "丰泽区", "洛江区", "泉港区", "惠安县", "安溪县", "永春县", "德化县", "石狮市", "晋江市"],
    "南昌": ["东湖区", "西湖区", "青云谱区", "青山湖区", "新建区", "红谷滩区", "南昌县", "安义县", "进贤县"],
    "贵阳": ["南明区", "云岩区", "花溪区", "乌当区", "白云区", "观山湖区", "开阳县", "息烽县", "修文县", "清镇市"],
    "太原": ["小店区", "迎泽区", "杏花岭区", "尖草坪区", "万柏林区", "晋源区", "清徐县", "阳曲县", "娄烦县", "古交市"],
}

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
    "环境很舒服，适合看书学习。",
    "早上去的，人不多，{drink}很新鲜。",
    "周末带孩子来的，环境很友好。",
    "出差常来这家，品质稳定。",
    "朋友聚会选的这里，大家都很满意。",
]

DRINKS = ["拿铁", "美式", "dirty", "手冲", "澳白", "卡布奇诺", "摩卡", "冷萃", "创意特调", "生椰拿铁"]
ACTIVITIES = ["办公", "看书", "聊天", "拍照", "下午茶", "独处", "约会", "学习", "发呆", "开会"]


def seeded_random(seed: int) -> float:
    random.seed(seed)
    return random.random()


async def seed_all():
    """灌入全国数据"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as db:
        # 0. 创建系统用户
        system_user = User(
            id="system-user-001",
            nickname="系统用户",
            email="system@coffee.com",
            role="user",
        )
        db.add(system_user)
        await db.flush()
        
        # 1. 创建城市
        city_map = {}
        for city_data in CITIES_DATA:
            city = City(id=str(uuid4()), **city_data)
            db.add(city)
            city_map[city_data["name_cn"]] = city.id
        
        await db.flush()
        print(f"创建 {len(CITIES_DATA)} 个城市")
        
        # 2. 创建咖啡馆
        total_shops = 0
        shop_ids = []
        
        for city_name, city_id in city_map.items():
            # 每个城市随机10-20家咖啡馆
            num_shops = random.randint(10, 20)
            city_districts = DISTRICTS.get(city_name, ["中心区", "新城区"])
            
            for i in range(num_shops):
                template = random.choice(SHOP_TEMPLATES)
                district = random.choice(city_districts)
                
                name = template["name"]
                if "{city}" in name:
                    name = name.replace("{city}", city_name)
                if "{num}" in name:
                    name = name.replace("{num}", str(i + 1))
                
                # 加上区域后缀避免重名
                if i > 0 and "{city}" not in template["name"]:
                    name = f"{name}{district}店"
                
                shop = CoffeeShop(
                    id=str(uuid4()),
                    city_id=city_id,
                    name=name,
                    slug=f"{city_name}-{name}-{str(uuid4())[:8]}".lower().replace(" ", "-"),
                    address=f"{city_name}市{district}{random.choice(['路', '街', '大道', '巷'])}{random.randint(1, 500)}号",
                    rating=round(template["rating"] + random.uniform(-0.3, 0.3), 1),
                    review_count=random.randint(100, 5000),
                    avg_price=template["avg_price"] + random.randint(-5, 10),
                    features=template["features"],
                    description=f"{name}是{city_name}{district}的知名咖啡馆，以{template['features'][0]}著称。",
                    status="active",
                    is_verified=True,
                    popularity_score=random.randint(70, 99),
                    phone=f"{random.choice(['021', '010', '020', '0755', '0571', '028', '027', '025', '022', '023', '029'])}{random.randint(10000000, 99999999)}",
                )
                db.add(shop)
                shop_ids.append(shop.id)
                total_shops += 1
        
        await db.flush()
        print(f"创建 {total_shops} 家咖啡馆")
        
        # 3. 创建评论（每家30-50条）
        total_reviews = 0
        for shop_id in shop_ids:
            num_reviews = random.randint(30, 50)
            for i in range(num_reviews):
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
                    created_at=datetime.now() - timedelta(days=random.randint(0, 180)),
                )
                db.add(review)
                total_reviews += 1
        
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
            {"name_cn": "生椰拿铁", "name_en": "Coconut Latte", "slug": "coconut-latte", "category": "espresso", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 1, "acidity_level": 1},
            {"name_cn": "冰博克拿铁", "name_en": "Eisbock Latte", "slug": "eisbock-latte", "category": "espresso", "caffeine_level": "medium", "milk_level": "lots", "bitterness_level": 2, "acidity_level": 1},
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
        
        print(f"创建 {total_reviews} 条评论")
        print(f"创建 {len(coffee_types_data)} 种咖啡")
        print("=" * 60)
        print("全国数据灌入完成！")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(seed_all())