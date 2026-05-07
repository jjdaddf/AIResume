<script setup lang="ts">
import { ref, computed } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { aiApi } from '@/api'
import type {
  PolishResponse,
  JDMatchResponse,
  SkillRecommendResponse,
  InterviewResponse,
} from '@/api'

const store = useResumeStore()

// ==================== AI 润色 ====================

const polishText = ref('')
const polishType = ref('work')
const polishing = ref(false)
const polishResult = ref<PolishResponse | null>(null)

async function doPolish() {
  if (!polishText.value.trim()) return
  polishing.value = true
  polishResult.value = null
  try {
    const res = await aiApi.polish({
      text: polishText.value,
      section_type: polishType.value,
    })
    polishResult.value = res.data
  } catch (e: any) {
    alert('润色失败: ' + (e.response?.data?.detail || e.message))
  } finally {
    polishing.value = false
  }
}

function applyPolishedText() {
  if (!polishResult.value || !store.activeSection) return
  store.updateSectionData(store.activeSection.id, {
    description: polishResult.value.polished_text,
  })
}

// ==================== JD 匹配 ====================

const jdText = ref('')
const jdMatching = ref(false)
const jdResult = ref<JDMatchResponse | null>(null)

async function doJdMatch() {
  if (!jdText.value.trim()) return
  jdMatching.value = true
  jdResult.value = null
  try {
    const res = await aiApi.matchJd({
      jd_text: jdText.value,
      resume_data: store.getResumeData(),
    })
    jdResult.value = res.data
  } catch (e: any) {
    alert('匹配失败: ' + (e.response?.data?.detail || e.message))
  } finally {
    jdMatching.value = false
  }
}

// ==================== 技能推荐 ====================

const jobTitle = ref('')
const skillRecommending = ref(false)
const skillResult = ref<SkillRecommendResponse | null>(null)

async function doSkillRecommend() {
  if (!jobTitle.value.trim()) return
  skillRecommending.value = true
  skillResult.value = null
  try {
    const res = await aiApi.recommendSkills({
      job_title: jobTitle.value,
      current_skills: store.allSkills,
    })
    skillResult.value = res.data
  } catch (e: any) {
    alert('推荐失败: ' + (e.response?.data?.detail || e.message))
  } finally {
    skillRecommending.value = false
  }
}

function addSkill(skillName: string) {
  const skillSection = store.sections.find((s) => s.type === 'skill')
  if (skillSection) {
    const data = { ...skillSection.data }
    if (!data.skills.includes(skillName)) {
      data.skills = [...data.skills, skillName]
      store.updateSectionData(skillSection.id, data)
    }
  }
}

// ==================== 模拟面试 ====================

const interviewJd = ref('')
const interviewGenerating = ref(false)
const interviewResult = ref<InterviewResponse | null>(null)

async function doInterview() {
  interviewGenerating.value = true
  interviewResult.value = null
  try {
    const res = await aiApi.generateInterview({
      resume_data: store.getResumeData(),
      jd_text: interviewJd.value || undefined,
      num_questions: 5,
    })
    interviewResult.value = res.data
  } catch (e: any) {
    alert('生成失败: ' + (e.response?.data?.detail || e.message))
  } finally {
    interviewGenerating.value = false
  }
}

// ==================== Tab 控制 ====================

const activeTab = ref<'polish' | 'jd' | 'skill' | 'interview'>('polish')

const tabs = [
  { key: 'polish' as const, label: '润色扩写', icon: '✨' },
  { key: 'jd' as const, label: 'JD 匹配', icon: '🎯' },
  { key: 'skill' as const, label: '技能推荐', icon: '💡' },
  { key: 'interview' as const, label: '模拟面试', icon: '🎤' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">AI 智能助手</h2>

    <!-- Tab 导航 -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
        :class="[
          activeTab === tab.key
            ? 'bg-white shadow-sm text-primary-700'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        <span class="mr-1">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- 润色扩写 -->
    <div v-if="activeTab === 'polish'" class="card">
      <h3 class="text-base font-semibold text-gray-800 mb-4">简历经历润色 (STAR 法则)</h3>
      <p class="text-sm text-gray-500 mb-4">输入简短的大白话经历描述，AI 将帮你重写为专业表述。</p>

      <div class="mb-3">
        <label class="label-text">经历类型</label>
        <select v-model="polishType" class="input-field">
          <option value="work">工作经历</option>
          <option value="project">项目经验</option>
          <option value="education">教育背景</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="label-text">原始描述</label>
        <textarea
          v-model="polishText"
          class="input-field min-h-[100px]"
          placeholder="例如：做了一个后台管理系统，用了 Vue 和 Python..."
        ></textarea>
      </div>

      <button @click="doPolish()" class="btn-primary" :disabled="polishing || !polishText.trim()">
        {{ polishing ? 'AI 思考中...' : '开始润色' }}
      </button>

      <!-- 润色结果 -->
      <div v-if="polishResult" class="mt-6 space-y-4">
        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 class="text-sm font-semibold text-green-800 mb-2">润色结果</h4>
          <p class="text-sm text-green-900 whitespace-pre-wrap">{{ polishResult.polished_text }}</p>
          <button @click="applyPolishedText()" class="mt-3 btn-accent text-xs">
            应用到当前编辑栏位
          </button>
        </div>

        <div v-if="polishResult.star_breakdown" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="text-sm font-semibold text-blue-800 mb-2">STAR 法则拆解</h4>
          <div class="space-y-2 text-sm">
            <div v-if="polishResult.star_breakdown.situation">
              <span class="font-medium text-blue-700">情境 (S):</span>
              {{ polishResult.star_breakdown.situation }}
            </div>
            <div v-if="polishResult.star_breakdown.task">
              <span class="font-medium text-blue-700">任务 (T):</span>
              {{ polishResult.star_breakdown.task }}
            </div>
            <div v-if="polishResult.star_breakdown.action">
              <span class="font-medium text-blue-700">行动 (A):</span>
              {{ polishResult.star_breakdown.action }}
            </div>
            <div v-if="polishResult.star_breakdown.result">
              <span class="font-medium text-blue-700">结果 (R):</span>
              {{ polishResult.star_breakdown.result }}
            </div>
          </div>
        </div>

        <div v-if="polishResult.suggestions?.length" class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 class="text-sm font-semibold text-amber-800 mb-2">改进建议</h4>
          <ul class="list-disc list-inside text-sm text-amber-900 space-y-1">
            <li v-for="(s, i) in polishResult.suggestions" :key="i">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- JD 匹配 -->
    <div v-if="activeTab === 'jd'" class="card">
      <h3 class="text-base font-semibold text-gray-800 mb-4">岗位精准匹配 (RAG)</h3>
      <p class="text-sm text-gray-500 mb-4">粘贴目标岗位 JD，AI 将分析匹配度并提示缺失技能。</p>

      <div class="mb-4">
        <label class="label-text">目标岗位 JD</label>
        <textarea
          v-model="jdText"
          class="input-field min-h-[150px]"
          placeholder="粘贴完整的岗位描述..."
        ></textarea>
      </div>

      <button @click="doJdMatch()" class="btn-primary" :disabled="jdMatching || !jdText.trim()">
        {{ jdMatching ? 'AI 分析中...' : '开始匹配' }}
      </button>

      <!-- 匹配结果 -->
      <div v-if="jdResult" class="mt-6 space-y-4">
        <div class="flex items-center gap-4">
          <div class="text-center">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
              :class="[
                jdResult.overall_score >= 80 ? 'bg-green-100 text-green-700' :
                jdResult.overall_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              ]"
            >
              {{ jdResult.overall_score }}
            </div>
            <span class="text-xs text-gray-500 mt-1">匹配度</span>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-600">
              {{ jdResult.overall_score >= 80 ? '匹配度很高，简历与岗位高度契合！' :
                 jdResult.overall_score >= 60 ? '匹配度中等，建议补充缺失技能。' :
                 '匹配度偏低，建议重点优化简历内容。' }}
            </p>
          </div>
        </div>

        <div v-if="jdResult.matched_skills?.length" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 class="text-sm font-semibold text-green-800 mb-2">已匹配技能</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in jdResult.matched_skills"
              :key="skill.skill_name"
              class="text-xs px-2 py-1 rounded-full"
              :class="[
                skill.match_type === 'matched' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              ]"
            >
              {{ skill.skill_name }}
              <span class="ml-1 opacity-60">{{ (skill.relevance_score * 100).toFixed(0) }}%</span>
            </span>
          </div>
        </div>

        <div v-if="jdResult.missing_skills?.length" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="text-sm font-semibold text-red-800 mb-2">缺失技能</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in jdResult.missing_skills"
              :key="skill"
              class="text-xs px-2 py-1 rounded-full bg-red-200 text-red-800"
            >
              {{ skill }}
              <button @click="addSkill(skill)" class="ml-1 underline hover:no-underline">+添加</button>
            </span>
          </div>
        </div>

        <div v-if="jdResult.suggestions?.length" class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 class="text-sm font-semibold text-amber-800 mb-2">优化建议</h4>
          <ul class="list-disc list-inside text-sm text-amber-900 space-y-1">
            <li v-for="(s, i) in jdResult.suggestions" :key="i">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 技能推荐 -->
    <div v-if="activeTab === 'skill'" class="card">
      <h3 class="text-base font-semibold text-gray-800 mb-4">智能技能图谱推荐</h3>
      <p class="text-sm text-gray-500 mb-4">输入你的职位，AI 将推荐该岗位的高频技能词汇。</p>

      <div class="mb-4">
        <label class="label-text">当前职位</label>
        <input
          v-model="jobTitle"
          class="input-field"
          placeholder="例如：前端开发工程师"
        />
      </div>

      <button @click="doSkillRecommend()" class="btn-primary" :disabled="skillRecommending || !jobTitle.trim()">
        {{ skillRecommending ? 'AI 推荐中...' : '获取推荐' }}
      </button>

      <!-- 推荐结果 -->
      <div v-if="skillResult" class="mt-6">
        <div
          v-for="skill in skillResult.recommended_skills"
          :key="skill.name"
          class="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-center gap-2">
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700"
            >{{ skill.category }}</span>
            <span class="text-sm font-medium text-gray-800">{{ skill.name }}</span>
            <span v-if="skill.description" class="text-xs text-gray-500">{{ skill.description }}</span>
          </div>
          <button @click="addSkill(skill.name)" class="text-xs text-primary-600 hover:text-primary-800 font-medium">
            + 添加
          </button>
        </div>
      </div>
    </div>

    <!-- 模拟面试 -->
    <div v-if="activeTab === 'interview'" class="card">
      <h3 class="text-base font-semibold text-gray-800 mb-4">模拟面试题生成器</h3>
      <p class="text-sm text-gray-500 mb-4">基于你的简历和目标 JD，生成针对性面试题及答题思路。</p>

      <div class="mb-4">
        <label class="label-text">目标岗位 JD（可选）</label>
        <textarea
          v-model="interviewJd"
          class="input-field min-h-[100px]"
          placeholder="粘贴目标岗位描述，可生成更有针对性的问题..."
        ></textarea>
      </div>

      <button @click="doInterview()" class="btn-primary" :disabled="interviewGenerating">
        {{ interviewGenerating ? '生成中...' : '生成面试题' }}
      </button>

      <!-- 面试题结果 -->
      <div v-if="interviewResult" class="mt-6 space-y-4">
        <div
          v-for="(q, i) in interviewResult.questions"
          :key="i"
          class="p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
              {{ i + 1 }}
            </span>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ q.category }}</span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': q.difficulty === 'easy',
                    'bg-yellow-100 text-yellow-700': q.difficulty === 'medium',
                    'bg-red-100 text-red-700': q.difficulty === 'hard',
                  }"
                >{{ { easy: '简单', medium: '中等', hard: '困难' }[q.difficulty] || q.difficulty }}</span>
              </div>
              <p class="text-sm font-medium text-gray-800 mb-2">{{ q.question }}</p>
              <details class="text-sm text-gray-600">
                <summary class="cursor-pointer text-primary-600 hover:text-primary-800 font-medium">
                  查看答题思路
                </summary>
                <p class="mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{{ q.answer_guide }}</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
