<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { useAuthStore } from '@/stores/auth'
import { aiApi, type ParseDocxResponse } from '@/api'

const router = useRouter()
const store = useResumeStore()
const authStore = useAuthStore()

// 状态
const step = ref<'upload' | 'parsing' | 'preview' | 'saving'>('upload')
const file = ref<File | null>(null)
const parseResult = ref<ParseDocxResponse | null>(null)
const errorMsg = ref('')
const isDragging = ref(false)

// 上传区域点击触发
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    file.value = input.files[0]
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    file.value = e.dataTransfer.files[0]
  }
}

function removeFile() {
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// 解析文档
async function parseDocument() {
  if (!file.value) return

  step.value = 'parsing'
  errorMsg.value = ''

  try {
    const res = await aiApi.parseDocx(file.value)
    parseResult.value = res.data
    step.value = 'preview'
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'AI 解析失败，请重试'
    step.value = 'upload'
  }
}

// 保存到简历
async function saveToResume() {
  if (!parseResult.value) return

  step.value = 'saving'

  try {
    // 加载解析结果到 store
    store.loadFromData({
      personal_info: parseResult.value.personal_info,
      sections: parseResult.value.sections,
      theme: store.theme,
      layout: store.layout,
    })

    // 如果已登录，保存到服务器
    if (authStore.isLoggedIn) {
      await store.saveToServer(parseResult.value.personal_info.name || '导入的简历')
    } else {
      store.saveDraft()
    }

    // 跳转到编辑器
    router.push('/')
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || '保存失败'
    step.value = 'preview'
  }
}

// 重新上传
function resetAll() {
  file.value = null
  parseResult.value = null
  errorMsg.value = ''
  step.value = 'upload'
  if (fileInput.value) fileInput.value.value = ''
}

// 计算解析出的 section 数量
const sectionCount = computed(() => parseResult.value?.sections.length || 0)
const personalInfo = computed(() => parseResult.value?.personal_info)
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          <span class="mr-2">📄</span>Word 简历导入
        </h1>
        <p class="mt-2 text-sm text-gray-500">上传 Word 文档，AI 自动识别内容并转化为可编辑的在线简历</p>
      </div>

      <!-- 步骤条 -->
      <div class="flex items-center justify-center mb-8 gap-2">
        <div
          v-for="(s, i) in ['上传文件', 'AI 识别', '预览确认']"
          :key="i"
          class="flex items-center"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
            :class="{
              'bg-primary-600 text-white': (i === 0 && step === 'upload') || (i === 1 && step === 'parsing') || (i === 2 && (step === 'preview' || step === 'saving')),
              'bg-green-500 text-white': (i === 0 && ['parsing', 'preview', 'saving'].includes(step)) || (i === 1 && ['preview', 'saving'].includes(step)),
              'bg-gray-200 text-gray-500': (i === 0 && step !== 'upload' && !['parsing', 'preview', 'saving'].includes(step)) || false,
            }"
          >
            <svg v-if="(i === 0 && ['parsing', 'preview', 'saving'].includes(step)) || (i === 1 && ['preview', 'saving'].includes(step))" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="ml-2 text-sm font-medium" :class="step === 'upload' && i === 0 || step === 'parsing' && i === 1 || (step === 'preview' || step === 'saving') && i === 2 ? 'text-primary-700' : 'text-gray-400'">{{ s }}</span>
          <div v-if="i < 2" class="w-12 h-0.5 mx-3" :class="i === 0 && ['parsing', 'preview', 'saving'].includes(step) ? 'bg-green-400' : 'bg-gray-200'"></div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="text-sm text-red-700">{{ errorMsg }}</span>
      </div>

      <!-- Step 1: 上传文件 -->
      <div v-if="step === 'upload'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <!-- 拖拽上传区域 -->
        <div
          @click="triggerFileInput"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          class="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
          :class="isDragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'"
        >
          <input ref="fileInput" type="file" accept=".docx,.doc" class="hidden" @change="onFileSelected" />
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <p class="text-lg font-medium text-gray-700 mb-1">拖拽文件到此处，或点击选择文件</p>
            <p class="text-sm text-gray-400">支持 .docx / .doc 格式，最大 10MB</p>
          </div>
        </div>

        <!-- 已选文件 -->
        <div v-if="file" class="mt-6 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">{{ file.name }}</p>
              <p class="text-xs text-gray-400">{{ (file.size / 1024).toFixed(1) }} KB</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="removeFile" class="text-gray-400 hover:text-red-500 transition p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- 开始识别按钮 -->
        <div v-if="file" class="mt-6 flex justify-end">
          <button
            @click="parseDocument"
            class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            AI 识别并转换
          </button>
        </div>
      </div>

      <!-- Step 2: AI 解析中 -->
      <div v-else-if="step === 'parsing'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-6 animate-pulse">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">AI 正在识别文档内容</h3>
          <p class="text-sm text-gray-500">正在提取个人信息、工作经历、教育背景等内容...</p>
          <p class="text-xs text-gray-400 mt-3">首次解析可能需要 10-30 秒</p>
        </div>
      </div>

      <!-- Step 3: 预览确认 -->
      <div v-else-if="step === 'preview' || step === 'saving'" class="space-y-6">
        <!-- 识别结果统计 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">识别结果</h3>
            <div class="flex gap-2">
              <button @click="resetAll" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
                重新上传
              </button>
              <button
                @click="saveToResume"
                :disabled="step === 'saving'"
                class="px-5 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="step === 'saving'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ step === 'saving' ? '保存中...' : '保存到我的简历' }}
              </button>
            </div>
          </div>

          <!-- 统计卡片 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-blue-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ personalInfo?.name || '-' }}</div>
              <div class="text-xs text-blue-500 mt-1">姓名</div>
            </div>
            <div class="bg-green-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-green-600">{{ sectionCount }}</div>
              <div class="text-xs text-green-500 mt-1">识别栏位</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ parseResult?.sections.filter(s => s.type === 'work').length || 0 }}</div>
              <div class="text-xs text-purple-500 mt-1">工作经历</div>
            </div>
            <div class="bg-orange-50 rounded-lg p-3 text-center">
              <div class="text-2xl font-bold text-orange-600">{{ parseResult?.sections.filter(s => s.type === 'education').length || 0 }}</div>
              <div class="text-xs text-orange-500 mt-1">教育背景</div>
            </div>
          </div>
        </div>

        <!-- 个人信息卡片 -->
        <div v-if="personalInfo" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs">👤</span>
            个人信息
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-if="personalInfo.name" class="bg-gray-50 rounded-lg px-3 py-2">
              <div class="text-xs text-gray-400">姓名</div>
              <div class="text-sm font-medium text-gray-800">{{ personalInfo.name }}</div>
            </div>
            <div v-if="personalInfo.phone" class="bg-gray-50 rounded-lg px-3 py-2">
              <div class="text-xs text-gray-400">电话</div>
              <div class="text-sm font-medium text-gray-800">{{ personalInfo.phone }}</div>
            </div>
            <div v-if="personalInfo.email" class="bg-gray-50 rounded-lg px-3 py-2">
              <div class="text-xs text-gray-400">邮箱</div>
              <div class="text-sm font-medium text-gray-800">{{ personalInfo.email }}</div>
            </div>
            <div v-if="personalInfo.location" class="bg-gray-50 rounded-lg px-3 py-2">
              <div class="text-xs text-gray-400">地址</div>
              <div class="text-sm font-medium text-gray-800">{{ personalInfo.location }}</div>
            </div>
            <div v-if="personalInfo.github" class="bg-gray-50 rounded-lg px-3 py-2">
              <div class="text-xs text-gray-400">GitHub</div>
              <div class="text-sm font-medium text-gray-800">{{ personalInfo.github }}</div>
            </div>
            <div v-if="personalInfo.summary" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2 md:col-span-3">
              <div class="text-xs text-gray-400">个人简介</div>
              <div class="text-sm text-gray-800">{{ personalInfo.summary }}</div>
            </div>
          </div>
        </div>

        <!-- 各栏位详情 -->
        <div v-for="section in parseResult?.sections" :key="section.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              :class="{
                'bg-blue-100 text-blue-600': section.type === 'education',
                'bg-green-100 text-green-600': section.type === 'work',
                'bg-purple-100 text-purple-600': section.type === 'project',
                'bg-orange-100 text-orange-600': section.type === 'skill',
                'bg-gray-100 text-gray-600': section.type === 'custom',
              }"
            >
              {{ section.type === 'education' ? '🎓' : section.type === 'work' ? '💼' : section.type === 'project' ? '🚀' : section.type === 'skill' ? '⚡' : '📝' }}
            </span>
            {{ section.title }}
            <span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ section.type }}</span>
          </h4>

          <div class="grid grid-cols-2 gap-3">
            <template v-if="section.type === 'education' && section.data">
              <div v-if="section.data.school" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">学校</div>
                <div class="text-sm font-medium text-gray-800">{{ section.data.school }}</div>
              </div>
              <div v-if="section.data.major" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">专业</div>
                <div class="text-sm text-gray-800">{{ section.data.major }}</div>
              </div>
              <div v-if="section.data.degree" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">学位</div>
                <div class="text-sm text-gray-800">{{ section.data.degree }}</div>
              </div>
              <div v-if="section.data.start_date || section.data.end_date" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">时间</div>
                <div class="text-sm text-gray-800">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</div>
              </div>
            </template>

            <template v-else-if="section.type === 'work' && section.data">
              <div v-if="section.data.company" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">公司</div>
                <div class="text-sm font-medium text-gray-800">{{ section.data.company }}</div>
              </div>
              <div v-if="section.data.position" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">职位</div>
                <div class="text-sm text-gray-800">{{ section.data.position }}</div>
              </div>
              <div v-if="section.data.start_date || section.data.end_date" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">时间</div>
                <div class="text-sm text-gray-800">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</div>
              </div>
              <div v-if="section.data.description" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <div class="text-xs text-gray-400">工作描述</div>
                <div class="text-sm text-gray-800">{{ section.data.description }}</div>
              </div>
              <div v-if="section.data.achievements?.length" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <div class="text-xs text-gray-400">工作成果</div>
                <ul class="text-sm text-gray-800 mt-1 space-y-1">
                  <li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5">
                    <span class="text-green-500 mt-0.5">✓</span>{{ a }}
                  </li>
                </ul>
              </div>
            </template>

            <template v-else-if="section.type === 'project' && section.data">
              <div v-if="section.data.name" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">项目名</div>
                <div class="text-sm font-medium text-gray-800">{{ section.data.name }}</div>
              </div>
              <div v-if="section.data.role" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">角色</div>
                <div class="text-sm text-gray-800">{{ section.data.role }}</div>
              </div>
              <div v-if="section.data.description" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <div class="text-xs text-gray-400">项目描述</div>
                <div class="text-sm text-gray-800">{{ section.data.description }}</div>
              </div>
              <div v-if="section.data.tech_stack?.length" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <div class="text-xs text-gray-400">技术栈</div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="t in section.data.tech_stack" :key="t" class="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{{ t }}</span>
                </div>
              </div>
            </template>

            <template v-else-if="section.type === 'skill' && section.data">
              <div v-if="section.data.category" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">分类</div>
                <div class="text-sm text-gray-800">{{ section.data.category }}</div>
              </div>
              <div v-if="section.data.skills?.length" class="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <div class="text-xs text-gray-400">技能</div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="s in section.data.skills" :key="s" class="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">{{ s }}</span>
                </div>
              </div>
            </template>

            <!-- 通用 fallback -->
            <template v-else-if="section.data">
              <div v-for="(val, key) in section.data" :key="key" class="bg-gray-50 rounded-lg px-3 py-2">
                <div class="text-xs text-gray-400">{{ key }}</div>
                <div class="text-sm text-gray-800">{{ Array.isArray(val) ? val.join(', ') : val }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- 原始文本折叠 -->
        <div v-if="parseResult?.raw_text" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <details class="px-6 py-4">
            <summary class="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">查看原始提取文本</summary>
            <pre class="mt-3 text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">{{ parseResult.raw_text }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>
