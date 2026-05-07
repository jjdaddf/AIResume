<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import type { ResumeSection } from '@/stores/resume'

const props = defineProps<{
  section: ResumeSection
}>()

const store = useResumeStore()

function updateData(field: string, value: any) {
  store.updateSectionData(props.section.id, { [field]: value })
}

function addListItem(field: string) {
  const data = { ...props.section.data }
  const list = [...(data[field] || []), '']
  updateData(field, list)
}

function removeListItem(field: string, index: number) {
  const data = { ...props.section.data }
  const list = [...(data[field] || [])]
  list.splice(index, 1)
  updateData(field, list)
}

function updateListItem(field: string, index: number, value: string) {
  const data = { ...props.section.data }
  const list = [...(data[field] || [])]
  list[index] = value
  updateData(field, list)
}
</script>

<template>
  <div>
    <!-- 栏位标题编辑 -->
    <div class="mb-3">
      <label class="label-text">栏位标题</label>
      <input
        :value="section.title"
        @input="store.updateSection(section.id, { title: ($event.target as HTMLInputElement).value })"
        class="input-field"
      />
    </div>

    <!-- 教育背景编辑器 -->
    <template v-if="section.type === 'education'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="label-text">学校</label>
          <input :value="(section.data as any).school" @input="updateData('school', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">学位</label>
          <input :value="(section.data as any).degree" @input="updateData('degree', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="本科/硕士/博士" />
        </div>
        <div>
          <label class="label-text">专业</label>
          <input :value="(section.data as any).major" @input="updateData('major', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">GPA</label>
          <input :value="(section.data as any).gpa" @input="updateData('gpa', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="3.8/4.0" />
        </div>
        <div>
          <label class="label-text">开始时间</label>
          <input :value="(section.data as any).start_date" @input="updateData('start_date', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="2020.09" />
        </div>
        <div>
          <label class="label-text">结束时间</label>
          <input :value="(section.data as any).end_date" @input="updateData('end_date', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="2024.06" />
        </div>
      </div>
      <div class="mt-3">
        <label class="label-text">亮点</label>
        <div v-for="(h, i) in (section.data as any).highlights || []" :key="i" class="flex items-center gap-2 mb-2">
          <input :value="h" @input="updateListItem('highlights', i, ($event.target as HTMLInputElement).value)" class="input-field flex-1" />
          <button @click="removeListItem('highlights', i)" class="text-red-400 hover:text-red-600 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <button @click="addListItem('highlights')" class="text-sm text-primary-600 hover:text-primary-800">+ 添加亮点</button>
      </div>
    </template>

    <!-- 工作经历编辑器 -->
    <template v-else-if="section.type === 'work'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="label-text">公司</label>
          <input :value="(section.data as any).company" @input="updateData('company', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">职位</label>
          <input :value="(section.data as any).position" @input="updateData('position', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">开始时间</label>
          <input :value="(section.data as any).start_date" @input="updateData('start_date', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="2022.03" />
        </div>
        <div>
          <label class="label-text">结束时间</label>
          <input :value="(section.data as any).end_date" @input="updateData('end_date', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="至今" />
        </div>
      </div>
      <div class="mt-3">
        <label class="label-text">工作描述</label>
        <textarea :value="(section.data as any).description" @input="updateData('description', ($event.target as HTMLTextAreaElement).value)" class="input-field min-h-[60px]" placeholder="描述你的主要职责..."></textarea>
      </div>
      <div class="mt-3">
        <label class="label-text">关键成果</label>
        <div v-for="(a, i) in (section.data as any).achievements || []" :key="i" class="flex items-center gap-2 mb-2">
          <input :value="a" @input="updateListItem('achievements', i, ($event.target as HTMLInputElement).value)" class="input-field flex-1" />
          <button @click="removeListItem('achievements', i)" class="text-red-400 hover:text-red-600 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <button @click="addListItem('achievements')" class="text-sm text-primary-600 hover:text-primary-800">+ 添加成果</button>
      </div>
    </template>

    <!-- 项目经验编辑器 -->
    <template v-else-if="section.type === 'project'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="label-text">项目名称</label>
          <input :value="(section.data as any).name" @input="updateData('name', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">角色</label>
          <input :value="(section.data as any).role" @input="updateData('role', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="核心开发 / 技术负责人" />
        </div>
        <div>
          <label class="label-text">开始时间</label>
          <input :value="(section.data as any).start_date" @input="updateData('start_date', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
        <div>
          <label class="label-text">结束时间</label>
          <input :value="(section.data as any).end_date" @input="updateData('end_date', ($event.target as HTMLInputElement).value)" class="input-field" />
        </div>
      </div>
      <div class="mt-3">
        <label class="label-text">技术栈</label>
        <input
          :value="(section.data as any).tech_stack?.join(', ')"
          @input="updateData('tech_stack', ($event.target as HTMLInputElement).value.split(',').map((s: string) => s.trim()).filter(Boolean))"
          class="input-field"
          placeholder="Vue3, Python, PostgreSQL（逗号分隔）"
        />
      </div>
      <div class="mt-3">
        <label class="label-text">项目描述</label>
        <textarea :value="(section.data as any).description" @input="updateData('description', ($event.target as HTMLTextAreaElement).value)" class="input-field min-h-[60px]"></textarea>
      </div>
      <div class="mt-3">
        <label class="label-text">项目成果</label>
        <div v-for="(a, i) in (section.data as any).achievements || []" :key="i" class="flex items-center gap-2 mb-2">
          <input :value="a" @input="updateListItem('achievements', i, ($event.target as HTMLInputElement).value)" class="input-field flex-1" />
          <button @click="removeListItem('achievements', i)" class="text-red-400 hover:text-red-600 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <button @click="addListItem('achievements')" class="text-sm text-primary-600 hover:text-primary-800">+ 添加成果</button>
      </div>
    </template>

    <!-- 技能清单编辑器 -->
    <template v-else-if="section.type === 'skill'">
      <div class="mb-3">
        <label class="label-text">技能分类</label>
        <input :value="(section.data as any).category" @input="updateData('category', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="编程语言 / 框架 / 工具" />
      </div>
      <div>
        <label class="label-text">技能列表</label>
        <input
          :value="(section.data as any).skills?.join(', ')"
          @input="updateData('skills', ($event.target as HTMLInputElement).value.split(',').map((s: string) => s.trim()).filter(Boolean))"
          class="input-field"
          placeholder="JavaScript, TypeScript, Python（逗号分隔）"
        />
      </div>
    </template>

    <!-- 自定义栏位 -->
    <template v-else>
      <div>
        <label class="label-text">内容</label>
        <textarea
          :value="typeof section.data === 'string' ? section.data : JSON.stringify(section.data)"
          @input="store.updateSection(section.id, { data: ($event.target as HTMLTextAreaElement).value })"
          class="input-field min-h-[80px]"
        ></textarea>
      </div>
    </template>
  </div>
</template>
