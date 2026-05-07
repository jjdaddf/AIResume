"""通义千问 AI 服务 - 核心大模型交互层"""

import json
import logging
from typing import List, Dict, Any, Optional

from openai import AsyncOpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

# ==================== Prompt 模板 ====================

POLISH_PROMPT = """将用户经历按 STAR 法则重写为专业简历表述。

要求：动词开头、量化成果、1-2句话。

经历类型：{section_type}
原始描述：{text}

返回 JSON：
{{"polished_text": "重写后的表述", "star_breakdown": {{"situation": "情境", "task": "任务", "action": "行动", "result": "结果"}}, "suggestions": ["建议1"]}}
"""

JD_MATCH_PROMPT = """分析目标岗位 JD 与简历的匹配程度。

JD：{jd_text}

简历摘要：{resume_summary}

返回 JSON：
{{"overall_score": 85, "matched_skills": [{{"skill_name": "技能", "match_type": "matched", "relevance_score": 0.9}}], "missing_skills": ["缺失技能1"], "suggestions": ["建议1"]}}
"""

SKILL_RECOMMEND_PROMPT = """根据职位名称推荐该职位最重要的专业技能。

职位：{job_title}
已有技能：{current_skills}

请返回 JSON：
{{"recommended_skills": [{{"name": "技能名", "category": "分类", "relevance": 0.8, "description": "简短说明"}}], "categories": {{"分类1": ["技能1"], "分类2": ["技能2"]}}}}
推荐 8-10 个技能，不要推荐已有技能。"""

PARSE_DOCX_PROMPT = """你是一个专业的简历信息提取助手。请从以下 Word 文档文本中提取简历信息，并按照指定 JSON 结构返回。

文档文本内容：
{docx_text}

请返回如下 JSON 结构（所有字段为字符串，如无对应信息填空字符串）：
{{
  "personal_info": {{
    "name": "姓名",
    "phone": "电话",
    "email": "邮箱",
    "location": "地址/城市",
    "website": "个人网站",
    "github": "GitHub",
    "summary": "个人简介/自我评价"
  }},
  "sections": [
    {{
      "type": "education",
      "title": "教育背景",
      "data": {{
        "school": "学校名",
        "degree": "学位(本科/硕士/博士)",
        "major": "专业",
        "start_date": "开始日期",
        "end_date": "结束日期",
        "gpa": "GPA",
        "highlights": ["亮点1"]
      }}
    }},
    {{
      "type": "work",
      "title": "工作经历",
      "data": {{
        "company": "公司名",
        "position": "职位",
        "start_date": "开始日期",
        "end_date": "结束日期",
        "description": "工作描述",
        "achievements": ["成果1"]
      }}
    }},
    {{
      "type": "project",
      "title": "项目经验",
      "data": {{
        "name": "项目名",
        "role": "角色",
        "start_date": "开始日期",
        "end_date": "结束日期",
        "description": "项目描述",
        "tech_stack": ["技术1"],
        "achievements": ["成果1"]
      }}
    }},
    {{
      "type": "skill",
      "title": "技能清单",
      "data": {{
        "category": "技能分类",
        "skills": ["技能1", "技能2"]
      }}
    }}
  ]
}}

注意：
1. 如果有多段工作/教育/项目经历，请在 sections 数组中添加多个对应类型的条目
2. 技能部分可以合并为一个 skill 类型条目，skills 数组包含所有技能
3. 日期格式尽量统一为 YYYY.MM 或 YYYY 格式
4. 只返回 JSON，不要添加任何其他文字"""

INTERVIEW_PROMPT = """根据简历和目标 JD 生成面试题。

简历摘要：{resume_summary}
目标 JD：{jd_text}

生成 {num_questions} 道题，返回 JSON：
{{"questions": [{{"question": "面试问题", "category": "技术/行为/案例/情景", "answer_guide": "答题思路", "difficulty": "medium"}}]}}
"""


class QwenService:
    """通义千问服务封装"""

    def __init__(self):
        self._client: Optional[AsyncOpenAI] = None

    @property
    def client(self) -> AsyncOpenAI:
        if self._client is None:
            self._client = AsyncOpenAI(
                api_key=settings.QWEN_API_KEY,
                base_url=settings.QWEN_BASE_URL,
                timeout=120.0,
            )
        return self._client

    async def _chat(self, system_prompt: str, user_prompt: str) -> str:
        """调用 Qwen 对话接口"""
        try:
            response = await self.client.chat.completions.create(
                model=settings.QWEN_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Qwen API 调用失败: {e}")
            raise

    def _parse_json(self, text: str) -> Dict[str, Any]:
        """安全解析 JSON 响应"""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            logger.warning(f"JSON 解析失败，原始文本: {text[:200]}")
            return {}

    # ==================== 业务方法 ====================

    async def polish_experience(
        self, text: str, section_type: str = "work"
    ) -> Dict[str, Any]:
        """简历经历润色 - STAR 法则扩写"""
        user_prompt = POLISH_PROMPT.format(text=text, section_type=section_type)
        result = await self._chat("你是简历优化专家。", user_prompt)
        return self._parse_json(result)

    async def match_jd(
        self, jd_text: str, resume_summary: str
    ) -> Dict[str, Any]:
        """岗位 JD 匹配分析"""
        user_prompt = JD_MATCH_PROMPT.format(
            jd_text=jd_text, resume_summary=resume_summary
        )
        result = await self._chat("你是 ATS 专家和资深 HR。", user_prompt)
        return self._parse_json(result)

    async def recommend_skills(
        self, job_title: str, current_skills: List[str]
    ) -> Dict[str, Any]:
        """智能技能图谱推荐"""
        user_prompt = SKILL_RECOMMEND_PROMPT.format(
            job_title=job_title,
            current_skills=", ".join(current_skills) if current_skills else "无",
        )
        result = await self._chat("你是行业技能图谱专家。", user_prompt)
        return self._parse_json(result)

    async def parse_docx(self, docx_text: str) -> Dict[str, Any]:
        """AI 解析 Word 文档文本，提取结构化简历数据"""
        user_prompt = PARSE_DOCX_PROMPT.format(docx_text=docx_text[:8000])
        result = await self._chat("你是专业的简历信息提取助手。", user_prompt)
        return self._parse_json(result)

    async def generate_interview_questions(
        self,
        resume_summary: str,
        jd_text: Optional[str] = None,
        num_questions: int = 5,
    ) -> Dict[str, Any]:
        """模拟面试题生成"""
        user_prompt = INTERVIEW_PROMPT.format(
            resume_summary=resume_summary,
            jd_text=jd_text or "未提供目标 JD，请基于简历内容生成通用面试题",
            num_questions=num_questions,
        )
        result = await self._chat("你是资深面试官和职业教练。", user_prompt)
        return self._parse_json(result)


# 全局单例
qwen_service = QwenService()
