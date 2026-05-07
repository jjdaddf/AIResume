"""测试技能推荐接口完整流程"""
import json
import traceback
import sys
sys.path.insert(0, '.')

from app.services.qwen_service import qwen_service

async def test():
    try:
        result = await qwen_service.recommend_skills(
            job_title="前端开发工程师",
            current_skills=[],
        )
        print("=== SUCCESS ===")
        print(json.dumps(result, ensure_ascii=False, indent=2)[:1000])
    except Exception as e:
        print("=== ERROR ===")
        traceback.print_exc()

import asyncio
asyncio.run(test())
