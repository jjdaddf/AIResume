<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { aiApi, exportApi } from '@/api'
import type { PolishResponse } from '@/api'
import html2pdf from 'html2pdf.js'
import { ref } from 'vue'
import ResumePreviewContent from '@/components/ResumePreviewContent.vue'

const store = useResumeStore()
const exporting = ref(false)
const polishing = ref(false)
const polishResult = ref<PolishResponse | null>(null)

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

    <!-- 简历预览区域（使用主题配置渲染） -->
    <div class="flex justify-center">
      <div id="resume-preview">
        <ResumePreviewContent />
      </div>
    </div>
  </div>
</template>
