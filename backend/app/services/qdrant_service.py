"""Qdrant 向量数据库服务 - RAG 检索增强生成

支持降级模式：当 sentence-transformers 或 Qdrant 不可用时，
使用简易哈希向量替代，确保后端可正常启动。
"""

import hashlib
import logging
import struct
from typing import List, Dict, Any, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# 默认向量维度
VECTOR_DIMENSION = 384  # all-MiniLM-L6-v2

# 降级模式标记
_qdrant_available = True
_embedding_available = True


def _simple_hash_vector(text: str, dim: int = VECTOR_DIMENSION) -> List[float]:
    """简易哈希向量 - 降级模式下使用，保持向量维度一致但语义质量降低"""
    result = []
    for i in range(dim):
        h = hashlib.md5(f"{text}_{i}".encode()).digest()
        val = struct.unpack("f", h[:4])[0]
        result.append(val)
    # 归一化
    norm = sum(x * x for x in result) ** 0.5
    if norm > 0:
        result = [x / norm for x in result]
    return result


class QdrantService:
    """Qdrant 向量数据库服务封装（支持降级模式）"""

    def __init__(self):
        self._client = None
        self._embedding_model = None
        self._use_fallback = False

    @property
    def client(self):
        global _qdrant_available
        if not _qdrant_available:
            return None
        if self._client is None:
            try:
                from qdrant_client import QdrantClient
                kwargs = {"url": settings.QDRANT_URL}
                if settings.QDRANT_API_KEY:
                    kwargs["api_key"] = settings.QDRANT_API_KEY
                self._client = QdrantClient(**kwargs)
            except Exception as e:
                logger.warning(f"Qdrant 客户端初始化失败，将使用降级模式: {e}")
                _qdrant_available = False
                self._use_fallback = True
                return None
        return self._client

    def _get_embedding_model(self):
        global _embedding_available
        if not _embedding_available:
            return None
        if self._embedding_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
                logger.info("Embedding 模型加载成功: all-MiniLM-L6-v2")
            except ImportError:
                logger.warning(
                    "sentence-transformers 未安装，将使用简易哈希向量（降级模式）。"
                    "安装方式: pip install sentence-transformers"
                )
                _embedding_available = False
                self._use_fallback = True
                return None
            except Exception as e:
                logger.warning(f"Embedding 模型加载失败，将使用降级模式: {e}")
                _embedding_available = False
                self._use_fallback = True
                return None
        return self._embedding_model

    def embed_text(self, text: str) -> List[float]:
        """将文本向量化"""
        model = self._get_embedding_model()
        if model:
            return model.encode(text).tolist()
        return _simple_hash_vector(text)

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """批量文本向量化"""
        model = self._get_embedding_model()
        if model:
            return model.encode(texts).tolist()
        return [_simple_hash_vector(t) for t in texts]

    # ==================== 集合管理 ====================

    def _ensure_collection(self, collection_name: str, dimension: int = VECTOR_DIMENSION):
        """确保集合存在"""
        c = self.client
        if c is None:
            return
        try:
            from qdrant_client.models import Distance, VectorParams
            try:
                c.get_collection(collection_name)
            except Exception:
                c.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=dimension, distance=Distance.COSINE),
                )
                logger.info(f"创建 Qdrant 集合: {collection_name}")
        except Exception as e:
            logger.warning(f"Qdrant 集合操作失败: {e}")

    def init_collections(self):
        """初始化所有业务集合"""
        if self.client is None:
            logger.warning("Qdrant 不可用，跳过集合初始化")
            return
        for col in [
            settings.QDRANT_COLLECTION_RESUME,
            settings.QDRANT_COLLECTION_SKILLS,
            settings.QDRANT_COLLECTION_JD,
        ]:
            self._ensure_collection(col)
        if not self._use_fallback:
            logger.info("Qdrant 集合初始化完成")

    # ==================== 简历经历向量 ====================

    def store_resume_vector(
        self, user_id: str, section_id: str, text: str, metadata: Dict[str, Any] = None
    ):
        """存储简历经历片段向量"""
        c = self.client
        if c is None:
            return
        try:
            from qdrant_client.models import PointStruct
            self._ensure_collection(settings.QDRANT_COLLECTION_RESUME)
            vector = self.embed_text(text)
            point_id = hash(f"{user_id}_{section_id}") % (2**63)
            c.upsert(
                collection_name=settings.QDRANT_COLLECTION_RESUME,
                points=[
                    PointStruct(
                        id=point_id,
                        vector=vector,
                        payload={"user_id": user_id, "section_id": section_id, "text": text, **(metadata or {})},
                    )
                ],
            )
        except Exception as e:
            logger.warning(f"存储简历向量失败: {e}")

    def search_similar_experiences(
        self, query_text: str, limit: int = 5, user_id: str = None
    ) -> List[Dict[str, Any]]:
        """检索相似简历经历"""
        c = self.client
        if c is None:
            return []
        try:
            from qdrant_client.models import Filter, FieldCondition, MatchValue
            self._ensure_collection(settings.QDRANT_COLLECTION_RESUME)
            query_vector = self.embed_text(query_text)
            search_filter = None
            if user_id:
                search_filter = Filter(must=[FieldCondition(key="user_id", match=MatchValue(value=user_id))])
            results = c.search(
                collection_name=settings.QDRANT_COLLECTION_RESUME,
                query_vector=query_vector,
                limit=limit,
                query_filter=search_filter,
            )
            return [{"text": r.payload.get("text", ""), "score": r.score, **r.payload} for r in results]
        except Exception as e:
            logger.warning(f"检索简历向量失败: {e}")
            return []

    # ==================== 技能图谱向量 ====================

    def store_skill_vector(self, skill_name: str, category: str, description: str = ""):
        """存储技能向量"""
        c = self.client
        if c is None:
            return
        try:
            from qdrant_client.models import PointStruct
            self._ensure_collection(settings.QDRANT_COLLECTION_SKILLS)
            text_to_embed = f"{skill_name} {category} {description}"
            vector = self.embed_text(text_to_embed)
            point_id = hash(skill_name) % (2**63)
            c.upsert(
                collection_name=settings.QDRANT_COLLECTION_SKILLS,
                points=[
                    PointStruct(
                        id=point_id, vector=vector,
                        payload={"skill_name": skill_name, "category": category, "description": description},
                    )
                ],
            )
        except Exception as e:
            logger.warning(f"存储技能向量失败: {e}")

    def search_similar_skills(self, query_text: str, limit: int = 15) -> List[Dict[str, Any]]:
        """检索相似技能"""
        c = self.client
        if c is None:
            return []
        try:
            self._ensure_collection(settings.QDRANT_COLLECTION_SKILLS)
            query_vector = self.embed_text(query_text)
            results = c.search(
                collection_name=settings.QDRANT_COLLECTION_SKILLS,
                query_vector=query_vector,
                limit=limit,
            )
            return [
                {"skill_name": r.payload.get("skill_name", ""), "category": r.payload.get("category", ""),
                 "description": r.payload.get("description", ""), "score": r.score}
                for r in results
            ]
        except Exception as e:
            logger.warning(f"检索技能向量失败: {e}")
            return []

    # ==================== JD 向量 ====================

    def store_jd_vector(self, jd_id: str, jd_text: str, metadata: Dict[str, Any] = None):
        """存储 JD 向量"""
        c = self.client
        if c is None:
            return
        try:
            from qdrant_client.models import PointStruct
            self._ensure_collection(settings.QDRANT_COLLECTION_JD)
            vector = self.embed_text(jd_text)
            point_id = hash(jd_id) % (2**63)
            c.upsert(
                collection_name=settings.QDRANT_COLLECTION_JD,
                points=[
                    PointStruct(id=point_id, vector=vector, payload={"jd_id": jd_id, "text": jd_text, **(metadata or {})})
                ],
            )
        except Exception as e:
            logger.warning(f"存储 JD 向量失败: {e}")

    def search_similar_jds(self, query_text: str, limit: int = 5) -> List[Dict[str, Any]]:
        """检索相似 JD"""
        c = self.client
        if c is None:
            return []
        try:
            self._ensure_collection(settings.QDRANT_COLLECTION_JD)
            query_vector = self.embed_text(query_text)
            results = c.search(collection_name=settings.QDRANT_COLLECTION_JD, query_vector=query_vector, limit=limit)
            return [{"text": r.payload.get("text", ""), "score": r.score} for r in results]
        except Exception as e:
            logger.warning(f"检索 JD 向量失败: {e}")
            return []

    # ==================== JD 与简历匹配 ====================

    def compute_jd_resume_match(self, jd_text: str, resume_texts: List[str]) -> Dict[str, Any]:
        """计算 JD 与简历各经历的向量匹配度"""
        if not resume_texts:
            return {"overall_similarity": 0.0, "section_scores": []}

        jd_vector = self.embed_text(jd_text)
        resume_vectors = self.embed_texts(resume_texts)

        import numpy as np
        jd_np = np.array(jd_vector)
        section_scores = []
        total_sim = 0.0

        for i, rv in enumerate(resume_vectors):
            rv_np = np.array(rv)
            sim = float(np.dot(jd_np, rv_np) / (np.linalg.norm(jd_np) * np.linalg.norm(rv_np) + 1e-8))
            section_scores.append({"index": i, "similarity": sim, "text": resume_texts[i][:100]})
            total_sim += sim

        overall = total_sim / len(resume_vectors) if resume_vectors else 0.0
        return {"overall_similarity": overall, "section_scores": section_scores}


# 全局单例
qdrant_service = QdrantService()
