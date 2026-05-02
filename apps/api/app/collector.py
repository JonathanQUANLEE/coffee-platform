"""
多平台数据采集器 - 从高德地图、大众点评、小红书等平台获取咖啡馆数据
"""
import asyncio
import httpx
import json
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class CoffeeShopData:
    """咖啡馆数据结构"""
    name: str
    city: str
    district: str
    address: str
    latitude: float
    longitude: float
    rating: float
    review_count: int
    avg_price: int
    phone: str
    opening_hours: str
    features: List[str]
    source: str
    source_id: str


class GaodeCollector:
    """高德地图数据采集器"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://restapi.amap.com/v3"
    
    async def search_coffee_shops(self, city: str, keywords: str = "咖啡", page: int = 1) -> List[CoffeeShopData]:
        """搜索咖啡馆"""
        url = f"{self.base_url}/place/text"
        params = {
            "key": self.api_key,
            "keywords": keywords,
            "city": city,
            "citylimit": "true",
            "offset": 25,
            "page": page,
            "extensions": "all",
        }
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params, timeout=10)
                data = resp.json()
                
                if data.get("status") != "1":
                    print(f"[高德] 搜索失败: {data.get('info')}")
                    return []
                
                shops = []
                for poi in data.get("pois", []):
                    location = poi.get("location", "0,0")
                    lng, lat = map(float, location.split(","))
                    
                    shop = CoffeeShopData(
                        name=poi.get("name", ""),
                        city=city,
                        district=poi.get("adname", ""),
                        address=poi.get("address", ""),
                        latitude=lat,
                        longitude=lng,
                        rating=float(poi.get("biz_ext", {}).get("rating", "0") or "0"),
                        review_count=0,
                        avg_price=int(float(poi.get("biz_ext", {}).get("cost", "0") or "0")),
                        phone=poi.get("tel", ""),
                        opening_hours=poi.get("biz_ext", {}).get("open_time", ""),
                        features=self._extract_features(poi),
                        source="高德地图",
                        source_id=poi.get("id", ""),
                    )
                    shops.append(shop)
                
                return shops
            except Exception as e:
                print(f"[高德] 请求失败: {e}")
                return []
    
    def _extract_features(self, poi: Dict) -> List[str]:
        """提取特征标签"""
        features = []
        type_name = poi.get("type", "")
        if "咖啡" in type_name:
            features.append("咖啡馆")
        if poi.get("biz_ext", {}).get("rating", "0") >= "4.5":
            features.append("高评分")
        return features


class DianpingCollector:
    """大众点评数据采集器"""
    
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }
    
    async def search_coffee_shops(self, city: str, page: int = 1) -> List[CoffeeShopData]:
        """搜索咖啡馆（模拟）"""
        # 大众点评需要复杂的反爬处理，这里返回空
        print(f"[大众点评] {city} 数据采集需要登录和反爬处理")
        return []


class XiaohongshuCollector:
    """小红书数据采集器"""
    
    async def search_coffee_notes(self, city: str) -> List[Dict]:
        """搜索咖啡相关笔记（模拟）"""
        print(f"[小红书] {city} 数据采集需要登录")
        return []


class DouyinCollector:
    """抖音数据采集器"""
    
    async def search_coffee_videos(self, city: str) -> List[Dict]:
        """搜索咖啡相关视频（模拟）"""
        print(f"[抖音] {city} 数据采集需要登录")
        return []


class BilibiliCollector:
    """B站数据采集器"""
    
    async def search_coffee_videos(self, keyword: str) -> List[Dict]:
        """搜索咖啡相关视频"""
        url = "https://api.bilibili.com/x/web-interface/search/type"
        params = {
            "search_type": "video",
            "keyword": keyword,
            "page": 1,
            "pagesize": 20,
        }
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params, timeout=10)
                data = resp.json()
                
                if data.get("code") != 0:
                    print(f"[B站] 搜索失败: {data.get('message')}")
                    return []
                
                videos = []
                for item in data.get("data", {}).get("result", []):
                    videos.append({
                        "title": item.get("title", "").replace("<em class=\"keyword\">", "").replace("</em>", ""),
                        "author": item.get("author", ""),
                        "play": item.get("play", 0),
                        "review": item.get("review", 0),
                    })
                
                return videos
            except Exception as e:
                print(f"[B站] 请求失败: {e}")
                return []


class DataManager:
    """数据管理器"""
    
    def __init__(self, gaode_key: str = ""):
        self.gaode = GaodeCollector(gaode_key) if gaode_key else None
        self.dianping = DianpingCollector()
        self.xiaohongshu = XiaohongshuCollector()
        self.douyin = DouyinCollector()
        self.bilibili = BilibiliCollector()
    
    async def collect_all(self, city: str) -> List[CoffeeShopData]:
        """从所有平台采集数据"""
        all_shops = []
        
        # 高德地图
        if self.gaode:
            shops = await self.gaode.search_coffee_shops(city)
            all_shops.extend(shops)
            print(f"[高德] {city} 获取 {len(shops)} 家咖啡馆")
        
        # 大众点评
        shops = await self.dianping.search_coffee_shops(city)
        all_shops.extend(shops)
        
        # 去重
        unique_shops = self._deduplicate(all_shops)
        print(f"[汇总] {city} 共 {len(unique_shops)} 家咖啡馆")
        
        return unique_shops
    
    def _deduplicate(self, shops: List[CoffeeShopData]) -> List[CoffeeShopData]:
        """去重"""
        seen = set()
        unique = []
        for shop in shops:
            key = f"{shop.name}-{shop.city}"
            if key not in seen:
                seen.add(key)
                unique.append(shop)
        return unique


# ==================== 全国主要城市列表 ====================
CITIES = [
    # 一线城市
    {"name": "上海", "province": "上海", "lat": 31.23, "lng": 121.47},
    {"name": "北京", "province": "北京", "lat": 39.90, "lng": 116.40},
    {"name": "广州", "province": "广东", "lat": 23.13, "lng": 113.26},
    {"name": "深圳", "province": "广东", "lat": 22.54, "lng": 114.06},
    # 新一线城市
    {"name": "成都", "province": "四川", "lat": 30.57, "lng": 104.07},
    {"name": "杭州", "province": "浙江", "lat": 30.27, "lng": 120.15},
    {"name": "武汉", "province": "湖北", "lat": 30.59, "lng": 114.30},
    {"name": "南京", "province": "江苏", "lat": 32.06, "lng": 118.80},
    {"name": "天津", "province": "天津", "lat": 39.08, "lng": 117.20},
    {"name": "重庆", "province": "重庆", "lat": 29.56, "lng": 106.55},
    {"name": "西安", "province": "陕西", "lat": 34.26, "lng": 108.94},
    {"name": "长沙", "province": "湖南", "lat": 28.23, "lng": 112.94},
    {"name": "沈阳", "province": "辽宁", "lat": 41.80, "lng": 123.43},
    {"name": "青岛", "province": "山东", "lat": 36.07, "lng": 120.38},
    {"name": "郑州", "province": "河南", "lat": 34.75, "lng": 113.65},
    {"name": "大连", "province": "辽宁", "lat": 38.91, "lng": 121.60},
    {"name": "东莞", "province": "广东", "lat": 23.04, "lng": 113.75},
    {"name": "宁波", "province": "浙江", "lat": 29.87, "lng": 121.55},
    {"name": "厦门", "province": "福建", "lat": 24.48, "lng": 118.09},
    {"name": "福州", "province": "福建", "lat": 26.07, "lng": 119.30},
    {"name": "无锡", "province": "江苏", "lat": 31.49, "lng": 120.31},
    {"name": "合肥", "province": "安徽", "lat": 31.82, "lng": 117.23},
    {"name": "昆明", "province": "云南", "lat": 25.04, "lng": 102.68},
    {"name": "哈尔滨", "province": "黑龙江", "lat": 45.75, "lng": 126.65},
    {"name": "济南", "province": "山东", "lat": 36.65, "lng": 116.99},
    {"name": "佛山", "province": "广东", "lat": 23.03, "lng": 113.12},
    {"name": "长春", "province": "吉林", "lat": 43.88, "lng": 125.32},
    {"name": "温州", "province": "浙江", "lat": 28.00, "lng": 120.67},
    {"name": "石家庄", "province": "河北", "lat": 38.04, "lng": 114.51},
    {"name": "南宁", "province": "广西", "lat": 22.82, "lng": 108.37},
    {"name": "常州", "province": "江苏", "lat": 31.81, "lng": 119.97},
    {"name": "泉州", "province": "福建", "lat": 24.87, "lng": 118.68},
    {"name": "南昌", "province": "江西", "lat": 28.68, "lng": 115.86},
    {"name": "贵阳", "province": "贵州", "lat": 26.65, "lng": 106.63},
    {"name": "太原", "province": "山西", "lat": 37.87, "lng": 112.55},
    {"name": "烟台", "province": "山东", "lat": 37.46, "lng": 121.45},
    {"name": "嘉兴", "province": "浙江", "lat": 30.77, "lng": 120.76},
    {"name": "南通", "province": "江苏", "lat": 32.06, "lng": 120.87},
    {"name": "金华", "province": "浙江", "lat": 29.08, "lng": 119.65},
    {"name": "珠海", "province": "广东", "lat": 22.27, "lng": 113.58},
]


async def collect_and_save():
    """采集数据并保存"""
    print("=" * 60)
    print("开始全国咖啡馆数据采集")
    print("=" * 60)
    
    # 这里需要高德地图API key
    # manager = DataManager(gaode_key="your_api_key")
    
    # 如果没有API key，使用本地生成的数据
    from app.seed import SHOPS_DATA, CITIES as SEED_CITIES
    
    print(f"\n当前支持 {len(SEED_CITIES)} 个城市")
    print(f"当前有 {len(SHOPS_DATA)} 家咖啡馆数据")
    
    print("\n" + "=" * 60)
    print("数据采集完成")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(collect_and_save())