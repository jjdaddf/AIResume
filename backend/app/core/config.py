"""
应用配置 - 读取 .env 环境变量（无需第三方依赖）
"""

import os
import re
from pathlib import Path


def _load_env_file(path: Path):
    """手动解析 .env 文件，设置到 os.environ"""
    if not path.exists():
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            val = val.strip()
            # 去除引号
            if len(val) >= 2 and val[0] == val[-1] and val[0] in ('"', "'"):
                val = val[1:-1]
            # 只设置尚未存在的变量，避免覆盖系统环境变量
            if key not in os.environ:
                os.environ[key] = val


# 加载 .env 文件
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"
_load_env_file(_env_path)


class Settings:
    # 阿里云通义千问
    QWEN_API_KEY: str = os.environ.get("QWEN_API_KEY", "")
    QWEN_BASE_URL: str = os.environ.get("QWEN_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
    QWEN_MODEL: str = os.environ.get("QWEN_MODEL", "qwen-plus")

    # MySQL 数据库
    MYSQL_HOST: str = os.environ.get("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.environ.get("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.environ.get("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.environ.get("MYSQL_PASSWORD", "")
    MYSQL_DATABASE: str = os.environ.get("MYSQL_DATABASE", "ai_resume")

    # Qdrant 向量数据库
    QDRANT_URL: str = os.environ.get("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.environ.get("QDRANT_API_KEY", "")
    QDRANT_COLLECTION_RESUME: str = os.environ.get("QDRANT_COLLECTION_RESUME", "resume_vectors")
    QDRANT_COLLECTION_SKILLS: str = os.environ.get("QDRANT_COLLECTION_SKILLS", "skill_vectors")
    QDRANT_COLLECTION_JD: str = os.environ.get("QDRANT_COLLECTION_JD", "jd_vectors")

    # JWT
    JWT_SECRET: str = os.environ.get("JWT_SECRET", "ai-resume-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.environ.get("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_HOURS: int = int(os.environ.get("JWT_EXPIRE_HOURS", "72"))

    # 文档导出
    EXPORT_DIR: str = os.environ.get("EXPORT_DIR", "./exports")

    # 应用
    APP_HOST: str = os.environ.get("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.environ.get("APP_PORT", "8000"))
    CORS_ORIGINS: str = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
