# 智能简历生成与优化平台 (AIResume)

基于 **Vue 3 + FastAPI + Qwen + Qdrant** 的 AI 简历构建与优化 Web 应用。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + TypeScript + Tailwind CSS | 响应式交互，主题预览，拖拽排序 |
| 后端 | Python FastAPI | 高性能异步 API，JWT 鉴权 |
| 大模型 | 阿里云通义千问 (Qwen) | 简历润色、JD 匹配、技能推荐、面试题生成、Word 文档解析 |
| 向量数据库 | Qdrant | RAG 检索增强，技能图谱与 JD 向量匹配 |
| 文档导出 | python-docx + docx2pdf | Word/PDF 高保真导出（原生 Word 渲染，完美支持中文） |
| 数据库 | MySQL | 简历持久化存储，CRUD 操作 |

## 核心功能

### 1. 动态交互式简历编辑器
- **模块拖拽排序**：教育背景、工作经历、项目经验、技能清单等栏位支持上下拖拽
- **33 套主题**：25 套单栏主题 + 8 套侧边栏/双栏主题，切换时自动调整视觉风格
- **排版控制**：滑动条控制页边距、行间距、字间距
- **主题预览**：鼠标悬停即可预览主题的全部视觉效果（头部样式、卡片样式、装饰风格）

### 2. Word 文档智能导入
- 拖拽上传 `.docx` 文件，自动提取文本内容
- Qwen AI 解析为非结构化简历数据结构
- 预览解析结果后一键保存为简历

### 3. 同类型栏位自动合并
- 多个教育背景、工作经历等自动合并显示为同一栏位
- 条目之间自动添加分隔线和间距

### 4. 深度 AI 赋能 (Qwen + Qdrant)
- **简历润色扩写**：STAR 法则重写，将大白话转为专业表述
- **岗位精准匹配 (RAG)**：JD 向量化检索，高亮匹配项，提示缺失技能
- **智能技能图谱推荐**：根据职位推荐高频行业技能词汇
- **模拟面试生成器**：基于简历 + JD 生成针对性面试题

### 5. 跨平台文档导出
- **Word (.docx)**：python-docx 动态生成，与主题样式一致
  - 支持 4 种标题装饰样式（下划线、左竖条、圆点、无装饰）
  - 字体自动映射（Web 字体 → Word 系统字体）
  - 姓名变换（大写、宽字距）
  - 同类型条目间自动分隔线
  - 正确的行高和段落间距（与网页预览一致）
- **PDF (.pdf)**：docx2pdf 通过 Word COM 原生转换，完美支持中文

## 主题系统

### 单栏主题（25 套）
| 主题 ID | 名称 | headingStyle | 特点 |
|---------|------|-------------|------|
| minimal | 极简 | underline | 简约清爽，适合传统行业 |
| geek | 极客 | underline | 技术导向，Monospace 字体 |
| business | 商务 | underline | 专业正式，Serif 字体 |
| elegant | 雅致 | underline | 深棕暖调，文雅知性 |
| forest | 森林 | **left-bar** | 深绿自然，沉稳内敛 |
| lavender | 薰衣草 | **dot** | 淡紫柔美，温婉优雅 |
| sunset | 日落 | underline | 暖橙活力，热情积极 |
| midnight | 午夜 | **left-bar** | 深蓝宁静，沉稳专业 |
| rose | 玫瑰 | **dot** | 粉红清新，柔和亲和 |
| slate | 石板 | underline | 冷灰克制，极简理性 |
| teal | 青碧 | **left-bar** | 青绿清新，稳重现代 |
| wine | 红酒 | underline | 深红醇厚，典雅尊贵 |
| ocean | 海洋 | underline | 蔚蓝宽广，开放包容 |
| moss | 苔藓 | **left-bar** | 橄榄沉稳，低调内敛 |
| graphite | 石墨 | underline | 深灰坚毅，力量感强 |
| coral | 珊瑚 | **dot** | 珊瑚暖色，亲切活泼 |
| indigo | 靛青 | underline | 靛蓝深邃，智慧沉稳 |
| sand | 沙漠 | underline | 沙漠暖调，朴实务实 |
| mist | 薄雾 | **left-bar** | 淡蓝轻盈，清透明快 |
| charcoal | 炭黑 | underline | 深黑硬朗，极致对比 |
| sage | 鼠尾草 | **dot** | 灰绿淡雅，柔和中性 |
| plum | 梅紫 | underline | 紫梅端庄，沉稳雅致 |
| copper | 紫铜 | **left-bar** | 铜金复古，成熟稳重 |
| ice | 冰川 | **none** | 冰蓝极简，冷静理性 |
| maple | 枫叶 | underline | 枫红秋意，温暖大方 |

### 侧边栏/双栏主题（8 套）
navy-sidebar、emerald-sidebar、burgundy-sidebar、obsidian-sidebar、violet-sidebar、teal-sidebar、amber-twocol、slate-twocol

## 项目结构

```
AIResume/
├── backend/                        # FastAPI 后端
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai_routes.py        # AI 智能服务路由（润色、匹配、推荐、面试、Word解析）
│   │   │   ├── export_routes.py    # 导出路由（Word/PDF）
│   │   │   ├── common_routes.py    # 通用路由（主题列表、健康检查）
│   │   │   └── resume_routes.py    # 简历 CRUD 路由
│   │   ├── core/
│   │   │   └── config.py           # 配置管理（纯 Python，无三方依赖）
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic 数据模型
│   │   ├── services/
│   │   │   ├── qwen_service.py     # 通义千问 AI 服务
│   │   │   ├── qdrant_service.py   # Qdrant 向量检索服务
│   │   │   └── export_service.py   # 文档导出服务
│   │   └── main.py                 # 应用入口
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                        # 本地环境配置（勿提交）
├── frontend/                       # Vue 3 前端
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts            # API 调用封装（含 FormData 支持）
│   │   ├── assets/
│   │   │   └── styles/             # 样式资源
│   │   ├── components/
│   │   │   ├── AppHeader.vue
│   │   │   ├── PersonalInfoEditor.vue
│   │   │   ├── SectionEditor.vue
│   │   │   ├── LayoutControls.vue
│   │   │   ├── ResumePreviewContent.vue   # 主题驱动的简历预览渲染
│   │   │   └── ThemeSelector.vue          # 带悬停预览的主题选择器
│   │   ├── config/
│   │   │   └── themes.ts           # 33 套主题完整配置
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── stores/
│   │   │   └── resume.ts           # Pinia 状态管理
│   │   ├── views/
│   │   │   ├── ResumeEditor.vue    # 简历编辑器
│   │   │   ├── ResumePreview.vue   # 简历预览 + 导出
│   │   │   ├── AIAssistant.vue     # AI 助手面板
│   │   │   └── WordImport.vue      # Word 文档智能导入
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── index.html
├── docker-compose.yml              # 一键编排（后端 + Qdrant + 前端）
└── README.md
```

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 1. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 .env 填入你的 Qwen API Key

# 2. 一键启动
docker-compose up -d

# 3. 访问应用
# 前端: http://localhost
# 后端 API 文档: http://localhost:8000/docs
# Qdrant 控制台: http://localhost:6333/dashboard
```

### 方式二：本地开发

**后端：**

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 Qwen API Key（必须）
# 可以不配置 MySQL 和 Qdrant，系统会降级运行

# 启动服务
uvicorn app.main:app --reload --port 8000
```

**前端：**

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

**Qdrant（可选）：**

```bash
# Docker 方式启动
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest
```

## API 接口概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/ai/polish` | AI 简历润色（STAR 法则） |
| POST | `/api/v1/ai/match-jd` | 岗位 JD 精准匹配 |
| POST | `/api/v1/ai/recommend-skills` | 智能技能推荐 |
| POST | `/api/v1/ai/interview` | 模拟面试题生成 |
| POST | `/api/v1/ai/parse-docx` | Word 文档 AI 智能解析 |
| POST | `/api/v1/resume/export` | 导出简历 (docx/pdf) |
| GET | `/api/v1/themes` | 获取可用主题列表 |
| GET | `/health` | 健康检查 |

完整 API 文档启动后访问：`http://localhost:8000/docs`

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `QWEN_API_KEY` | 通义千问 API Key | **（必填）** |
| `QWEN_BASE_URL` | Qwen API 地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | 模型名称 | `qwen-plus` |
| `QDRANT_URL` | Qdrant 地址 | `http://localhost:6333` |
| `QDRANT_API_KEY` | Qdrant API Key | 空 |
| `EXPORT_DIR` | 导出文件临时目录 | `./exports` |
| `CORS_ORIGINS` | CORS 允许的源 | `http://localhost:5173,http://localhost:3000` |
| `MYSQL_USER` | MySQL 用户名 | `root` |
| `MYSQL_PASSWORD` | MySQL 密码 | 空 |
| `MYSQL_DATABASE` | MySQL 数据库名 | `ai_resume` |
| `JWT_SECRET` | JWT 签名密钥 | 内置默认值（生产环境请修改） |

## 开发建议

1. **AI 能力渐进接入**：先配置 QWEN_API_KEY 跑通文本润色 API，再接入 Qdrant RAG 检索
2. **Qdrant 冷启动**：首次使用时需导入向量数据
3. **PDF 导出**：依赖本地 Microsoft Word 进行 docx → PDF 转换；无 Word 环境时自动降级为 xhtml2pdf
4. **主题自定义**：修改 `frontend/src/config/themes.ts` 添加新主题，后端 `THEME_COLORS` 需同步更新
