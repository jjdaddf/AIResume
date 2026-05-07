"""健康检查 & 工具路由"""

from fastapi import APIRouter

router = APIRouter(tags=["系统"])


@router.get("/health")
async def health_check():
    """系统健康检查"""
    return {"status": "ok", "service": "AIResume Backend"}


@router.get("/api/v1/themes")
async def list_themes():
    """获取可用简历主题列表"""
    return {
        "themes": [
            {"id": "minimal", "name": "极简", "description": "简约清爽，适合传统行业"},
            {"id": "geek", "name": "极客", "description": "技术导向，突出技术栈与项目成果"},
            {"id": "business", "name": "商务", "description": "专业正式，突出业务数据与管理能力"},
            {"id": "elegant", "name": "雅致", "description": "深棕暖调，文雅知性"},
            {"id": "forest", "name": "森林", "description": "深绿自然，沉稳内敛"},
            {"id": "lavender", "name": "薰衣草", "description": "淡紫柔美，温婉优雅"},
            {"id": "sunset", "name": "日落", "description": "暖橙活力，热情积极"},
            {"id": "midnight", "name": "午夜", "description": "深蓝宁静，沉稳专业"},
            {"id": "rose", "name": "玫瑰", "description": "粉红清新，柔和亲和"},
            {"id": "slate", "name": "石板", "description": "冷灰克制，极简理性"},
            {"id": "teal", "name": "青碧", "description": "青绿清新，稳重现代"},
            {"id": "wine", "name": "红酒", "description": "深红醇厚，典雅尊贵"},
            {"id": "ocean", "name": "海洋", "description": "蔚蓝宽广，开放包容"},
            {"id": "moss", "name": "苔藓", "description": "橄榄沉稳，低调内敛"},
            {"id": "graphite", "name": "石墨", "description": "深灰坚毅，力量感强"},
            {"id": "coral", "name": "珊瑚", "description": "珊瑚暖色，亲切活泼"},
            {"id": "indigo", "name": "靛青", "description": "靛蓝深邃，智慧沉稳"},
            {"id": "sand", "name": "沙漠", "description": "沙漠暖调，朴实务实"},
            {"id": "mist", "name": "薄雾", "description": "淡蓝轻盈，清透明快"},
            {"id": "charcoal", "name": "炭黑", "description": "深黑硬朗，极致对比"},
            {"id": "sage", "name": "鼠尾草", "description": "灰绿淡雅，柔和中性"},
            {"id": "plum", "name": "梅紫", "description": "紫梅端庄，沉稳雅致"},
            {"id": "copper", "name": "紫铜", "description": "铜金复古，成熟稳重"},
            {"id": "ice", "name": "冰川", "description": "冰蓝极简，冷静理性"},
            {"id": "maple", "name": "枫叶", "description": "枫红秋意，温暖大方"},
        ]
    }
