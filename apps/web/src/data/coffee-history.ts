// 真实咖啡历史文化数据 - 来源于百度百科、维基百科

export const coffeeHistory = {
  origin: {
    title: '咖啡的起源',
    content: `咖啡原产于非洲埃塞俄比亚西南部的卡法地区。传说公元9世纪，一位名叫卡尔迪的埃塞俄比亚牧羊人发现羊吃了一种红色果子后异常兴奋，由此发现了咖啡。

咖啡的发现传说：
- 牧羊人卡尔迪的故事：约公元850年，卡尔迪发现山羊吃了咖啡果后异常活跃
- 阿拉伯僧侣的故事：僧侣用咖啡果熬制汤药，用于夜间祈祷时提神

咖啡最早被当作食品而非饮品，埃塞俄比亚人将咖啡果与动物脂肪混合制成能量棒。`,
    source: '百度百科 - 咖啡'
  },
  spread: {
    title: '咖啡的传播',
    content: `15世纪：咖啡在也门开始种植，通过苏菲派僧侣传播
16世纪：咖啡传入奥斯曼帝国，伊斯坦布尔出现第一批咖啡馆
17世纪：咖啡传入欧洲，威尼斯、伦敦、巴黎相继开设咖啡馆
18世纪：咖啡种植扩展到美洲，荷兰人在爪哇、法国人在加勒比海建立种植园
19世纪：巴西成为世界最大咖啡生产国

重要历史节点：
- 1652年：伦敦第一家咖啡馆"Angel"开业
- 1686年：巴黎"Le Procope"咖啡馆开业，至今仍在经营
- 1843年：法国人第一次在阿尔及利亚种植咖啡`,
    source: '百度百科 - 咖啡传播史'
  },
  china: {
    title: '咖啡在中国',
    content: `中国咖啡种植始于19世纪末：

云南咖啡：
- 1892年：法国传教士在云南宾川县朱苦拉村种植咖啡
- 1950年代：云南开始大规模种植咖啡
- 现状：云南是中国最大的咖啡产区，占全国产量95%以上

海南咖啡：
- 1908年：华侨从马来西亚引进咖啡种植
- 兴隆咖啡：中国最早的咖啡品牌之一

中国咖啡文化发展：
- 1997年：星巴克进入中国
- 2010年代：中国精品咖啡浪潮兴起
- 2023年：中国咖啡市场规模超过3000亿元`,
    source: '百度百科 - 中国咖啡史'
  }
};

export const coffeeTypes = [
  {
    id: 'espresso',
    name: '意式浓缩',
    nameEn: 'Espresso',
    origin: '意大利',
    history: 'Espresso起源于20世纪初的意大利。1884年，Turin的Angelo Moriondo申请了第一个咖啡机专利。1901年，Luigi Bezzera改进了设计。Espresso通过高压热水（约9个大气压）快速萃取咖啡粉，萃取时间约25-30秒。',
    taste: '浓郁、醇厚、带有明显的苦味和回甘，咖啡油脂（Crema）丰富',
    caffeine: '每杯约63mg',
   适合人群: '喜欢浓郁咖啡风味的人',
    temperature: '88-92°C',
    bitterness: 5,
    acidity: 3,
    sweetness: 1,
  },
  {
    id: 'americano',
    name: '美式咖啡',
    nameEn: 'Americano',
    origin: '美国',
    history: '美式咖啡起源于二战时期。当时驻扎在意大利的美军士兵觉得意大利浓缩咖啡太浓烈，于是加入热水稀释。这种喝法在美国流行开来，因此得名"美式"。在意大利，这种咖啡被称为"Caffè Americano"。',
    taste: '口感清淡，保留咖啡原始风味，酸度适中',
    caffeine: '每杯约95mg',
    适合人群: '喜欢纯粹咖啡风味、怕苦的人',
    temperature: '85-90°C',
    bitterness: 3,
    acidity: 3,
    sweetness: 1,
  },
  {
    id: 'latte',
    name: '拿铁',
    nameEn: 'Latte',
    origin: '意大利',
    history: '"Latte"在意大利语中是"牛奶"的意思。拿铁咖啡最早出现在意大利，是将浓缩咖啡与大量蒸奶混合而成。1980年代，拿铁咖啡在美国西雅图的咖啡浪潮中流行起来，成为最受欢迎的咖啡饮品之一。',
    taste: '奶香浓郁，咖啡味柔和，口感顺滑',
    caffeine: '每杯约75mg',
    适合人群: '咖啡入门者、喜欢奶味的人',
    temperature: '65-70°C',
    bitterness: 2,
    acidity: 1,
    sweetness: 2,
  },
  {
    id: 'cappuccino',
    name: '卡布奇诺',
    nameEn: 'Cappuccino',
    origin: '意大利',
    history: '卡布奇诺的名字来源于意大利Capuchin修士的棕色长袍，因为咖啡的颜色与修士长袍相似。传统卡布奇诺由三分之一浓缩咖啡、三分之一蒸奶和三分之一奶泡组成。意大利人通常只在早餐时饮用。',
    taste: '咖啡与奶香平衡，奶泡绵密，口感丰富',
    caffeine: '每杯约75mg',
    适合人群: '喜欢咖啡与奶平衡的人',
    temperature: '65-70°C',
    bitterness: 3,
    acidity: 2,
    sweetness: 2,
  },
  {
    id: 'mocha',
    name: '摩卡',
    nameEn: 'Mocha',
    origin: '意大利/也门',
    history: '摩卡咖啡的名字来源于也门的摩卡港（Al Mokha），这里是15-17世纪最重要的咖啡贸易中心。现代摩卡咖啡是在浓缩咖啡中加入巧克力酱和蒸奶制成的，是对传统摩卡咖啡的创新演绎。',
    taste: '巧克力与咖啡完美融合，甜而不腻，带有可可香气',
    caffeine: '每杯约75mg',
    适合人群: '喜欢甜食、巧克力爱好者',
    temperature: '65-70°C',
    bitterness: 2,
    acidity: 1,
    sweetness: 4,
  },
  {
    id: 'flat-white',
    name: '馥芮白',
    nameEn: 'Flat White',
    origin: '澳大利亚/新西兰',
    history: '馥芮白起源于澳大利亚或新西兰（两地有争议）。1980年代，澳新地区的咖啡师创造了这种饮品。它与拿铁的区别在于：馥芮白使用双份浓缩咖啡，奶泡更薄更细腻，咖啡味更浓郁。2015年，星巴克将其引入全球菜单。',
    taste: '咖啡味浓郁，奶泡细腻丝滑，口感平衡',
    caffeine: '每杯约130mg（双份浓缩）',
    适合人群: '喜欢浓郁咖啡但又想要奶香的人',
    temperature: '60-65°C',
    bitterness: 3,
    acidity: 2,
    sweetness: 2,
  },
  {
    id: 'dirty',
    name: '脏咖啡',
    nameEn: 'Dirty',
    origin: '中国/韩国',
    history: 'Dirty咖啡是亚洲精品咖啡文化的创新产物。它将热的浓缩咖啡直接倒在冰牛奶上，形成分层效果。"脏"指的是咖啡与牛奶混合时的渐变效果。这种咖啡在韩国和中国的精品咖啡馆中流行起来。',
    taste: '先苦后甜，冷热交融，层次分明',
    caffeine: '每杯约100mg',
    适合人群: '喜欢尝试新鲜事物、追求口感层次的人',
    temperature: '冷热交替',
    bitterness: 4,
    acidity: 2,
    sweetness: 2,
  },
  {
    id: 'cold-brew',
    name: '冷萃咖啡',
    nameEn: 'Cold Brew',
    origin: '美国/日本',
    history: '冷萃咖啡的历史可以追溯到17世纪的日本，当时日本人用冷水滴滤制作咖啡。现代冷萃咖啡在美国兴起，始于2000年代。Blue Bottle Coffee等精品咖啡品牌将其推广。冷萃需要用冷水浸泡咖啡粉12-24小时。',
    taste: '口感顺滑，酸度低，带有巧克力和坚果风味',
    caffeine: '每杯约200mg（较高）',
    适合人群: '不喜欢酸味咖啡、追求顺滑口感的人',
    temperature: '2-8°C',
    bitterness: 3,
    acidity: 1,
    sweetness: 2,
  },
  {
    id: 'pour-over',
    name: '手冲咖啡',
    nameEn: 'Pour Over',
    origin: '德国/日本',
    history: '手冲咖啡起源于1908年，德国商人Melitta Bentz发明了滤纸过滤法。1941年，德国化学家Peter Schlumbohm发明了Chemex壶。手冲咖啡在日本得到精进发展，日本咖啡师将手冲提升为一门艺术。',
    taste: '风味纯净，能最好地展现单品咖啡豆的特色',
    caffeine: '每杯约80-120mg',
    适合人群: '精品咖啡爱好者、追求咖啡原味的人',
    temperature: '90-96°C',
    bitterness: 3,
    acidity: 4,
    sweetness: 2,
  },
  {
    id: 'macchiato',
    name: '玛奇朵',
    nameEn: 'Macchiato',
    origin: '意大利',
    history: 'Macchiato在意大利语中是"标记"或"污点"的意思。传统玛奇朵是在浓缩咖啡上加一小勺奶泡，就像在咖啡上做了一个标记。星巴克的"焦糖玛奇朵"是对传统玛奇朵的改良版本。',
    taste: '咖啡味浓郁，带有轻微的奶香',
    caffeine: '每杯约85mg',
    适合人群: '喜欢浓缩咖啡但又想要一点奶的人',
    temperature: '88-92°C',
    bitterness: 4,
    acidity: 3,
    sweetness: 1,
  },
];

export const brewingMethods = [
  {
    id: 'espresso-machine',
    name: '意式咖啡机',
    description: '通过高压热水（约9个大气压）快速萃取咖啡粉',
    pressure: '约9个大气压',
    time: '25-30秒',
    temperature: '88-92°C',
    grind: '极细',
  },
  {
    id: 'pour-over',
    name: '手冲',
    description: '通过控制水流和温度，缓慢萃取咖啡',
    pressure: '无（重力）',
    time: '2-4分钟',
    temperature: '90-96°C',
    grind: '中细',
  },
  {
    id: 'french-press',
    name: '法压壶',
    description: '将咖啡粉浸泡在热水中，用金属滤网过滤',
    pressure: '无（浸泡）',
    time: '4分钟',
    temperature: '93-96°C',
    grind: '粗',
  },
  {
    id: 'aeropress',
    name: '爱乐压',
    description: '结合浸泡和压力萃取，便携式咖啡器具',
    pressure: '约0.35个大气压',
    time: '1-2分钟',
    temperature: '80-90°C',
    grind: '中细',
  },
  {
    id: 'moka-pot',
    name: '摩卡壶',
    description: '利用蒸汽压力将水推过咖啡粉',
    pressure: '约1.5个大气压',
    time: '4-5分钟',
    temperature: '约95°C',
    grind: '中细',
  },
];