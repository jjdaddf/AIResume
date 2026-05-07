"""直接用 curl 测试接口"""
import json
import subprocess
result = subprocess.run(
    ['d:\\projects\\AIResume\\backend\\venv\\Scripts\\python.exe', '-c', '''
import json, traceback, sys, asyncio
sys.path.insert(0, ".")
from app.services.qwen_service import qwen_service

async def test():
    try:
        result = await qwen_service.recommend_skills("前端开发工程师", [])
        print("OK:", json.dumps(result, ensure_ascii=False)[:500])
    except Exception as e:
        traceback.print_exc()

asyncio.run(test())
'''],
    capture_output=True, text=True, timeout=60, cwd='d:\\projects\\AIResume\\backend'
)
print("STDOUT:", result.stdout[:1000])
print("STDERR:", result.stderr[:1000])
print("RETURNCODE:", result.returncode)
