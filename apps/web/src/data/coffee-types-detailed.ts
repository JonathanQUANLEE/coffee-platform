// 详细咖啡种类数据 - 包含图片和中英文介绍

export interface CoffeeType {
  id: string;
  name: { zh: string; en: string };
  origin: { zh: string; en: string };
  history: { zh: string; en: string };
  taste: { zh: string; en: string };
  caffeine: string;
  temperature: string;
  bitterness: number;
  acidity: number;
  sweetness: number;
  milk: 'none' | 'little' | 'medium' | 'lots';
  suitableFor: { zh: string; en: string };
  image: string;
  color: string;
}

export const coffeeTypesDetailed: CoffeeType[] = [
  {
    id: 'americano',
    name: { zh: '美式咖啡', en: 'Americano' },
    origin: { zh: '美国', en: 'United States' },
    history: {
      zh: '美式咖啡起源于二战时期。当时驻扎在意大利的美军士兵觉得意大利浓缩咖啡太浓烈，于是加入热水稀释。这种喝法在美国流行开来，因此得名"美式"。',
      en: 'Americano originated during WWII. American soldiers stationed in Italy found espresso too strong, so they diluted it with hot water. This style became popular in the US, hence the name.'
    },
    taste: { zh: '口感清淡，保留咖啡原始风味，酸度适中', en: 'Light bodied, preserves original coffee flavor, moderate acidity' },
    caffeine: '约95mg',
    temperature: '85-90°C',
    bitterness: 3,
    acidity: 3,
    sweetness: 1,
    milk: 'none',
    suitableFor: { zh: '喜欢纯粹咖啡风味、怕苦的人', en: 'Those who enjoy pure coffee flavor' },
    image: 'https://picsum.photos/seed/americano/400/400',
    color: 'from-amber-800 to-amber-950',
  },
  {
    id: 'latte',
    name: { zh: '拿铁', en: 'Latte' },
    origin: { zh: '意大利', en: 'Italy' },
    history: {
      zh: '"Latte"在意大利语中是"牛奶"的意思。拿铁咖啡是将浓缩咖啡与大量蒸奶混合而成。1980年代在美国西雅图的咖啡浪潮中流行起来，成为最受欢迎的咖啡饮品之一。',
      en: '"Latte" means "milk" in Italian. It\'s espresso mixed with steamed milk. Popularized in the 1980s Seattle coffee wave, it became one of the most popular coffee drinks.'
    },
    taste: { zh: '奶香浓郁，咖啡味柔和，口感顺滑', en: 'Rich milk flavor, mellow coffee, smooth texture' },
    caffeine: '约75mg',
    temperature: '65-70°C',
    bitterness: 2,
    acidity: 1,
    sweetness: 2,
    milk: 'lots',
    suitableFor: { zh: '咖啡入门者、喜欢奶味的人', en: 'Coffee beginners, milk lovers' },
    image: 'https://picsum.photos/seed/latte/400/400',
    color: 'from-amber-200 to-amber-400',
  },
  {
    id: 'cappuccino',
    name: { zh: '卡布奇诺', en: 'Cappuccino' },
    origin: { zh: '意大利', en: 'Italy' },
    history: {
      zh: '卡布奇诺的名字来源于意大利Capuchin修士的棕色长袍。传统卡布奇诺由三分之一浓缩咖啡、三分之一蒸奶和三分之一奶泡组成。意大利人通常只在早餐时饮用。',
      en: 'Named after Capuchin monks\' brown robes. Traditional cappuccino is 1/3 espresso, 1/3 steamed milk, 1/3 foam. Italians typically drink it only at breakfast.'
    },
    taste: { zh: '咖啡与奶香平衡，奶泡绵密，口感丰富', en: 'Balanced coffee and milk, dense foam, rich texture' },
    caffeine: '约75mg',
    temperature: '65-70°C',
    bitterness: 3,
    acidity: 2,
    sweetness: 2,
    milk: 'medium',
    suitableFor: { zh: '喜欢咖啡与奶平衡的人', en: 'Those who like balanced coffee and milk' },
    image: 'https://picsum.photos/seed/cappuccino/400/400',
    color: 'from-amber-600 to-amber-800',
  },
  {
    id: 'espresso',
    name: { zh: '意式浓缩', en: 'Espresso' },
    origin: { zh: '意大利', en: 'Italy' },
    history: {
      zh: 'Espresso起源于20世纪初的意大利。1884年Angelo Moriondo申请了第一个咖啡机专利。通过高压热水快速萃取，是所有意式咖啡的基础。',
      en: 'Espresso originated in early 20th century Italy. Angelo Moriondo patented the first coffee machine in 1884. It\'s the foundation of all Italian coffees.'
    },
    taste: { zh: '浓郁、醇厚、带有明显的苦味和回甘', en: 'Rich, full-bodied, with bitterness and aftertaste' },
    caffeine: '约63mg',
    temperature: '88-92°C',
    bitterness: 5,
    acidity: 3,
    sweetness: 1,
    milk: 'none',
    suitableFor: { zh: '喜欢浓郁咖啡风味的人', en: 'Those who love intense coffee flavor' },
    image: 'https://picsum.photos/seed/espresso/400/400',
    color: 'from-stone-700 to-stone-900',
  },
  {
    id: 'mocha',
    name: { zh: '摩卡', en: 'Mocha' },
    origin: { zh: '意大利/也门', en: 'Italy/Yemen' },
    history: {
      zh: '摩卡咖啡的名字来源于也门的摩卡港，这里是15-17世纪最重要的咖啡贸易中心。现代摩卡是在浓缩咖啡中加入巧克力酱和蒸奶制成的。',
      en: 'Named after the port of Mocha in Yemen, a major coffee trade center from 15th-17th century. Modern mocha adds chocolate sauce and steamed milk to espresso.'
    },
    taste: { zh: '巧克力与咖啡完美融合，甜而不腻', en: 'Perfect blend of chocolate and coffee, sweet but not cloying' },
    caffeine: '约75mg',
    temperature: '65-70°C',
    bitterness: 2,
    acidity: 1,
    sweetness: 4,
    milk: 'lots',
    suitableFor: { zh: '喜欢甜食、巧克力爱好者', en: 'Sweet tooth, chocolate lovers' },
    image: 'https://picsum.photos/seed/mocha/400/400',
    color: 'from-amber-900 to-stone-900',
  },
  {
    id: 'flat-white',
    name: { zh: '馥芮白', en: 'Flat White' },
    origin: { zh: '澳大利亚/新西兰', en: 'Australia/New Zealand' },
    history: {
      zh: '馥芮白起源于澳新地区，1980年代咖啡师创造了这种饮品。它使用双份浓缩咖啡，奶泡更薄更细腻，咖啡味更浓郁。2015年星巴克将其引入全球菜单。',
      en: 'Originated in Australia/New Zealand in the 1980s. Uses double espresso with thinner microfoam, stronger coffee flavor. Starbucks introduced it globally in 2015.'
    },
    taste: { zh: '咖啡味浓郁，奶泡细腻丝滑', en: 'Strong coffee flavor, silky microfoam' },
    caffeine: '约130mg',
    temperature: '60-65°C',
    bitterness: 3,
    acidity: 2,
    sweetness: 2,
    milk: 'medium',
    suitableFor: { zh: '喜欢浓郁咖啡但又想要奶香的人', en: 'Those who want strong coffee with milk' },
    image: 'https://picsum.photos/seed/flatwhite/400/400',
    color: 'from-stone-400 to-stone-600',
  },
  {
    id: 'cold-brew',
    name: { zh: '冷萃咖啡', en: 'Cold Brew' },
    origin: { zh: '美国/日本', en: 'USA/Japan' },
    history: {
      zh: '冷萃咖啡的历史可追溯到17世纪的日本。现代冷萃在美国兴起，Blue Bottle等品牌将其推广。需要用冷水浸泡咖啡粉12-24小时。',
      en: 'Cold brew dates back to 17th century Japan. Modern cold brew emerged in the US, popularized by Blue Bottle. Coffee grounds steep in cold water for 12-24 hours.'
    },
    taste: { zh: '口感顺滑，酸度低，带有巧克力和坚果风味', en: 'Smooth taste, low acidity, chocolate and nutty flavors' },
    caffeine: '约200mg',
    temperature: '2-8°C',
    bitterness: 3,
    acidity: 1,
    sweetness: 2,
    milk: 'none',
    suitableFor: { zh: '不喜欢酸味咖啡、追求顺滑口感的人', en: 'Those who dislike acidic coffee' },
    image: 'https://picsum.photos/seed/coldbrew/400/400',
    color: 'from-blue-800 to-stone-900',
  },
  {
    id: 'pour-over',
    name: { zh: '手冲咖啡', en: 'Pour Over' },
    origin: { zh: '德国/日本', en: 'Germany/Japan' },
    history: {
      zh: '手冲咖啡起源于1908年德国商人Melitta发明的滤纸过滤法。日本咖啡师将手冲提升为一门艺术，能最好地展现单品咖啡豆的特色。',
      en: 'Pour over originated in 1908 with Melitta\'s filter paper invention. Japanese baristas elevated it to an art form, best showcasing single-origin beans.'
    },
    taste: { zh: '风味纯净，能最好地展现咖啡豆特色', en: 'Pure flavor, best showcases bean characteristics' },
    caffeine: '约80-120mg',
    temperature: '90-96°C',
    bitterness: 3,
    acidity: 4,
    sweetness: 2,
    milk: 'none',
    suitableFor: { zh: '精品咖啡爱好者、追求原味的人', en: 'Specialty coffee enthusiasts' },
    image: 'https://picsum.photos/seed/pourover/400/400',
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'macchiato',
    name: { zh: '玛奇朵', en: 'Macchiato' },
    origin: { zh: '意大利', en: 'Italy' },
    history: {
      zh: 'Macchiato在意大利语中是"标记"的意思。传统玛奇朵是在浓缩咖啡上加一小勺奶泡。星巴克的"焦糖玛奇朵"是对传统版本的改良。',
      en: 'Macchiato means "marked" in Italian. Traditional macchiato is espresso with a dollop of foam. Starbucks\' Caramel Macchiato is a modern variation.'
    },
    taste: { zh: '咖啡味浓郁，带有轻微的奶香', en: 'Strong coffee with hint of milk' },
    caffeine: '约85mg',
    temperature: '88-92°C',
    bitterness: 4,
    acidity: 3,
    sweetness: 1,
    milk: 'little',
    suitableFor: { zh: '喜欢浓缩咖啡但又想要一点奶的人', en: 'Those who like espresso with a touch of milk' },
    image: 'https://picsum.photos/seed/macchiato/400/400',
    color: 'from-stone-600 to-amber-800',
  },
  {
    id: 'dirty',
    name: { zh: '脏咖啡', en: 'Dirty' },
    origin: { zh: '中国/韩国', en: 'China/Korea' },
    history: {
      zh: 'Dirty咖啡是亚洲精品咖啡文化的创新产物。热的浓缩咖啡直接倒在冰牛奶上，形成分层效果。"脏"指的是咖啡与牛奶混合时的渐变效果。',
      en: 'Dirty is an innovation from Asian specialty coffee culture. Hot espresso poured over iced milk creates layers. The name refers to the gradient effect.'
    },
    taste: { zh: '先苦后甜，冷热交融，层次分明', en: 'Bitter then sweet, hot and cold, distinct layers' },
    caffeine: '约100mg',
    temperature: '冷热交替',
    bitterness: 4,
    acidity: 2,
    sweetness: 2,
    milk: 'medium',
    suitableFor: { zh: '喜欢尝试新鲜事物、追求口感层次的人', en: 'Adventurous tasters seeking layered flavors' },
    image: 'https://picsum.photos/seed/dirty/400/400',
    color: 'from-stone-800 to-amber-200',
  },
];

export const getCoffeeTypeById = (id: string) => coffeeTypesDetailed.find(t => t.id === id);