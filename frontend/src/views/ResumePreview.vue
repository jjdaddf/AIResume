<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { aiApi, exportApi } from '@/api'
import type { PolishResponse } from '@/api'
import html2pdf from 'html2pdf.js'
import { ref } from 'vue'

const store = useResumeStore()
const exporting = ref(false)
const polishing = ref(false)
const polishResult = ref<PolishResponse | null>(null)

const themeLabels: Record<string, string> = {
  minimal: '极简',
  geek: '极客',
  business: '商务',
}

// 导出为 PDF（前端方案）
async function exportPdfFrontend() {
  const element = document.getElementById('resume-preview')
  if (!element) return

  exporting.value = true
  try {
    await html2pdf().set({
      margin: [store.layout.margin_top, store.layout.margin_right, store.layout.margin_bottom, store.layout.margin_left].map(v => v + 'mm'),
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(element).save()
  } finally {
    exporting.value = false
  }
}

// 导出为 Word/PDF（后端方案）
async function exportFromBackend(format: 'docx' | 'pdf') {
  exporting.value = true
  try {
    const res = await exportApi.exportResume({
      resume_data: store.getResumeData(),
      format,
    })
    const blob = new Blob([res.data])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('导出失败:', e)
    alert('导出失败，请检查后端服务是否正常')
  } finally {
    exporting.value = false
  }
}

// 打印
function printResume() {
  window.print()
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between mb-6 no-print">
      <h2 class="text-lg font-semibold text-gray-800">简历预览</h2>
      <div class="flex items-center gap-2">
        <button @click="exportPdfFrontend()" class="btn-primary" :disabled="exporting">
          {{ exporting ? '导出中...' : '导出 PDF (前端)' }}
        </button>
        <button @click="exportFromBackend('docx')" class="btn-secondary" :disabled="exporting">
          导出 Word
        </button>
        <button @click="exportFromBackend('pdf')" class="btn-secondary" :disabled="exporting">
          导出 PDF (后端)
        </button>
        <button @click="printResume()" class="btn-secondary">
          打印
        </button>
      </div>
    </div>

    <!-- 简历预览区域 -->
    <div class="flex justify-center">
      <div
        id="resume-preview"
        class="bg-white shadow-lg rounded-lg w-[210mm] min-h-[297mm]"
        :style="{
          padding: `${store.layout.margin_top}mm ${store.layout.margin_right}mm ${store.layout.margin_bottom}mm ${store.layout.margin_left}mm`,
          lineHeight: store.layout.line_height,
          letterSpacing: store.layout.letter_spacing + 'px',
        }"
        :class="{
          'font-sans': store.theme === 'minimal',
          'font-mono': store.theme === 'geek',
          'font-serif': store.theme === 'business',
        }"
      >
        <!-- 个人信息 -->
        <div v-if="store.personalInfo.name" class="text-center mb-4">
          <h1
            class="font-bold"
            :class="{
              'text-2xl text-gray-900': store.theme === 'minimal',
              'text-2xl text-cyan-700': store.theme === 'geek',
              'text-2xl text-blue-900': store.theme === 'business',
            }"
          >
            {{ store.personalInfo.name }}
          </h1>
          <div class="flex items-center justify-center gap-3 mt-1 text-sm text-gray-500">
            <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
            <span v-if="store.personalInfo.phone && store.personalInfo.email">|</span>
            <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
            <span v-if="store.personalInfo.location">| {{ store.personalInfo.location }}</span>
          </div>
          <div v-if="store.personalInfo.website || store.personalInfo.github" class="flex items-center justify-center gap-3 mt-1 text-xs text-gray-400">
            <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
            <span v-if="store.personalInfo.github">GitHub: {{ store.personalInfo.github }}</span>
          </div>
          <p v-if="store.personalInfo.summary" class="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
            {{ store.personalInfo.summary }}
          </p>
        </div>

        <!-- 分割线 -->
        <hr v-if="store.personalInfo.name" class="my-3" :class="{
          'border-gray-300': store.theme === 'minimal',
          'border-cyan-400': store.theme === 'geek',
          'border-blue-800': store.theme === 'business',
        }" />

        <!-- 各栏位 -->
        <div v-for="section in store.sortedSections" :key="section.id" class="mb-4">
          <template v-if="section.visible">
            <!-- 栏位标题 -->
            <h2
              class="font-bold text-sm uppercase tracking-wide pb-1 mb-2 border-b-2"
              :class="{
                'text-gray-800 border-gray-800': store.theme === 'minimal',
                'text-cyan-700 border-cyan-500': store.theme === 'geek',
                'text-blue-900 border-blue-900': store.theme === 'business',
              }"
            >
              {{ section.title }}
            </h2>

            <!-- 教育背景 -->
            <template v-if="section.type === 'education'">
              <div class="mb-2">
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-sm">{{ (section.data as any).school }}</span>
                  <span class="text-xs text-gray-500">{{ (section.data as any).start_date }} - {{ (section.data as any).end_date || '至今' }}</span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ (section.data as any).degree }} {{ (section.data as any).major }}
                  <span v-if="(section.data as any).gpa" class="text-gray-500"> | GPA: {{ (section.data as any).gpa }}</span>
                </div>
                <ul v-if="(section.data as any).highlights?.length" class="list-disc list-inside text-sm text-gray-600 mt-1">
                  <li v-for="(h, i) in (section.data as any).highlights" :key="i">{{ h }}</li>
                </ul>
              </div>
            </template>

            <!-- 工作经历 -->
            <template v-else-if="section.type === 'work'">
              <div class="mb-2">
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-sm">{{ (section.data as any).company }}</span>
                  <span class="text-xs text-gray-500">{{ (section.data as any).start_date }} - {{ (section.data as any).end_date || '至今' }}</span>
                </div>
                <div class="text-sm" :class="{
                  'text-gray-700': store.theme === 'minimal',
                  'text-cyan-700': store.theme === 'geek',
                  'text-blue-800': store.theme === 'business',
                }">{{ (section.data as any).position }}</div>
                <p v-if="(section.data as any).description" class="text-sm text-gray-600 mt-1">{{ (section.data as any).description }}</p>
                <ul v-if="(section.data as any).achievements?.length" class="list-disc list-inside text-sm text-gray-600 mt-1">
                  <li v-for="(a, i) in (section.data as any).achievements" :key="i">{{ a }}</li>
                </ul>
              </div>
            </template>

            <!-- 项目经验 -->
            <template v-else-if="section.type === 'project'">
              <div class="mb-2">
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-sm">{{ (section.data as any).name }}</span>
                  <span class="text-xs text-gray-500">{{ (section.data as any).start_date }} - {{ (section.data as any).end_date || '至今' }}</span>
                </div>
                <div v-if="(section.data as any).role" class="text-sm" :class="{
                  'text-gray-700': store.theme === 'minimal',
                  'text-cyan-700': store.theme === 'geek',
                  'text-blue-800': store.theme === 'business',
                }">{{ (section.data as any).role }}</div>
                <div v-if="(section.data as any).tech_stack?.length" class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="tech in (section.data as any).tech_stack"
                    :key="tech"
                    class="text-xs px-1.5 py-0.5 rounded"
                    :class="{
                      'bg-gray-100 text-gray-600': store.theme === 'minimal',
                      'bg-cyan-50 text-cyan-700': store.theme === 'geek',
                      'bg-blue-50 text-blue-700': store.theme === 'business',
                    }"
                  >{{ tech }}</span>
                </div>
                <p v-if="(section.data as any).description" class="text-sm text-gray-600 mt-1">{{ (section.data as any).description }}</p>
                <ul v-if="(section.data as any).achievements?.length" class="list-disc list-inside text-sm text-gray-600 mt-1">
                  <li v-for="(a, i) in (section.data as any).achievements" :key="i">{{ a }}</li>
                </ul>
              </div>
            </template>

            <!-- 技能清单 -->
            <template v-else-if="section.type === 'skill'">
              <div class="mb-1">
                <span v-if="(section.data as any).category" class="font-semibold text-sm">{{ (section.data as any).category }}: </span>
                <span class="text-sm text-gray-700">{{ (section.data as any).skills?.join(' · ') }}</span>
              </div>
            </template>

            <!-- 自定义 -->
            <template v-else>
              <p class="text-sm text-gray-600">{{ section.data }}</p>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
