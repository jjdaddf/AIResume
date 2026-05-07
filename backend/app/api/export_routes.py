"""文档导出路由"""

import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from app.models.schemas import ResumeData, ExportFormat

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/resume/export", tags=["导出"])


class ExportRequest(BaseModel):
    resume_data: ResumeData
    format: ExportFormat = ExportFormat.DOCX


@router.post("")
async def export_resume(body: ExportRequest):
    """导出简历文档"""
    try:
        from app.services.export_service import export_service
        data = await export_service.export(body.resume_data, body.format)
        if body.format == ExportFormat.DOCX:
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            media_type = "application/pdf"
        filename = f"resume.{body.format.value}"
        return Response(content=data, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})
    except ImportError as e:
        pkg = "xhtml2pdf" if "xhtml2pdf" in str(e) else "python-docx"
        logger.error(f"导出失败，缺少依赖包 {pkg}: {e}")
        raise HTTPException(status_code=500, detail=f"导出失败，请安装依赖包: pip install {pkg}")
    except Exception as e:
        logger.error(f"导出失败: {e}")
        raise HTTPException(status_code=500, detail=f"导出失败: {str(e)}")
