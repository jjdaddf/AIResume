<script setup lang="ts">
import { ref } from 'vue'
import { useResumeStore } from '@/stores/resume'
import draggable from 'vuedraggable'
import SectionEditor from '@/components/SectionEditor.vue'
import PersonalInfoEditor from '@/components/PersonalInfoEditor.vue'
import LayoutControls from '@/components/LayoutControls.vue'

const store = useResumeStore()

const dragOptions = {
  animation: 200,
  group: 'sections',
  disabled: false,
  ghostClass: 'sortable-ghost',
}

const addMenuOpen = ref(false)

function onDragEnd() {
  // 重新编号 order
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
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：编辑面板 -->
      <div class="lg:col-span-2 space-y-4">
        <!-- 个人信息 -->
        <div class="card">
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="store.setActiveSection(store.activeSectionId === 'personal' ? null : 'personal')"
          >
            <h2 class="text-base font-semibold text-gray-800">
              <span class="mr-2">👤</span> 个人信息
            </h2>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform"
              :class="{ 'rotate-180': store.activeSectionId === 'personal' }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <PersonalInfoEditor v-if="store.activeSectionId === 'personal'" class="mt-4" />
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
                  <!-- 拖拽手柄 -->
                  <div class="drag-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                    </svg>
                  </div>
                  <h3 class="text-sm font-semibold text-gray-700">{{ section.title }}</h3>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ section.type }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <!-- 可见性切换 -->
                  <button
                    @click="store.toggleSectionVisibility(section.id)"
                    class="p-1.5 rounded hover:bg-gray-100"
                    :title="section.visible ? '隐藏此栏位' : '显示此栏位'"
                  >
                    <svg v-if="section.visible" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                  <!-- 展开/折叠 -->
                  <button
                    @click="store.setActiveSection(store.activeSectionId === section.id ? null : section.id)"
                    class="p-1.5 rounded hover:bg-gray-100"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500 transition-transform"
                      :class="{ 'rotate-180': store.activeSectionId === section.id }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <!-- 删除 -->
                  <button
                    @click="store.removeSection(section.id)"
                    class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                    title="删除此栏位"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 编辑器内容 -->
              <SectionEditor
                v-if="store.activeSectionId === section.id"
                :section="section"
                class="mt-4"
              />
            </div>
          </template>
        </draggable>

        <!-- 添加栏位按钮 -->
        <div class="relative">
          <button
            @click="addMenuOpen = !addMenuOpen"
            class="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
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
              class="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <span>{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：排版控制 -->
      <div class="space-y-4">
        <LayoutControls />
        <!-- 快捷操作 -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">快捷操作</h3>
          <div class="space-y-2">
            <router-link to="/preview" class="btn-secondary w-full block text-center">
              预览简历
            </router-link>
            <router-link to="/ai" class="btn-primary w-full block text-center">
              AI 助手
            </router-link>
            <button @click="store.reset()" class="w-full py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              重置简历
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


