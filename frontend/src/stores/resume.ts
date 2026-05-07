/**
 * 简历数据 Store - 全局状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ==================== 类型定义 ====================

export interface PersonalInfo {
  name: string
  photo: string
  phone: string
  email: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

export interface EducationItem {
  school: string
  degree: string
  major: string
  start_date: string
  end_date: string
  gpa: string
  highlights: string[]
}

export interface WorkExperienceItem {
  company: string
  position: string
  start_date: string
  end_date: string
  description: string
  achievements: string[]
}

export interface ProjectItem {
  name: string
  role: string
  start_date: string
  end_date: string
  description: string
  tech_stack: string[]
  achievements: string[]
}

export interface SkillItem {
  category: string
  skills: string[]
}

export interface ResumeSection {
  id: string
  type: 'education' | 'work' | 'project' | 'skill' | 'custom'
  title: string
  order: number
  visible: boolean
  data: EducationItem | WorkExperienceItem | ProjectItem | SkillItem | any
}

export interface LayoutConfig {
  margin_top: number
  margin_bottom: number
  margin_left: number
  margin_right: number
  line_height: number
  letter_spacing: number
}

export type ThemeStyle = string

export interface ResumeData {
  personal_info: PersonalInfo
  sections: ResumeSection[]
  theme: ThemeStyle
  layout: LayoutConfig
}

// ==================== 默认数据 ====================

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  photo: '',
  phone: '',
  email: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
}

const defaultSections: ResumeSection[] = [
  {
    id: 'education-1',
    type: 'education',
    title: '教育背景',
    order: 0,
    visible: true,
    data: { school: '', degree: '', major: '', start_date: '', end_date: '', gpa: '', highlights: [] } as EducationItem,
  },
  {
    id: 'work-1',
    type: 'work',
    title: '工作经历',
    order: 1,
    visible: true,
    data: { company: '', position: '', start_date: '', end_date: '', description: '', achievements: [] } as WorkExperienceItem,
  },
  {
    id: 'project-1',
    type: 'project',
    title: '项目经验',
    order: 2,
    visible: true,
    data: { name: '', role: '', start_date: '', end_date: '', description: '', tech_stack: [], achievements: [] } as ProjectItem,
  },
  {
    id: 'skill-1',
    type: 'skill',
    title: '技能清单',
    order: 3,
    visible: true,
    data: { category: '', skills: [] } as SkillItem,
  },
]

const defaultLayout: LayoutConfig = {
  margin_top: 20,
  margin_bottom: 20,
  margin_left: 20,
  margin_right: 20,
  line_height: 1.5,
  letter_spacing: 0,
}

// ==================== Store ====================

export const useResumeStore = defineStore('resume', () => {
  // 状态
  const personalInfo = ref<PersonalInfo>({ ...defaultPersonalInfo })
  const sections = ref<ResumeSection[]>(JSON.parse(JSON.stringify(defaultSections)))
  const theme = ref<ThemeStyle>('minimal')
  const layout = ref<LayoutConfig>({ ...defaultLayout })
  const activeSectionId = ref<string | null>(null)
  const loading = ref(false)
  const currentResumeId = ref<string | null>(null)  // 当前编辑的简历 ID（已保存到服务器）

  // 计算属性
  const sortedSections = computed(() =>
    [...sections.value].sort((a, b) => a.order - b.order)
  )

  const activeSection = computed(() =>
    sections.value.find((s) => s.id === activeSectionId.value) || null
  )

  const allSkills = computed(() => {
    const skills: string[] = []
    sections.value
      .filter((s) => s.type === 'skill')
      .forEach((s) => {
        const data = s.data as SkillItem
        if (data.skills) skills.push(...data.skills)
      })
    return skills
  })

  // 方法
  function setActiveSection(id: string | null) {
    activeSectionId.value = id
  }

  function updatePersonalInfo(info: Partial<PersonalInfo>) {
    personalInfo.value = { ...personalInfo.value, ...info }
  }

  function updateSection(id: string, updates: Partial<ResumeSection>) {
    const idx = sections.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      sections.value[idx] = { ...sections.value[idx], ...updates }
    }
  }

  function updateSectionData(id: string, data: any) {
    const idx = sections.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      sections.value[idx].data = { ...sections.value[idx].data, ...data }
    }
  }

  function addSection(type: ResumeSection['type'], title: string) {
    const maxOrder = Math.max(...sections.value.map((s) => s.order), -1)
    const id = `${type}-${Date.now()}`
    let data: any = {}

    switch (type) {
      case 'education':
        data = { school: '', degree: '', major: '', start_date: '', end_date: '', gpa: '', highlights: [] }
        break
      case 'work':
        data = { company: '', position: '', start_date: '', end_date: '', description: '', achievements: [] }
        break
      case 'project':
        data = { name: '', role: '', start_date: '', end_date: '', description: '', tech_stack: [], achievements: [] }
        break
      case 'skill':
        data = { category: '', skills: [] }
        break
      default:
        data = {}
    }

    sections.value.push({ id, type, title, order: maxOrder + 1, visible: true, data })
    activeSectionId.value = id
  }

  function removeSection(id: string) {
    sections.value = sections.value.filter((s) => s.id !== id)
    if (activeSectionId.value === id) {
      activeSectionId.value = null
    }
  }

  function reorderSections(newOrder: ResumeSection[]) {
    newOrder.forEach((section, index) => {
      const idx = sections.value.findIndex((s) => s.id === section.id)
      if (idx !== -1) {
        sections.value[idx].order = index
      }
    })
  }

  function toggleSectionVisibility(id: string) {
    const idx = sections.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      sections.value[idx].visible = !sections.value[idx].visible
    }
  }

  function setTheme(t: ThemeStyle) {
    theme.value = t
  }

  function updateLayout(updates: Partial<LayoutConfig>) {
    layout.value = { ...layout.value, ...updates }
  }

  // 获取完整简历数据用于 API 调用
  function getResumeData(): ResumeData {
    return {
      personal_info: { ...personalInfo.value },
      sections: sections.value.map((s) => ({ ...s })),
      theme: theme.value,
      layout: { ...layout.value },
    }
  }

  // 重置
  function reset() {
    personalInfo.value = { ...defaultPersonalInfo }
    sections.value = JSON.parse(JSON.stringify(defaultSections))
    theme.value = 'minimal'
    layout.value = { ...defaultLayout }
    activeSectionId.value = null
    currentResumeId.value = null
  }

  // 从服务器数据加载
  function loadFromData(data: any) {
    personalInfo.value = data.personal_info || { ...defaultPersonalInfo }
    sections.value = data.sections || JSON.parse(JSON.stringify(defaultSections))
    theme.value = data.theme || 'minimal'
    layout.value = data.layout || { ...defaultLayout }
    activeSectionId.value = null
  }

  // ==================== localStorage 草稿 ====================

  const DRAFT_KEY = 'resume_draft'

  /** 保存草稿到 localStorage */
  function saveDraft() {
    const draft = getResumeData()
    draft._resumeId = currentResumeId.value
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }

  /** 从 localStorage 恢复草稿 */
  function loadDraft(): boolean {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return false
    try {
      const draft = JSON.parse(raw)
      loadFromData(draft)
      currentResumeId.value = draft._resumeId || null
      return true
    } catch {
      return false
    }
  }

  /** 清除草稿 */
  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  }

  // 保存到服务器
  async function saveToServer(title?: string): Promise<string | null> {
    const { resumeApi } = await import('@/api')
    const resumeData = getResumeData()
    const saveTitle = title || personalInfo.value.name || '未命名简历'

    if (currentResumeId.value) {
      // 更新
      await resumeApi.update(currentResumeId.value, {
        title: saveTitle,
        resume_data: resumeData,
        theme: theme.value,
      })
      clearDraft()
      return currentResumeId.value
    } else {
      // 新建
      const res = await resumeApi.create({
        title: saveTitle,
        resume_data: resumeData,
        theme: theme.value,
      })
      currentResumeId.value = res.data.id
      clearDraft()
      return res.data.id
    }
  }

  // 从服务器加载
  async function loadFromServer(id: string) {
    const { resumeApi } = await import('@/api')
    const res = await resumeApi.get(id)
    const data = res.data
    currentResumeId.value = data.id
    loadFromData(data.resume_data)
  }

  return {
    personalInfo,
    sections,
    theme,
    layout,
    activeSectionId,
    loading,
    currentResumeId,
    sortedSections,
    activeSection,
    allSkills,
    setActiveSection,
    updatePersonalInfo,
    updateSection,
    updateSectionData,
    addSection,
    removeSection,
    reorderSections,
    toggleSectionVisibility,
    setTheme,
    updateLayout,
    getResumeData,
    loadFromData,
    saveToServer,
    loadFromServer,
    saveDraft,
    loadDraft,
    clearDraft,
    reset,
  }
})
