"""数据模型定义"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


# ==================== 通用枚举 ====================

class ExportFormat(str, Enum):
    DOCX = "docx"
    PDF = "pdf"


class ThemeStyle(str, Enum):
    MINIMAL = "minimal"
    GEEK = "geek"
    BUSINESS = "business"
    ELEGANT = "elegant"
    FOREST = "forest"
    LAVENDER = "lavender"
    SUNSET = "sunset"
    MIDNIGHT = "midnight"
    ROSE = "rose"
    SLATE = "slate"
    TEAL = "teal"
    WINE = "wine"
    OCEAN = "ocean"
    MOSS = "moss"
    GRAPHITE = "graphite"
    CORAL = "coral"
    INDIGO = "indigo"
    SAND = "sand"
    MIST = "mist"
    CHARCOAL = "charcoal"
    SAGE = "sage"
    PLUM = "plum"
    COPPER = "copper"
    ICE = "ice"
    MAPLE = "maple"
    # 侧边栏/双栏布局主题
    NAVY_SIDEBAR = "navy-sidebar"
    EMERALD_SIDEBAR = "emerald-sidebar"
    BURGUNDY_SIDEBAR = "burgundy-sidebar"
    OBSIDIAN_SIDEBAR = "obsidian-sidebar"
    VIOLET_SIDEBAR = "violet-sidebar"
    TEAL_SIDEBAR = "teal-sidebar"
    AMBER_TWOCOL = "amber-twocol"
    SLATE_TWOCOL = "slate-twocol"


# ==================== 简历数据模型 ====================

class EducationItem(BaseModel):
    school: str = ""
    degree: str = ""
    major: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: Optional[str] = None
    highlights: List[str] = []


class WorkExperienceItem(BaseModel):
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""
    achievements: List[str] = []


class ProjectItem(BaseModel):
    name: str = ""
    role: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""
    tech_stack: List[str] = []
    achievements: List[str] = []


class SkillItem(BaseModel):
    category: str = ""
    skills: List[str] = []


class ResumeSection(BaseModel):
    id: str
    type: str  # education, work, project, skill, custom
    title: str
    order: int = 0
    visible: bool = True
    data: Any = None


class LayoutConfig(BaseModel):
    margin_top: float = Field(default=20, ge=5, le=50)
    margin_bottom: float = Field(default=20, ge=5, le=50)
    margin_left: float = Field(default=20, ge=5, le=50)
    margin_right: float = Field(default=20, ge=5, le=50)
    line_height: float = Field(default=1.5, ge=1.0, le=2.5)
    letter_spacing: float = Field(default=0, ge=0, le=5)


class PersonalInfo(BaseModel):
    name: str = ""
    photo: str = ""  # base64 data URL
    phone: str = ""
    email: str = ""
    location: str = ""
    website: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: str = ""


class ResumeData(BaseModel):
    personal_info: PersonalInfo = PersonalInfo()
    sections: List[ResumeSection] = []
    theme: ThemeStyle = ThemeStyle.MINIMAL
    layout: LayoutConfig = LayoutConfig()


# ==================== AI 请求/响应模型 ====================

class AIPolishRequest(BaseModel):
    text: str = Field(..., min_length=1, description="用户原始经历文本")
    section_type: str = Field(default="work", description="经历类型: work/project/education")


class AIPolishResponse(BaseModel):
    original_text: str
    polished_text: str
    star_breakdown: Optional[Dict[str, str]] = None
    suggestions: List[str] = []


class JDMatchRequest(BaseModel):
    jd_text: str = Field(..., min_length=1, description="目标岗位 JD 文本")
    resume_data: ResumeData


class MatchResult(BaseModel):
    skill_name: str
    match_type: str  # matched, missing, partial
    relevance_score: float


class JDMatchResponse(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    matched_skills: List[MatchResult] = []
    missing_skills: List[str] = []
    suggestions: List[str] = []


class SkillRecommendRequest(BaseModel):
    job_title: str = Field(..., min_length=1)
    current_skills: List[str] = []


class SkillRecommendResponse(BaseModel):
    recommended_skills: List[Dict[str, Any]] = []
    categories: Dict[str, List[str]] = {}


class InterviewRequest(BaseModel):
    resume_data: ResumeData
    jd_text: Optional[str] = None
    num_questions: int = Field(default=5, ge=1, le=20)


class InterviewQuestion(BaseModel):
    question: str
    category: str
    answer_guide: str
    difficulty: str = "medium"


class InterviewResponse(BaseModel):
    questions: List[InterviewQuestion] = []


# ==================== Word 文档解析模型 ====================

class ParseDocxResponse(BaseModel):
    """Word 文档 AI 解析结果"""
    personal_info: PersonalInfo = PersonalInfo()
    sections: List[ResumeSection] = []
    raw_text: str = ""


# ==================== 导出请求模型 ====================

class ExportRequest(BaseModel):
    resume_data: ResumeData
    format: ExportFormat = ExportFormat.DOCX
