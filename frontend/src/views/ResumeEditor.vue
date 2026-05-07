<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { useAuthStore } from '@/stores/auth'
import draggable from 'vuedraggable'
import SectionEditor from '@/components/SectionEditor.vue'
import PersonalInfoEditor from '@/components/PersonalInfoEditor.vue'
import ResumePreviewContent from '@/components/ResumePreviewContent.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

const store = useResumeStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const dragOptions = {
  animation: 200,
  group: 'sections',
  disabled: false,
  ghostClass: 'sortable-ghost',
}

const addMenuOpen = ref(false)
const layoutExpanded = ref(false)
const saving = ref(false)
const saveMsg = ref('')
const editingTitle = ref(false)
const resumeTitle = ref('')
let draftTimer: ReturnType<typeof setInterval> | null = null

function onDragEnd() {
  store.sortedSections.forEach((s, i) => {
    store.updateSection(s.id, { order: i })
  })
}

function addSection(type: string) {
  const titles: Record<string, string> = {
    education: '教育背景',
    work: '工作经历',
    project: '项目经验',
    skill: '技能清单',
    custom: '自定义栏位',
  }
  store.addSection(type as any, titles[type] || '自定义栏位')
  addMenuOpen.value = false
}

function updateLayout(field: string, value: number) {
  store.updateLayout({ [field]: value })
}

async function handleSave() {
  if (!authStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  saving.value = true
  saveMsg.value = ''
  try {
    await store.saveToServer(resumeTitle.value || undefined)
    saveMsg.value = '保存成功'
  } catch (err: any) {
    saveMsg.value = err.response?.data?.detail || '保存失败'
  } finally {
    saving.value = false
    setTimeout(() => saveMsg.value = '', 3000)
  }
}

function startEditTitle() {
  resumeTitle.value = store.personalInfo.name || '未命名简历'
  editingTitle.value = true
}

function finishEditTitle() {
  editingTitle.value = false
}

onMounted(async () => {
  const resumeId = route.query.id as string
  if (resumeId && authStore.isLoggedIn) {
    try {
      await store.loadFromServer(resumeId)
    } catch (err) {
      console.error('加载简历失败', err)
    }
  } else if (!resumeId) {
    const hasDraft = store.loadDraft()
    if (!hasDraft) {
      store.currentResumeId = null
    }
  }
  resumeTitle.value = store.personalInfo.name || '未命名简历'

  draftTimer = setInterval(() => {
    store.saveDraft()
  }, 30000)
})

onBeforeUnmount(() => {
  if (draftTimer) clearInterval(draftTimer)
})

watch(() => route.query.id, async (newId) => {
  if (newId && authStore.isLoggedIn) {
    try {
      await store.loadFromServer(newId as string)
    } catch (err) {
      console.error('加载简历失败', err)
    }
  }
})
</script>

<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col">
    <!-- 顶部工具栏 -->
    <div class="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 简历标题 -->
          <div class="flex items-center gap-2">
            <template v-if="editingTitle">
              <input
                v-model="resumeTitle"
                @blur="finishEditTitle"
                @keyup.enter="finishEditTitle"
                class="text-sm font-medium px-2 py-1 border border-primary-300 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 w-40"
                autofocus
              />
            </template>
            <template v-else>
              <span class="text-sm font-medium text-gray-700 max-w-[160px] truncate">{{ resumeTitle }}</span>
              <button @click="startEditTitle" class="text-gray-400 hover:text-primary-600 transition" title="编辑标题">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </template>
          </div>
          <!-- 排版设置 -->
          <button
            @click="layoutExpanded = !layoutExpanded"
            class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-700 font-medium transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            排版设置
            <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': layoutExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <template v-if="authStore.isLoggedIn">
            <button
              @click="handleSave"
              :disabled="saving"
              class="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              :class="saving ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-700 hover:bg-green-100'"
            >
              {{ saving ? '保存中...' : '保存' }}
            </button>
            <span v-if="saveMsg" class="text-xs" :class="saveMsg.includes('成功') ? 'text-green-600' : 'text-red-500'">{{ saveMsg }}</span>
            <router-link
              to="/resumes"
              class="text-xs font-medium px-3 py-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
            >我的简历</router-link>
          </template>
          <template v-else>
            <router-link
              :to="{ path: '/login', query: { redirect: route.fullPath } }"
              class="text-xs font-medium px-3 py-1.5 rounded-lg text-primary-600 hover:bg-primary-50 border border-primary-200 transition-colors"
            >登录保存简历</router-link>
          </template>
          <router-link to="/ai" class="btn-primary text-xs !py-1.5 !px-3">AI 助手</router-link>
          <button @click="store.reset()" class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors">
            重置
          </button>
        </div>
      </div>

      <!-- 模板选择 -->
      <div class="mt-2">
        <ThemeSelector />
      </div>

      <!-- 排版控制面板 -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-40"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-40"
        leave-to-class="opacity-0 -translate-y-2 max-h-0"
      >
        <div v-if="layoutExpanded" class="mt-3 pt-3 border-t border-gray-100 overflow-hidden">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2">
            <div>
              <label class="text-xs text-gray-400">上边距 {{ store.layout.margin_top }}mm</label>
              <input type="range" :value="store.layout.margin_top" @input="updateLayout('margin_top', Number(($event.target as HTMLInputElement).value))" min="5" max="50" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label class="text-xs text-gray-400">下边距 {{ store.layout.margin_bottom }}mm</label>
              <input type="range" :value="store.layout.margin_bottom" @input="updateLayout('margin_bottom', Number(($event.target as HTMLInputElement).value))" min="5" max="50" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label class="text-xs text-gray-400">左边距 {{ store.layout.margin_left }}mm</label>
              <input type="range" :value="store.layout.margin_left" @input="updateLayout('margin_left', Number(($event.target as HTMLInputElement).value))" min="5" max="50" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label class="text-xs text-gray-400">右边距 {{ store.layout.margin_right }}mm</label>
              <input type="range" :value="store.layout.margin_right" @input="updateLayout('margin_right', Number(($event.target as HTMLInputElement).value))" min="5" max="50" step="1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label class="text-xs text-gray-400">行间距 {{ store.layout.line_height.toFixed(1) }}</label>
              <input type="range" :value="store.layout.line_height" @input="updateLayout('line_height', Number(($event.target as HTMLInputElement).value))" min="1.0" max="2.5" step="0.1" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label class="text-xs text-gray-400">字间距 {{ store.layout.letter_spacing.toFixed(1) }}px</label>
              <input type="range" :value="store.layout.letter_spacing" @input="updateLayout('letter_spacing', Number(($event.target as HTMLInputElement).value))" min="0" max="5" step="0.5" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 主体：左右分栏 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：编辑面板 -->
      <div class="w-1/2 overflow-y-auto border-r border-gray-200 bg-gray-50">
        <div class="p-4 space-y-3">
          <!-- 个人信息 -->
          <div class="card">
            <div
              class="flex items-center justify-between cursor-pointer"
              @click="store.setActiveSection(store.activeSectionId === 'personal' ? null : 'personal')"
            >
              <h2 class="text-sm font-semibold text-gray-800">
                <span class="mr-2">👤</span> 个人信息
              </h2>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform"
                :class="{ 'rotate-180': store.activeSectionId === 'personal' }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <PersonalInfoEditor v-if="store.activeSectionId === 'personal'" class="mt-3" />
          </div>

          <!-- 可拖拽的简历栏位 -->
          <draggable
            :list="store.sortedSections"
            v-bind="dragOptions"
            item-key="id"
            handle=".drag-handle"
            @end="onDragEnd"
          >
            <template #item="{ element: section }">
              <div class="card mb-3" :class="{ 'ring-2 ring-primary-300': store.activeSectionId === section.id }">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="drag-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                      </svg>
                    </div>
                    <h3 class="text-sm font-semibold text-gray-700">{{ section.title }}</h3>
                    <span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ section.type }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      @click="store.toggleSectionVisibility(section.id)"
                      class="p-1 rounded hover:bg-gray-100"
                      :title="section.visible ? '隐藏' : '显示'"
                    >
                      <svg v-if="section.visible" class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <svg v-else class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    </button>
                    <button
                      @click="store.setActiveSection(store.activeSectionId === section.id ? null : section.id)"
                      class="p-1 rounded hover:bg-gray-100"
                    >
                      <svg
                        class="w-3.5 h-3.5 text-gray-500 transition-transform"
                        :class="{ 'rotate-180': store.activeSectionId === section.id }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    <button
                      @click="store.removeSection(section.id)"
                      class="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                      title="删除"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <SectionEditor
                  v-if="store.activeSectionId === section.id"
                  :section="section"
                  class="mt-3"
                />
              </div>
            </template>
          </draggable>

          <!-- 添加栏位按钮 -->
          <div class="relative">
            <button
              @click="addMenuOpen = !addMenuOpen"
              class="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors text-sm"
            >
              + 添加简历栏位
            </button>
            <div
              v-if="addMenuOpen"
              class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden"
            >
              <button
                v-for="item in [
                  { type: 'education', label: '教育背景', icon: '🎓' },
                  { type: 'work', label: '工作经历', icon: '💼' },
                  { type: 'project', label: '项目经验', icon: '🚀' },
                  { type: 'skill', label: '技能清单', icon: '⚡' },
                  { type: 'custom', label: '自定义栏位', icon: '📝' },
                ]"
                :key="item.type"
                @click="addSection(item.type)"
                class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <span>{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：实时预览 -->
      <div class="w-1/2 overflow-y-auto bg-gray-200">
        <div class="flex justify-center py-6">
          <div class="transform origin-top" style="zoom: 1;">
            <ResumePreviewContent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
