<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { resumeApi, type ResumeListItem } from '@/api'
import { themes } from '@/config/themes'

const router = useRouter()
const authStore = useAuthStore()

const resumes = ref<ResumeListItem[]>([])
const loading = ref(true)
const deleting = ref<string | null>(null)

onMounted(async () => {
  await loadResumes()
})

async function loadResumes() {
  loading.value = true
  try {
    const res = await resumeApi.list()
    resumes.value = res.data
  } catch (err) {
    console.error('加载简历列表失败', err)
  } finally {
    loading.value = false
  }
}

function openResume(id: string) {
  router.push({ name: 'editor', query: { id } })
}

function newResume() {
  router.push({ name: 'editor' })
}

async function removeResume(id: string) {
  if (!confirm('确定删除这份简历？')) return
  deleting.value = id
  try {
    await resumeApi.delete(id)
    resumes.value = resumes.value.filter(r => r.id !== id)
  } catch (err) {
    console.error('删除失败', err)
  } finally {
    deleting.value = null
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function getThemeColor(themeId: string) {
  const t = themes.find(t => t.id === themeId)
  return t?.headingColor || '#6366f1'
}

function getThemeName(themeId: string) {
  const t = themes.find(t => t.id === themeId)
  return t?.name || themeId
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 class="text-xl font-bold text-gray-900">我的简历</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
            {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <span class="text-sm text-gray-600">{{ authStore.user?.username }}</span>
          <button @click="handleLogout" class="text-sm text-gray-400 hover:text-red-500 transition">退出</button>
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="max-w-5xl mx-auto px-6 py-8">
      <!-- 新建按钮 -->
      <div class="mb-6">
        <button
          @click="newResume"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          新建简历
        </button>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-20 text-gray-400">
        <svg class="animate-spin w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        加载中...
      </div>

      <!-- 空状态 -->
      <div v-else-if="resumes.length === 0" class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-400 mb-4">还没有简历，点击上方按钮创建</p>
      </div>

      <!-- 简历列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="r in resumes"
          :key="r.id"
          class="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
          @click="openResume(r.id)"
        >
          <div class="p-5">
            <!-- 主题色条 -->
            <div class="w-8 h-1 rounded-full mb-3" :style="{ backgroundColor: getThemeColor(r.theme) }"></div>
            <!-- 标题 -->
            <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition truncate">{{ r.title }}</h3>
            <!-- 主题 -->
            <p class="text-xs text-gray-400 mt-1">模板：{{ getThemeName(r.theme) }}</p>
            <!-- 时间 -->
            <p class="text-xs text-gray-400 mt-1">{{ formatDate(r.updated_at || r.created_at) }}</p>
          </div>
          <!-- 操作栏 -->
          <div class="border-t border-gray-100 px-5 py-3 flex justify-between items-center">
            <button
              @click.stop="openResume(r.id)"
              class="text-sm text-primary-600 hover:text-primary-800 font-medium transition"
            >编辑</button>
            <button
              @click.stop="removeResume(r.id)"
              :disabled="deleting === r.id"
              class="text-sm text-gray-400 hover:text-red-500 transition disabled:opacity-50"
            >
              {{ deleting === r.id ? '删除中...' : '删除' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
