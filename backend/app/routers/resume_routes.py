"""
简历路由：创建 / 列表 / 读取 / 更新 / 删除
"""

import uuid
import json
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from app.core.database import (
    create_resume, get_resumes_by_user, get_resume_by_id,
    update_resume, delete_resume,
)
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/resumes", tags=["简历"])


# ==================== Schemas ====================

class ResumeCreate(BaseModel):
    title: str = Field(default="未命名简历", max_length=100)
    resume_data: dict
    theme: Optional[str] = "minimal"


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    resume_data: Optional[dict] = None
    theme: Optional[str] = None


class ResumeListItem(BaseModel):
    id: str
    title: str
    theme: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ResumeDetail(BaseModel):
    id: str
    title: str
    theme: str
    resume_data: dict
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ==================== 路由 ====================

@router.post("", response_model=ResumeDetail)
def create(body: ResumeCreate, user: dict = Depends(get_current_user)):
    """创建简历"""
    resume_id = str(uuid.uuid4())
    row = create_resume(resume_id, user["id"], body.title, body.resume_data, body.theme or "minimal")
    if row and isinstance(row.get("resume_data"), str):
        row["resume_data"] = json.loads(row["resume_data"])
    return ResumeDetail(
        id=row["id"],
        title=row["title"],
        theme=row.get("theme", "minimal"),
        resume_data=row["resume_data"],
        created_at=str(row.get("created_at", "")),
        updated_at=str(row.get("updated_at", "")),
    )


@router.get("", response_model=List[ResumeListItem])
def list_resumes(user: dict = Depends(get_current_user)):
    """获取用户简历列表"""
    rows = get_resumes_by_user(user["id"])
    return [
        ResumeListItem(
            id=r["id"],
            title=r["title"],
            theme=r.get("theme", "minimal"),
            created_at=str(r.get("created_at", "")),
            updated_at=str(r.get("updated_at", "")),
        )
        for r in rows
    ]


@router.get("/{resume_id}", response_model=ResumeDetail)
def get_resume(resume_id: str, user: dict = Depends(get_current_user)):
    """获取单个简历详情"""
    row = get_resume_by_id(resume_id)
    if not row:
        raise HTTPException(status_code=404, detail="简历不存在")
    if row["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="无权访问")
    if isinstance(row.get("resume_data"), str):
        row["resume_data"] = json.loads(row["resume_data"])
    return ResumeDetail(
        id=row["id"],
        title=row["title"],
        theme=row.get("theme", "minimal"),
        resume_data=row["resume_data"],
        created_at=str(row.get("created_at", "")),
        updated_at=str(row.get("updated_at", "")),
    )


@router.put("/{resume_id}", response_model=ResumeDetail)
def update(resume_id: str, body: ResumeUpdate, user: dict = Depends(get_current_user)):
    """更新简历"""
    existing = get_resume_by_id(resume_id)
    if not existing:
        raise HTTPException(status_code=404, detail="简历不存在")
    if existing["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="无权访问")
    row = update_resume(resume_id, body.title, body.resume_data, body.theme)
    if row and isinstance(row.get("resume_data"), str):
        row["resume_data"] = json.loads(row["resume_data"])
    return ResumeDetail(
        id=row["id"],
        title=row["title"],
        theme=row.get("theme", "minimal"),
        resume_data=row["resume_data"],
        created_at=str(row.get("created_at", "")),
        updated_at=str(row.get("updated_at", "")),
    )


@router.delete("/{resume_id}")
def remove(resume_id: str, user: dict = Depends(get_current_user)):
    """删除简历"""
    existing = get_resume_by_id(resume_id)
    if not existing:
        raise HTTPException(status_code=404, detail="简历不存在")
    if existing["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="无权访问")
    delete_resume(resume_id)
    return {"message": "删除成功"}
