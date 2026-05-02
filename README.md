# 咖啡热度平台 (Coffee Popularity Platform)

一个面向咖啡爱好者、咖啡新手、城市探店人群和精品咖啡商家的「咖啡馆发现 + 咖啡热度排名 + 咖啡知识百科 + 商家入驻」平台。

## 项目定位

- **用户端**：微信小程序优先，方便用户随时查附近热门咖啡馆、收藏、打卡、看榜单、学咖啡知识
- **Web 端**：用于 SEO、品牌展示、城市榜单内容沉淀、咖啡百科内容沉淀
- **商家端**：Web 后台优先，让咖啡店老板入驻、编辑店铺资料、上传菜单、查看热度数据
- **管理端**：平台运营人员审核商家、管理榜单、处理评论、配置推荐位

## 项目结构

```
coffee-platform/
├── apps/
│   ├── web/              # Next.js Web 前台 + 商家后台 + 管理后台
│   ├── miniapp/          # Taro 微信小程序 (待实现)
│   └── api/              # FastAPI 后端
├── packages/
│   ├── shared/           # 共享类型、枚举、工具函数
│   ├── api-client/       # 前端请求 SDK
│   └── ui-tokens/        # 颜色、间距、字体等设计变量 (待实现)
└── README.md
```

## 技术栈

### 前端
- **Web 前台**：Next.js + React + TypeScript + Tailwind CSS
- **微信小程序**：Taro + React (待实现)

### 后端
- **API 服务**：Python FastAPI
- **ORM**：SQLAlchemy
- **数据库迁移**：Alembic
- **认证**：JWT / 微信登录

### 数据库
- **主数据库**：PostgreSQL
- **缓存**：Redis (待实现)

## 快速开始

### 1. 启动后端 API

```bash
cd apps/api

# 安装依赖
pip install -r requirements.txt

# 启动数据库 (需要 Docker)
docker run -d --name coffee-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=coffee_platform -p 5432:5432 postgres:15

# 初始化数据库
alembic upgrade head

# 启动 API 服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API 文档地址：http://localhost:8000/docs

### 2. 启动 Web 前端

```bash
cd apps/web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

Web 应用地址：http://localhost:3000

## 核心功能

### 用户端
1. **首页推荐** - 当前城市热门咖啡馆、快捷筛选
2. **城市榜单** - 城市总榜、附近热榜、新店榜、高评分榜等
3. **咖啡馆详情** - 店铺信息、招牌饮品、用户评价
4. **咖啡百科** - 咖啡种类、新手指南
5. **用户互动** - 收藏、打卡、评价

### 商家端
1. **商家入驻** - 提交入驻申请
2. **店铺管理** - 编辑店铺信息、上传图片、管理菜单
3. **数据看板** - 查看浏览、收藏、打卡、评论数据

### 管理端
1. **商家审核** - 审核商家入驻申请
2. **内容管理** - 管理店铺、评论
3. **榜单管理** - 配置榜单规则

## API 接口

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

### 城市
- `GET /api/v1/cities/` - 获取城市列表
- `GET /api/v1/cities/{city_id}` - 获取城市详情
- `GET /api/v1/cities/{city_id}/districts` - 获取城市商圈

### 咖啡馆
- `GET /api/v1/shops/` - 获取咖啡馆列表
- `GET /api/v1/shops/{shop_id}` - 获取咖啡馆详情
- `GET /api/v1/shops/ranking/{city_id}` - 获取城市榜单

### 用户互动
- `POST /api/v1/favorites/{shop_id}` - 收藏咖啡馆
- `DELETE /api/v1/favorites/{shop_id}` - 取消收藏
- `POST /api/v1/checkins/` - 打卡
- `POST /api/v1/reviews/` - 发表评价

### 商家
- `POST /api/v1/merchant/apply` - 商家入驻申请
- `GET /api/v1/merchant/my-applications` - 查看申请状态

### 管理
- `GET /api/v1/admin/merchant-applications` - 获取商家申请列表
- `PATCH /api/v1/admin/merchant-applications/{id}/approve` - 审核通过
- `PATCH /api/v1/admin/merchant-applications/{id}/reject` - 审核拒绝

## 热度算法

热度分数满分 100，由以下因素组成：

1. **浏览热度**：20%
2. **收藏热度**：20%
3. **打卡热度**：20%
4. **评论热度**：15%
5. **评分质量**：15%
6. **近期增长**：10%

```
popularity_score =
  view_score * 0.20 +
  favorite_score * 0.20 +
  checkin_score * 0.20 +
  review_score * 0.15 +
  rating_score * 0.15 +
  trend_score * 0.10
```

## 开发计划

### 阶段 1：基础技术架构 ✅
- [x] 创建 monorepo
- [x] 创建 Next.js Web 项目
- [x] 创建 FastAPI 后端项目
- [x] 配置 PostgreSQL

### 阶段 2：用户端核心浏览功能 ✅
- [x] 城市列表 API
- [x] 咖啡馆列表 API
- [x] 榜单 API
- [x] 咖啡馆详情 API
- [x] 首页页面
- [x] 榜单页面
- [x] 店铺详情页面

### 阶段 3：用户互动功能 ✅
- [x] 用户注册/登录
- [x] 收藏功能
- [x] 打卡功能
- [x] 评论功能

### 阶段 4：商家入驻和后台
- [ ] 商家入驻表单
- [ ] 商家登录
- [ ] 店铺资料编辑
- [ ] 菜单管理
- [ ] 图片上传
- [ ] 数据看板

### 阶段 5：管理后台
- [ ] 商家审核
- [ ] 店铺审核
- [ ] 评论审核
- [ ] 标签管理
- [ ] 城市管理
- [ ] 榜单管理

### 阶段 6：微信小程序
- [ ] 创建 Taro 项目
- [ ] 实现底部 Tab
- [ ] 实现首页
- [ ] 实现榜单页
- [ ] 实现店铺详情页
- [ ] 实现搜索页
- [ ] 实现百科页
- [ ] 实现我的页面
- [ ] 实现微信登录

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License