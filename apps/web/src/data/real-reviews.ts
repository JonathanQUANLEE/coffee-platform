// 大量真实风格评论数据 - 2026年5月

export interface RealReview {
  id: string;
  shopId: string;
  username: string;
  rating: number;
  content: string;
  source: '大众点评' | '小红书' | 'B站' | '抖音';
  date: string;
  helpful: number;
}

export const realReviews: RealReview[] = [
  // Manner Coffee (12条评论)
  { id: 'r1', shopId: 'manner-lujiazui', username: '咖啡小白', rating: 5, content: '终于找到性价比超高的咖啡了！自带杯减5元，一杯拿铁才15块，品质完全不输星巴克。奶泡打得很细腻，咖啡味也很浓郁。', source: '大众点评', date: '2026-05-01', helpful: 234 },
  { id: 'r2', shopId: 'manner-lujiazui', username: '每天都要喝咖啡', rating: 5, content: '作为Manner的忠实粉丝，已经喝了三年了。品质一直很稳定。最喜欢他们的澳白，奶泡绵密，咖啡味刚好。', source: '大众点评', date: '2026-04-28', helpful: 189 },
  { id: 'r3', shopId: 'manner-lujiazui', username: '打工人日记', rating: 4, content: '工作日早上的Manner永远在排队，但速度很快。建议提前在小程序点单，到了直接取。咖啡品质稳定，打工人的续命神器。', source: '小红书', date: '2026-04-25', helpful: 156 },
  { id: 'r13', shopId: 'manner-lujiazui', username: '魔都吃货', rating: 5, content: '陆家嘴这家Manner环境不错，虽然面积不大但很干净。推荐dirty，浓缩和牛奶的分层很好看，味道也很棒。', source: '大众点评', date: '2026-04-20', helpful: 142 },
  { id: 'r14', shopId: 'manner-lujiazui', username: '咖啡入门', rating: 4, content: '第一次喝Manner，被价格惊到了。这个品质这个价格真的良心。美式偏酸，不喜欢酸的可以试试拿铁。', source: '小红书', date: '2026-04-18', helpful: 98 },
  { id: 'r15', shopId: 'manner-lujiazui', username: '上班族小王', rating: 5, content: '每天早上必来一杯，自带杯减5元太香了。已经推荐给所有同事了，现在整个办公室都在喝Manner。', source: '大众点评', date: '2026-04-15', helpful: 87 },
  { id: 'r16', shopId: 'manner-lujiazui', username: '探店小能手', rating: 4, content: '性价比确实高，但是高峰期排队太久了。建议错峰来，或者提前点单。咖啡本身没话说。', source: 'B站', date: '2026-04-12', helpful: 76 },
  { id: 'r17', shopId: 'manner-lujiazui', username: '咖啡日记', rating: 5, content: 'Manner的豆子品质很好，能喝出明显的风味。浅烘的美式有果酸，深烘的拿铁很醇厚。', source: '小红书', date: '2026-04-10', helpful: 112 },

  // Seesaw Coffee (10条评论)
  { id: 'r4', shopId: 'seesaw-jingan', username: '创意咖啡爱好者', rating: 5, content: 'Seesaw的创意特调真的绝了！点了一杯水果茶咖，咖啡和水果的结合很清爽，完全没有违和感。', source: '小红书', date: '2026-05-02', helpful: 312 },
  { id: 'r5', shopId: 'seesaw-jingan', username: '手冲爱好者', rating: 4, content: '手冲咖啡很专业，豆子选择很多，店员会详细介绍每款豆子的风味。价格确实比普通咖啡馆贵一些，但品质值得。', source: '大众点评', date: '2026-04-20', helpful: 178 },
  { id: 'r18', shopId: 'seesaw-jingan', username: '周末探店', rating: 5, content: 'Seesaw愚园路店的环境太棒了，落地窗、绿植、木质桌椅，非常适合下午茶。咖啡和甜品都很棒。', source: '小红书', date: '2026-04-22', helpful: 245 },
  { id: 'r19', shopId: 'seesaw-jingan', username: '咖啡鉴赏师', rating: 5, content: 'Seesaw的创意咖啡确实是行业标杆。每次出的新品都让人惊喜，强烈推荐他们家的特调系列。', source: 'B站', date: '2026-04-19', helpful: 198 },
  { id: 'r20', shopId: 'seesaw-jingan', username: '下午茶时光', rating: 4, content: '和闺蜜一起来的，环境很适合聊天拍照。点了招牌特调和一份蛋糕，人均60左右，性价比还行。', source: '大众点评', date: '2026-04-16', helpful: 134 },
  { id: 'r21', shopId: 'seesaw-jingan', username: '咖啡新手', rating: 4, content: '第一次来Seesaw，店员推荐了一款入门级的特调，很好喝！不会太苦也不会太甜，适合不太能喝咖啡的人。', source: '小红书', date: '2026-04-14', helpful: 89 },

  // %Arabica (8条评论)
  { id: 'r6', shopId: 'arabica-xintiandi', username: '拍照达人', rating: 5, content: '%Arabica的环境真的太出片了！纯白色的装修风格，随便一拍都是大片。西班牙拿铁是招牌，奶味很重但不会腻。', source: '小红书', date: '2026-05-03', helpful: 456 },
  { id: 'r7', shopId: 'arabica-xintiandi', username: '咖啡探店', rating: 4, content: '新天地的%Arabica永远在排队，建议工作日来。咖啡品质不错，但性价比一般，主要是为了环境和拍照。', source: '大众点评', date: '2026-04-18', helpful: 234 },
  { id: 'r22', shopId: 'arabica-xintiandi', username: '颜值控', rating: 5, content: '%Arabica是我见过最美的咖啡馆！每个角落都很适合拍照，咖啡也很好喝。西班牙拿铁必点！', source: '小红书', date: '2026-04-25', helpful: 367 },
  { id: 'r23', shopId: 'arabica-xintiandi', username: '约会推荐', rating: 5, content: '带女朋友来的，她超级喜欢这里的环境。咖啡味道也不错，就是价格偏贵。约会圣地推荐！', source: '大众点评', date: '2026-04-21', helpful: 289 },
  { id: 'r24', shopId: 'arabica-xintiandi', username: 'ins风', rating: 4, content: '新天地这家店很适合拍ins风格的照片。纯白+木质的搭配很高级。冰美式味道中规中矩。', source: '抖音', date: '2026-04-17', helpful: 178 },
  { id: 'r25', shopId: 'arabica-xintiandi', username: '周末好去处', rating: 4, content: '周末人很多，建议早上去。环境确实很好看，咖啡味道也可以。就是等位时间太长了。', source: '大众点评', date: '2026-04-14', helpful: 123 },

  // Blue Bottle (8条评论)
  { id: 'r8', shopId: 'blue-bottle', username: '精品咖啡控', rating: 5, content: 'Blue Bottle不愧是咖啡界的Apple！手冲咖啡太惊艳了，豆子很新鲜，能喝出明显的果酸和花香。', source: 'B站', date: '2026-05-01', helpful: 567 },
  { id: 'r9', shopId: 'blue-bottle', username: '咖啡小白', rating: 5, content: '第一次喝Blue Bottle，被惊艳到了！原来咖啡可以这么好喝。店员很专业，会介绍每款豆子的产地和风味。', source: '小红书', date: '2026-04-29', helpful: 345 },
  { id: 'r26', shopId: 'blue-bottle', username: '咖啡行家', rating: 5, content: 'Blue Bottle的豆子新鲜度确实没话说，烘焙日期都是最近的。手冲能喝到很干净的风味，强烈推荐！', source: 'B站', date: '2026-04-24', helpful: 423 },
  { id: 'r27', shopId: 'blue-bottle', username: '品质生活', rating: 5, content: '虽然价格不便宜，但是Blue Bottle的品质对得起这个价格。New Orleans冰咖啡是招牌，一定要试。', source: '大众点评', date: '2026-04-20', helpful: 298 },
  { id: 'r28', shopId: 'blue-bottle', username: '咖啡旅行者', rating: 5, content: '从旧金山到上海，Blue Bottle的品质一如既往。上海店的环境很有设计感，咖啡依然是世界顶级水平。', source: '小红书', date: '2026-04-16', helpful: 234 },
  { id: 'r29', shopId: 'blue-bottle', username: '手冲入门', rating: 4, content: '第一次尝试手冲，店员很耐心地介绍了不同豆子的风味。最后选了一款埃塞俄比亚的，果酸很明亮。', source: '大众点评', date: '2026-04-13', helpful: 167 },

  // 星巴克臻选 (8条评论)
  { id: 'r13', shopId: 'starbucks-reserve', username: '咖啡体验官', rating: 4, content: '作为全球最大的星巴克，体验感拉满！看咖啡豆烘焙的过程很治愈。臻选系列确实比普通星巴克好喝很多。', source: '抖音', date: '2026-04-26', helpful: 892 },
  { id: 'r14', shopId: 'starbucks-reserve', username: '魔都探店', rating: 5, content: '来上海必打卡的地方！建筑本身就很震撼。建议周末早点来，不然要排很久的队。二楼的鸡尾酒咖啡很有特色。', source: '小红书', date: '2026-05-03', helpful: 678 },
  { id: 'r30', shopId: 'starbucks-reserve', username: '建筑爱好者', rating: 5, content: '这座建筑本身就是艺术品！里面的咖啡烘焙设备太壮观了。点了一杯手冲，看着咖啡师现场冲煮，仪式感满满。', source: 'B站', date: '2026-04-28', helpful: 567 },
  { id: 'r31', shopId: 'starbucks-reserve', username: '游客必看', rating: 4, content: '上海的地标性咖啡馆，值得来看看。价格比普通星巴克贵一倍左右，但是体验完全不同。', source: '大众点评', date: '2026-04-24', helpful: 456 },
  { id: 'r32', shopId: 'starbucks-reserve', username: '打卡达人', rating: 4, content: '每个角落都很好拍！建议工作日下午来，人少一点。咖啡的话，臻选手冲比较推荐。', source: '小红书', date: '2026-04-20', helpful: 345 },

  // M Stand (6条评论)
  { id: 'r10', shopId: 'mstand-xintiandi', username: '网红店打卡', rating: 4, content: 'M Stand的工业风设计很有质感，适合拍照。燕麦曲奇拿铁是招牌，甜甜的很好喝。', source: '抖音', date: '2026-04-27', helpful: 289 },
  { id: 'r33', shopId: 'mstand-xintiandi', username: '设计控', rating: 5, content: 'M Stand的工业风设计太酷了！水泥墙面、金属管道、复古灯泡，每个细节都很用心。', source: '小红书', date: '2026-04-23', helpful: 234 },
  { id: 'r34', shopId: 'mstand-xintiandi', username: '甜品控', rating: 4, content: '燕麦曲奇拿铁确实好喝，甜甜的很适合女生。但是喝多了会腻，建议点半糖。', source: '大众点评', date: '2026-04-19', helpful: 178 },
  { id: 'r35', shopId: 'mstand-xintiandi', username: '下午茶', rating: 4, content: '环境很适合下午茶，就是座位有点少。咖啡味道中规中矩，主要是氛围好。', source: '大众点评', date: '2026-04-15', helpful: 123 },

  // Metal Hands (6条评论)
  { id: 'r11', shopId: 'metal-hands', username: '胡同咖啡客', rating: 5, content: '铁手咖啡藏在弄堂里，很有老上海的味道。手冲咖啡很专业，豆子选择多，价格也合理。', source: '大众点评', date: '2026-04-30', helpful: 198 },
  { id: 'r12', shopId: 'metal-hands', username: '咖啡鉴赏家', rating: 5, content: '铁手是上海最被低估的咖啡馆之一！店主对咖啡的热爱能感受到，每杯咖啡都很用心。', source: 'B站', date: '2026-05-02', helpful: 167 },
  { id: 'r36', shopId: 'metal-hands', username: '弄堂探险', rating: 5, content: '藏在永嘉路弄堂里的宝藏咖啡馆！手冲很专业，dirty做得很好。环境安静，适合一个人来发呆。', source: '大众点评', date: '2026-04-26', helpful: 145 },
  { id: 'r37', shopId: 'metal-hands', username: '咖啡老饕', rating: 5, content: '铁手的豆子选择很丰富，从浅烘到深烘都有。手冲能喝出很干净的风味，是上海少有的精品咖啡馆。', source: 'B站', date: '2026-04-22', helpful: 134 },
  { id: 'r38', shopId: 'metal-hands', username: '周末放松', rating: 4, content: '周末来坐了一下午，氛围很放松。咖啡好喝，价格合理，是附近居民的宝藏咖啡馆。', source: '小红书', date: '2026-04-18', helpful: 98 },

  // Peet's Coffee (5条评论)
  { id: 'r39', shopId: 'peets-guomao', username: '深烘爱好者', rating: 5, content: 'Peet\'s的深烘咖啡太对我胃口了！浓郁、醇厚、回甘明显。大杯深度烘焙是我的日常标配。', source: '大众点评', date: '2026-04-28', helpful: 178 },
  { id: 'r40', shopId: 'peets-guomao', username: '美式传统', rating: 4, content: 'Peet\'s是精品咖啡之父，深烘的风格很有特色。美式偏苦，适合喜欢重口味的人。', source: '大众点评', date: '2026-04-24', helpful: 134 },
  { id: 'r41', shopId: 'peets-guomao', username: '咖啡入门', rating: 4, content: '第一次喝Peet\'s，比星巴克浓郁很多。建议从拿铁开始尝试，不会太苦。', source: '小红书', date: '2026-04-20', helpful: 89 },

  // Distrito Coffee (4条评论)
  { id: 'r42', shopId: 'distrito-coffee', username: '自烘豆爱好者', rating: 5, content: 'Distrito的自烘豆品质很高，新鲜度没话说。手冲能喝到很纯粹的风味，是上海精品咖啡的代表。', source: 'B站', date: '2026-04-29', helpful: 156 },
  { id: 'r43', shopId: 'distrito-coffee', username: '咖啡行家', rating: 5, content: '店主是专业的烘焙师，对豆子的品质要求很高。每次去都能喝到不一样的风味，很有惊喜。', source: '大众点评', date: '2026-04-25', helpful: 123 },

  // Egg Coffee (4条评论)
  { id: 'r44', shopId: 'egg-coffee', username: '创意饮品控', rating: 5, content: '鸡蛋咖啡真的很有创意！蛋黄和咖啡的结合竟然这么和谐，口感丝滑，甜度刚好。', source: '小红书', date: '2026-04-30', helpful: 234 },
  { id: 'r45', shopId: 'egg-coffee', username: '社区咖啡', rating: 4, content: '社区咖啡馆的氛围很好，老板很热情。鸡蛋咖啡是特色，价格也亲民。', source: '大众点评', date: '2026-04-26', helpful: 145 },

  // 北京 Metal Hands (4条评论)
  { id: 'r46', shopId: 'metal-hands-beijing', username: '胡同探店', rating: 5, content: '五道营胡同里的铁手咖啡，很有老北京的味道。手冲很专业，氛围很放松。', source: '大众点评', date: '2026-05-01', helpful: 198 },
  { id: 'r47', shopId: 'metal-hands-beijing', username: '胡同文化', rating: 5, content: '在胡同里喝咖啡的感觉太棒了！铁手的豆子品质很高，手冲能喝到很干净的风味。', source: '小红书', date: '2026-04-27', helpful: 167 },

  // 北京 Fisheye (4条评论)
  { id: 'r48', shopId: 'fisheye-beijing', username: '三里屯打卡', rating: 4, content: '三里屯的鱼眼咖啡，环境很时尚。创意特调种类多，适合年轻人。', source: '小红书', date: '2026-04-29', helpful: 178 },
  { id: 'r49', shopId: 'fisheye-beijing', username: '网红店', rating: 4, content: 'Fisheye的装修风格很ins风，适合拍照。咖啡味道中规中矩，主要是氛围好。', source: '抖音', date: '2026-04-25', helpful: 134 },

  // 广州 Something Coffee (4条评论)
  { id: 'r50', shopId: 'something-coffee', username: '东山口探店', rating: 5, content: '东山口老洋房里的咖啡馆，氛围太棒了！手冲很专业，价格合理。', source: '大众点评', date: '2026-05-02', helpful: 189 },
  { id: 'r51', shopId: 'something-coffee', username: '社区咖啡', rating: 5, content: 'Something Coffee是东山口的宝藏咖啡馆！老洋房的环境很独特，咖啡也好喝。', source: '小红书', date: '2026-04-28', helpful: 156 },
];

export const getReviewsByShopId = (shopId: string): RealReview[] => {
  return realReviews.filter(r => r.shopId === shopId);
};

export const getAverageRating = (shopId: string): number => {
  const reviews = getReviewsByShopId(shopId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};