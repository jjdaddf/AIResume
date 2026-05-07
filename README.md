# 智能简历生成与优化平台

基于 Vue 3 + FastAPI + Qwen + Qdrant 的 AI 简历构建与优化 Web 应用。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + TypeScript + Tailwind CSS | 响应式交互，拖拽排版 |
| 后端 | Python FastAPI | 高性能异步 API |
| 大模型 | 阿里云通义千问 (Qwen) | 简历润色、JD 匹配、技能推荐、面试题生成 |
| 向量数据库 | Qdrant | RAG 检索增强，技能图谱与 JD 向量匹配 |
| 文档导出 | python-docx + LibreOffice | Word/PDF 高保真导出 |

## 核心功能

### 1. 动态交互式简历编辑器
- **模块拖拽排序**：教育背景、工作经历、项目经验、技能清单等栏位支持上下拖拽
- **主题切换**：极简 / 极客 / 商务三套主题，切换时自动调整视觉风格
- **排版控制**：滑动条控制页边距、行间距、字间距

### 2. 深度 AI 赋能 (Qwen + Qdrant)
- **简历润色扩写**：STAR 法则重写，将大白话转为专业表述
- **岗位精准匹配 (RAG)**：JD 向量化检索，高亮匹配项，提示缺失技能
- **智能技能图谱推荐**：根据职位推荐高频行业技能词汇
- **模拟面试生成器**：基于简历 + JD 生成针对性面试题

### 3. 跨平台文档导出
- **Word (.docx)**：python-docx 动态生成
- **PDF (.pdf)**：前端 html2pdf 快速导出 + 后端 LibreOffice 高保真转换

## 项目结构

```
AIResume/
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── api/                # API 路由层
│   │   │   ├── ai_routes.py    # AI 智能服务路由
│   │   │   ├── export_routes.py # 导出路由
│   │   │   └── common_routes.py # 通用路由
│   │   ├── core/
│   │   │   └── config.py       # 配置管理
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic 数据模型
│   │   ├── services/
│   │   │   ├── qwen_service.py  # 通义千问服务
│   │   │   ├── qdrant_service.py # Qdrant 向量服务
│   │   │   └── export_service.py # 文档导出服务
│   │   └── main.py             # 应用入口
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # Vue 3 前端
│   ├── src/
│   │   ├── api/                # API 调用层
│   │   ├── assets/             # 样式资源
│   │   ├── components/         # 公共组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── PersonalInfoEditor.vue
│   │   │   ├── SectionEditor.vue
│   │   │   └── LayoutControls.vue
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia 状态管理
│   │   │   └── resume.ts
│   │   ├── views/              # 页面视图
│   │   │   ├── ResumeEditor.vue
│   │   │   ├── ResumePreview.vue
│   │   │   └── AIAssistant.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml          # 一键编排
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
# 编辑 .env

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

**Qdrant：**

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
| POST | `/api/v1/resume/export` | 导出简历 (docx/pdf) |
| GET  | `/api/v1/themes` | 获取可用主题列表 |
| GET  | `/health` | 健康检查 |

完整 API 文档启动后访问：`http://localhost:8000/docs`

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `QWEN_API_KEY` | 通义千问 API Key | - |
| `QWEN_BASE_URL` | Qwen API 地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | 模型名称 | `qwen-plus` |
| `QDRANT_URL` | Qdrant 地址 | `http://localhost:6333` |
| `QDRANT_API_KEY` | Qdrant API Key | 空 |
| `EXPORT_DIR` | 导出文件临时目录 | `./exports` |
| `CORS_ORIGINS` | CORS 允许的源 | `http://localhost:5173` |

## 开发建议

1. **AI 能力渐进接入**：先跑通 Qwen 文本润色 API，再接入 Qdrant RAG 检索
2. **Qdrant 冷启动**：预先导入高质量简历样本和岗位描述的向量数据
3. **PDF 导出**：本地开发可使用前端 html2pdf 方案；生产环境推荐 Docker + LibreOffice 后端方案
