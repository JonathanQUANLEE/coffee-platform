// 大规模咖啡馆数据 - 自动生成

const shopNames = [
  // 上海
  { name: 'Manner Coffee', city: '上海', district: '浦东新区', features: ['高性价比', '自带杯减5元'], avgPrice: 20 },
  { name: 'Seesaw Coffee', city: '上海', district: '静安区', features: ['精品咖啡', '创意特调'], avgPrice: 45 },
  { name: '%Arabica', city: '上海', district: '黄浦区', features: ['网红打卡', '日系简约'], avgPrice: 55 },
  { name: 'Blue Bottle Coffee', city: '上海', district: '静安区', features: ['精品咖啡', '新鲜烘焙'], avgPrice: 65 },
  { name: '星巴克臻选', city: '上海', district: '黄浦区', features: ['全球最大', '现场烘焙'], avgPrice: 48 },
  { name: "Peet's Coffee", city: '上海', district: '静安区', features: ['深度烘焙', '美式传统'], avgPrice: 38 },
  { name: 'M Stand', city: '上海', district: '黄浦区', features: ['工业风', '创意咖啡'], avgPrice: 42 },
  { name: 'Metal Hands', city: '上海', district: '徐汇区', features: ['精品手冲', '社区咖啡'], avgPrice: 35 },
  { name: 'Egg Coffee', city: '上海', district: '静安区', features: ['创意咖啡', '性价比高'], avgPrice: 32 },
  { name: 'Distrito Coffee', city: '上海', district: '静安区', features: ['自烘豆', '精品咖啡'], avgPrice: 38 },
  { name: '堀口咖啡', city: '上海', district: '黄浦区', features: ['日式精品', '手冲大师'], avgPrice: 58 },
  { name: 'Onirii Coffee', city: '上海', district: '徐汇区', features: ['精品手冲', '武康路'], avgPrice: 42 },
  { name: 'Coffee IS', city: '上海', district: '长宁区', features: ['社区咖啡', '手冲'], avgPrice: 35 },
  { name: 'Rumors Coffee', city: '上海', district: '静安区', features: ['精品手冲', '安静'], avgPrice: 40 },
  { name: 'Tells Coffee', city: '上海', district: '浦东新区', features: ['社区咖啡', '手冲'], avgPrice: 38 },
  { name: 'Solo Espresso', city: '上海', district: '静安区', features: ['意式精品', '高性价比'], avgPrice: 30 },
  { name: 'FUMI Coffee', city: '上海', district: '黄浦区', features: ['创意特调', '精品咖啡'], avgPrice: 45 },
  { name: 'Black Sheep Coffee', city: '上海', district: '静安区', features: ['精品咖啡', '夜间营业'], avgPrice: 40 },
  { name: 'Slab Town', city: '上海', district: '静安区', features: ['精品咖啡', '富民路'], avgPrice: 42 },
  { name: '村口大树', city: '上海', district: '徐汇区', features: ['社区咖啡', '安静'], avgPrice: 35 },
  { name: 'O.P.S. Cafe', city: '上海', district: '静安区', features: ['创意特调', '精品'], avgPrice: 48 },
  { name: 'Tequila Espresso', city: '上海', district: '黄浦区', features: ['创意咖啡', '夜间营业'], avgPrice: 42 },
  { name: '鲁马滋咖啡', city: '上海', district: '徐汇区', features: ['日式手冲', '安静'], avgPrice: 45 },
  { name: '月球咖啡', city: '上海', district: '静安区', features: ['精品手冲', '社区'], avgPrice: 38 },
  { name: 'Cafe del Volcan', city: '上海', district: '静安区', features: ['精品手冲', '安静'], avgPrice: 40 },
  { name: 'Gregorius', city: '上海', district: '黄浦区', features: ['精品咖啡', '外滩'], avgPrice: 50 },
  { name: '大小咖啡', city: '上海', district: '徐汇区', features: ['社区咖啡', '手冲'], avgPrice: 35 },
  { name: 'Radar Coffee', city: '上海', district: '静安区', features: ['精品手冲', '安静'], avgPrice: 38 },
  { name: 'Drops', city: '上海', district: '黄浦区', features: ['创意特调', '精品'], avgPrice: 42 },
  { name: 'Habitat Coffee', city: '上海', district: '徐汇区', features: ['社区咖啡', '手冲'], avgPrice: 36 },
  // 北京
  { name: 'Metal Hands五道营', city: '北京', district: '东城区', features: ['精品手冲', '胡同文化'], avgPrice: 35 },
  { name: 'Fisheye鱼眼咖啡', city: '北京', district: '朝阳区', features: ['创意特调', '三里屯'], avgPrice: 42 },
  { name: 'Voyage Coffee', city: '北京', district: '东城区', features: ['精品手冲', '南锣鼓巷'], avgPrice: 38 },
  { name: 'Metal Hands鼓楼', city: '北京', district: '东城区', features: ['精品手冲', '鼓楼'], avgPrice: 35 },
  { name: 'Cafe de Lugano', city: '北京', district: '朝阳区', features: ['精品咖啡', '三里屯'], avgPrice: 45 },
  { name: '大小咖啡', city: '北京', district: '东城区', features: ['精品手冲', '胡同'], avgPrice: 32 },
  { name: 'Metal Hands朝外', city: '北京', district: '朝阳区', features: ['精品手冲', '商务'], avgPrice: 35 },
  { name: 'Berry Beans', city: '北京', district: '西城区', features: ['精品手冲', '前门'], avgPrice: 40 },
  { name: 'Soloist Coffee', city: '北京', district: '东城区', features: ['精品手冲', '胡同'], avgPrice: 38 },
  { name: 'Moka Bros', city: '北京', district: '朝阳区', features: ['精品咖啡', '三里屯'], avgPrice: 42 },
  { name: 'C5 Cafe', city: '北京', district: '朝阳区', features: ['精品手冲', '安静'], avgPrice: 36 },
  { name: '1/4 Quarter', city: '北京', district: '东城区', features: ['精品手冲', '胡同'], avgPrice: 34 },
  { name: 'Tianjin Cafe', city: '北京', district: '朝阳区', features: ['精品咖啡', '时尚'], avgPrice: 40 },
  { name: 'Basic Coffee', city: '北京', district: '东城区', features: ['社区咖啡', '手冲'], avgPrice: 30 },
  { name: 'Double Uncle', city: '北京', district: '朝阳区', features: ['精品咖啡', '创意'], avgPrice: 38 },
  // 广州
  { name: 'Something Coffee', city: '广州', district: '越秀区', features: ['社区咖啡', '东山口'], avgPrice: 35 },
  { name: '.jpg咖啡', city: '广州', district: '天河区', features: ['高性价比', '连锁'], avgPrice: 28 },
  { name: 'Nearly Coffee', city: '广州', district: '越秀区', features: ['精品手冲', '老洋房'], avgPrice: 38 },
  { name: 'So A Coffee', city: '广州', district: '天河区', features: ['精品咖啡', '天河南'], avgPrice: 35 },
  { name: 'Sheep Cafe', city: '广州', district: '海珠区', features: ['精品手冲', '安静'], avgPrice: 32 },
  { name: 'PP Coffee', city: '广州', district: '越秀区', features: ['社区咖啡', '东山口'], avgPrice: 30 },
  { name: 'Hope Coffee', city: '广州', district: '天河区', features: ['精品咖啡', '珠江新城'], avgPrice: 40 },
  { name: '来回咖啡', city: '广州', district: '天河区', features: ['精品手冲', '社区'], avgPrice: 35 },
  { name: '陆山客厅', city: '广州', district: '越秀区', features: ['精品咖啡', '老洋房'], avgPrice: 38 },
  { name: '玫瑰咖啡', city: '广州', district: '越秀区', features: ['精品手冲', '东山口'], avgPrice: 35 },
  // 深圳
  { name: 'KUDDO COFFEE', city: '深圳', district: '南山区', features: ['精品手冲', '科技园'], avgPrice: 35 },
  { name: 'AKIMBO CAFE', city: '深圳', district: '南山区', features: ['精品咖啡', '海景'], avgPrice: 42 },
  { name: 'Forrest Coffee', city: '深圳', district: '福田区', features: ['精品咖啡', '中心城'], avgPrice: 38 },
  { name: 'Something For', city: '深圳', district: '南山区', features: ['精品手冲', '华侨城'], avgPrice: 36 },
  { name: 'FeeCoffee', city: '深圳', district: '福田区', features: ['社区咖啡', '手冲'], avgPrice: 32 },
  { name: '集福咖啡', city: '深圳', district: '南山区', features: ['精品咖啡', '创意'], avgPrice: 40 },
  // 杭州
  { name: '九月咖啡', city: '杭州', district: '西湖区', features: ['西湖', '手冲'], avgPrice: 38 },
  { name: 'Hous Coffee', city: '杭州', district: '上城区', features: ['精品手冲', '南山路'], avgPrice: 42 },
  { name: 'Random Coffee', city: '杭州', district: '西湖区', features: ['精品手冲', '创意'], avgPrice: 40 },
  { name: '1%咖啡', city: '杭州', district: '上城区', features: ['精品咖啡', '河坊街'], avgPrice: 35 },
  { name: '沙县咖啡', city: '杭州', district: '西湖区', features: ['社区咖啡', '手冲'], avgPrice: 30 },
  { name: 'Creeper Coffee', city: '杭州', district: '上城区', features: ['精品手冲', '安静'], avgPrice: 38 },
  // 成都
  { name: '瑞幸咖啡', city: '成都', district: '高新区', features: ['高性价比', '便捷'], avgPrice: 18 },
  { name: 'Nuage Coffee', city: '成都', district: '锦江区', features: ['精品咖啡', '太古里'], avgPrice: 42 },
  { name: 'Let\'s Grind', city: '成都', district: '锦江区', features: ['精品手冲', '社区'], avgPrice: 35 },
  { name: 'UID Cafe', city: '成都', district: '武侯区', features: ['精品咖啡', '创意'], avgPrice: 38 },
  { name: '常识咖啡', city: '成都', district: '锦江区', features: ['社区咖啡', '手冲'], avgPrice: 32 },
  { name: '白胡子咖啡', city: '成都', district: '青羊区', features: ['精品手冲', '宽窄巷子'], avgPrice: 40 },
];

// 生成评论模板
const reviewTemplates = [
  '这家店的{drink}真的很好喝，强烈推荐！',
  '环境很不错，适合{activity}。咖啡品质也很好。',
  '第三次来了，{drink}是我的最爱。店员服务态度也很好。',
  '价格合理，性价比很高。{drink}味道很正宗。',
  '和朋友一起来的，大家都觉得不错。{drink}很推荐。',
  '位置很好找，环境安静。适合一个人来喝咖啡。',
  '店里的氛围很舒服，{drink}做得很好。',
  '周末来的，人有点多，但是{drink}值得等。',
  '外卖点过很多次了，品质一直很稳定。',
  '第一次来，被{drink}惊艳到了。以后会常来。',
  '朋友推荐的，果然没失望。{drink}很好喝。',
  '环境很有设计感，适合拍照。{drink}也不错。',
  '价格比其他店便宜，但品质不输。{drink}推荐。',
  '下班后来坐坐，很放松。{drink}是今天的惊喜。',
  '咖啡师很专业，给我推荐了{drink}，很满意。',
  '这家店的{drink}是我喝过最好的之一。',
  '环境干净整洁，{drink}做得很好。会再来。',
  '和闺蜜来的，点了{drink}和蛋糕，完美的下午茶。',
  '出差来这个城市，找到这家店很幸运。{drink}很棒。',
  '早上的{drink}开启美好的一天。',
  '这里的{drink}很特别，和其他店不一样。',
  '安静的环境，好喝的{drink}，完美的组合。',
  '每次来都点{drink}，从没让我失望过。',
  '店里的音乐很好听，{drink}也很好喝。',
  '带朋友来的，他们都说{drink}很好喝。',
  '下雨天来喝{drink}，特别有感觉。',
  '这里的{drink}让我爱上了咖啡。',
  '工作日人不多，很安静。{drink}品质很好。',
  '外卖送得很快，{drink}还是热的。',
  '性价比超高，{drink}价格便宜品质好。',
];

const drinks = ['拿铁', '美式', 'dirty', '手冲', '澳白', '卡布奇诺', '摩卡', '冷萃', '创意特调', '意式浓缩'];
const activities = ['办公', '看书', '聊天', '拍照', '下午茶', '独处', '约会', '学习'];

function generateReviews(shopId: string, shopName: string, count: number) {
  const reviews = [];
  const sources = ['大众点评', '小红书', 'B站', '抖音'] as const;
  const usernames = [
    '咖啡爱好者', '打工人', '周末探店', '咖啡小白', '精品咖啡控',
    '下午茶时光', '拍照达人', '上班族', '学生党', '自由职业者',
    '咖啡日记', '探店小能手', '美食博主', '生活家', '咖啡新手',
    '胡同探店', '城市漫步', '咖啡老饕', '甜品控', '设计爱好者',
    '文艺青年', '咖啡控', '周末好去处', '品质生活', '咖啡旅行者',
  ];

  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const content = template.replace('{drink}', drink).replace('{activity}', activity);
    const source = sources[Math.floor(Math.random() * sources.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const rating = Math.random() > 0.2 ? 5 : 4;
    const day = Math.floor(Math.random() * 30) + 1;
    const month = Math.random() > 0.3 ? 5 : 4;

    reviews.push({
      id: `${shopId}-r${i}`,
      shopId,
      username,
      rating,
      content,
      source,
      date: `2026-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      helpful: Math.floor(Math.random() * 500) + 10,
    });
  }
  return reviews;
}

// 生成完整数据
export const megaShops = shopNames.map((shop, index) => {
  const id = shop.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').toLowerCase();
  return {
    id,
    name: shop.name,
    nameEn: shop.name,
    city: shop.city,
    district: shop.district,
    address: `${shop.city}市${shop.district}${['路', '街', '大道', '巷', '弄'][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 500) + 1}号`,
    rating: 4 + Math.random() * 0.9,
    reviewCount: Math.floor(Math.random() * 10000) + 1000,
    avgPrice: shop.avgPrice,
    phone: `021-${Math.floor(Math.random() * 90000000) + 10000000}`,
    openingHours: ['07:00-21:00', '08:00-22:00', '08:00-20:00', '09:00-21:00'][Math.floor(Math.random() * 4)],
    features: shop.features,
    description: `${shop.name}是一家位于${shop.city}${shop.district}的精品咖啡馆，以${shop.features[0]}著称。`,
    signatureDrinks: drinks.slice(0, 3),
    source: '大众点评',
    popularityScore: Math.floor(Math.random() * 20) + 80,
  };
});

export const megaReviews = megaShops.flatMap(shop => 
  generateReviews(shop.id, shop.name, 50)
);

export const getShopsByCity = (city: string) => megaShops.filter(s => s.city === city);
export const getReviewsByShopId = (shopId: string) => megaReviews.filter(r => r.shopId === shopId);
export const searchShops = (query: string) => megaShops.filter(s => 
  s.name.toLowerCase().includes(query.toLowerCase()) ||
  s.city.includes(query) ||
  s.district.includes(query) ||
  s.features.some(f => f.includes(query))
);