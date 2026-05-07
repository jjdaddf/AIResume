"""FastAPI 应用主入口"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_database
from app.api.ai_routes import router as ai_router
from app.api.export_routes import router as export_router
from app.api.common_routes import router as common_router
from app.routers.auth_routes import router as auth_router
from app.routers.resume_routes import router as resume_router
from app.services.qdrant_service import qdrant_service

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化
    logger.info("🚀 AIResume Backend 启动中...")
    try:
        qdrant_service.init_collections()
        logger.info("✅ Qdrant 集合初始化完成")
    except Exception as e:
        logger.warning(f"⚠️ Qdrant 初始化失败（将使用降级模式）: {e}")
    try:
        init_database()
        logger.info("✅ MySQL 数据库初始化完成")
    except Exception as e:
        logger.error(f"❌ MySQL 数据库初始化失败: {e}")
    yield
    # 关闭时清理
    logger.info("👋 AIResume Backend 关闭")


app = FastAPI(
    title="智能简历生成与优化平台",
    description="基于 Qwen + Qdrant 的 AI 简历构建与优化 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(common_router)
app.include_router(ai_router, prefix="/api/v1")
app.include_router(export_router, prefix="/api/v1")
app.include_router(auth_router)
app.include_router(resume_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=True,
    )
