<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import type { ResumeSection } from '@/stores/resume'
import { getThemeConfig } from '@/config/themes'
import { computed, defineComponent, type PropType } from 'vue'
import type { ThemeConfig } from '@/config/themes'

const store = useResumeStore()

const theme = computed(() => getThemeConfig(store.theme))
const layout = computed(() => theme.value.sectionLayout)
const isSidebar = computed(() => theme.value.pageLayout === 'sidebar-left' || theme.value.pageLayout === 'sidebar-right')
const isTwoCol = computed(() => theme.value.pageLayout === 'two-column')

// 按 type 分组 visible sections，保持首次出现的顺序
interface SectionGroup { type: string; title: string; sections: ResumeSection[] }
const groupedSections = computed(() => {
  const groups: SectionGroup[] = []
  const map = new Map<string, SectionGroup>()
  for (const s of store.sortedSections) {
    if (!s.visible) continue
    if (map.has(s.type)) {
      map.get(s.type)!.sections.push(s)
    } else {
      const g: SectionGroup = { type: s.type, title: s.title, sections: [s] }
      map.set(s.type, g)
      groups.push(g)
    }
  }
  return groups
})

// 侧边栏分组
const sidebarGrouped = computed(() =>
  groupedSections.value.filter(g => g.type === 'skill' || g.type === 'education')
)
// 主栏分组
const mainGrouped = computed(() =>
  groupedSections.value.filter(g => g.type !== 'skill' && g.type !== 'education')
)
// 双栏分组
const leftColGrouped = computed(() =>
  groupedSections.value.filter(g => g.type === 'work' || g.type === 'education')
)
const rightColGrouped = computed(() =>
  groupedSections.value.filter(g => g.type !== 'work' && g.type !== 'education')
)

const rootStyle = computed(() => ({
  '--theme-name-color': theme.value.nameColor,
  '--theme-heading-color': theme.value.headingColor,
  '--theme-heading-border-color': theme.value.headingBorderColor,
  '--theme-divider-color': theme.value.dividerColor,
  '--theme-subtitle-color': theme.value.subtitleColor,
  '--theme-tag-bg': theme.value.tagBg,
  '--theme-tag-color': theme.value.tagColor,
  '--theme-body-color': theme.value.bodyColor,
  '--theme-date-color': theme.value.dateColor,
  '--theme-contact-color': theme.value.contactColor,
  '--theme-social-color': theme.value.socialColor,
  '--theme-summary-color': theme.value.summaryColor,
  '--theme-heading-weight': theme.value.headingWeight,
  '--theme-name-size': theme.value.nameSize + 'px',
  '--theme-heading-size': theme.value.headingSize + 'px',
  fontFamily: theme.value.fontFamily,
  lineHeight: store.layout.line_height,
  letterSpacing: store.layout.letter_spacing + 'px',
}))

const t = theme // shorthand

// 姓名文字样式
const nameTextStyle = computed(() => ({
  color: t.value.nameColor,
  fontSize: t.value.nameSize + 'px',
  letterSpacing: t.value.nameTransform === 'wide-spacing' ? '0.15em' : 'normal',
  textTransform: t.value.nameTransform === 'uppercase' ? 'uppercase' : 'none',
}))

// ==================== 内联子组件（必须用 defineComponent 包裹，供模板使用） ====================

const SectionHeading = defineComponent({
  name: 'SectionHeading',
  props: {
    t: { type: Object as PropType<ThemeConfig>, required: true },
    section: { type: Object as PropType<ResumeSection>, required: true },
  },
  template: `
    <div class="flex items-center gap-2 mb-2">
      <div v-if="t.headingStyle === 'left-bar'" class="w-1 h-4 rounded-sm flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }" />
      <div v-if="t.headingStyle === 'dot'" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }" />
      <svg v-if="section.type === 'education'" class="w-4 h-4 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7"/></svg>
      <svg v-else-if="section.type === 'work'" class="w-4 h-4 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      <svg v-else-if="section.type === 'project'" class="w-4 h-4 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
      <svg v-else-if="section.type === 'skill'" class="w-4 h-4 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      <svg v-else class="w-4 h-4 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      <h2 class="uppercase tracking-wide pb-1" :style="{ color: t.headingColor, fontSize: t.headingSize + 'px', fontWeight: t.headingWeight, borderBottom: t.headingStyle === 'underline' ? '2px solid ' + t.headingBorderColor : 'none' }" :class="{ 'flex-1': t.headingStyle === 'underline' }">{{ section.title }}</h2>
    </div>
  `,
})

const SectionBody = defineComponent({
  name: 'SectionBody',
  props: {
    t: { type: Object as PropType<ThemeConfig>, required: true },
    layout: { type: Object as PropType<Record<string, string>>, required: true },
    section: { type: Object as PropType<ResumeSection>, required: true },
  },
  template: `
    <template v-if="section.type === 'education'">
      <div v-if="layout.education === 'classic'" class="mb-2">
        <div class="flex justify-between items-baseline"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.school }}</span><span class="text-xs" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div class="text-sm" :style="{ color: t.bodyColor }">{{ section.data.degree }} {{ section.data.major }}<span v-if="section.data.gpa" :style="{ color: t.dateColor }"> | GPA: {{ section.data.gpa }}</span></div>
        <ul v-if="section.data.highlights?.length" class="text-sm mt-1 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(h, i) in section.data.highlights" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ h }}</span></li></ul>
      </div>
      <div v-else class="mb-2 rounded-lg p-3" :style="{ backgroundColor: t.tagBg, borderLeft: '3px solid ' + t.headingBorderColor }">
        <div class="flex justify-between items-start"><div><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.school }}</span></div><span class="text-xs flex-shrink-0 ml-2" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div class="flex flex-wrap items-center gap-2 mt-1 text-sm" :style="{ color: t.bodyColor }"><span class="inline-flex items-center gap-1"><svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>{{ section.data.degree }} {{ section.data.major }}</span><span v-if="section.data.gpa" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs" :style="{ backgroundColor: t.headingBorderColor + '20', color: t.headingColor }"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>GPA {{ section.data.gpa }}</span></div>
        <ul v-if="section.data.highlights?.length" class="text-sm mt-1.5 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(h, i) in section.data.highlights" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ h }}</span></li></ul>
      </div>
    </template>
    <template v-else-if="section.type === 'work'">
      <div v-if="layout.work === 'classic'" class="mb-2">
        <div class="flex justify-between items-baseline"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.company }}</span><span class="text-xs" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div class="text-sm" :style="{ color: t.subtitleColor }">{{ section.data.position }}</div>
        <p v-if="section.data.description" class="text-sm mt-1" :style="{ color: t.bodyColor }">{{ section.data.description }}</p>
        <ul v-if="section.data.achievements?.length" class="text-sm mt-1 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ a }}</span></li></ul>
      </div>
      <div v-else-if="layout.work === 'timeline'" class="mb-2 relative pl-5">
        <div class="absolute left-0 top-1.5 bottom-1 w-px" :style="{ backgroundColor: t.dividerColor }"></div>
        <div class="absolute left-0 top-1 w-[7px] h-[7px] rounded-full -translate-x-[3px]" :style="{ backgroundColor: t.headingBorderColor }"></div>
        <div class="flex justify-between items-baseline"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.company }}</span><span class="text-xs" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div class="text-sm" :style="{ color: t.subtitleColor }">{{ section.data.position }}</div>
        <p v-if="section.data.description" class="text-sm mt-1" :style="{ color: t.bodyColor }">{{ section.data.description }}</p>
        <ul v-if="section.data.achievements?.length" class="text-sm mt-1 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ a }}</span></li></ul>
      </div>
      <div v-else class="mb-2">
        <div class="flex items-baseline gap-2"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.company }}</span><span class="text-sm" :style="{ color: t.subtitleColor }">&#183; {{ section.data.position }}</span><span class="text-xs ml-auto flex-shrink-0" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <p v-if="section.data.description" class="text-sm mt-0.5" :style="{ color: t.bodyColor }">{{ section.data.description }}</p>
        <ul v-if="section.data.achievements?.length" class="text-sm mt-0.5 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ a }}</span></li></ul>
      </div>
    </template>
    <template v-else-if="section.type === 'project'">
      <div v-if="layout.project === 'classic'" class="mb-2">
        <div class="flex justify-between items-baseline"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.name }}</span><span class="text-xs" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div v-if="section.data.role" class="text-sm" :style="{ color: t.subtitleColor }">{{ section.data.role }}</div>
        <div v-if="section.data.tech_stack?.length" class="flex flex-wrap gap-1 mt-1.5"><span v-for="tech in section.data.tech_stack" :key="tech" class="text-xs px-1.5 py-0.5 rounded" :style="{ backgroundColor: t.tagBg, color: t.tagColor }">{{ tech }}</span></div>
        <p v-if="section.data.description" class="text-sm mt-1" :style="{ color: t.bodyColor }">{{ section.data.description }}</p>
        <ul v-if="section.data.achievements?.length" class="text-sm mt-1 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ a }}</span></li></ul>
      </div>
      <div v-else class="mb-2">
        <div class="flex justify-between items-baseline"><span class="font-semibold text-sm" :style="{ color: t.nameColor }">{{ section.data.name }}</span><span class="text-xs" :style="{ color: t.dateColor }">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</span></div>
        <div v-if="section.data.role" class="text-sm mt-0.5" :style="{ color: t.subtitleColor }">{{ section.data.role }}</div>
        <div v-if="section.data.tech_stack?.length" class="mt-2 py-1.5 px-2.5 rounded-lg" :style="{ backgroundColor: t.tagBg, border: '1px solid ' + t.headingBorderColor + '20' }">
          <div class="flex items-center gap-1 mb-1"><svg class="w-3 h-3" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg><span class="text-xs font-semibold uppercase tracking-wider" :style="{ color: t.headingColor }">Tech Stack</span></div>
          <div class="flex flex-wrap gap-1"><span v-for="tech in section.data.tech_stack" :key="tech" class="text-xs px-2 py-0.5 rounded-full font-medium" :style="{ backgroundColor: t.headingBorderColor + '18', color: t.headingColor }">{{ tech }}</span></div>
        </div>
        <p v-if="section.data.description" class="text-sm mt-1.5" :style="{ color: t.bodyColor }">{{ section.data.description }}</p>
        <ul v-if="section.data.achievements?.length" class="text-sm mt-1 space-y-0.5" :style="{ color: t.bodyColor }"><li v-for="(a, i) in section.data.achievements" :key="i" class="flex items-start gap-1.5"><svg class="w-3 h-3 flex-shrink-0 mt-1" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>{{ a }}</span></li></ul>
      </div>
    </template>
    <template v-else-if="section.type === 'skill'">
      <div v-if="layout.skill === 'inline'" class="mb-1"><span v-if="section.data.category" class="font-semibold text-sm" :style="{ color: t.subtitleColor }">{{ section.data.category }}: </span><span class="text-sm" :style="{ color: t.bodyColor }">{{ section.data.skills?.join(' · ') }}</span></div>
      <div v-else-if="layout.skill === 'tags'" class="mb-1"><span v-if="section.data.category" class="font-semibold text-sm mr-2" :style="{ color: t.subtitleColor }">{{ section.data.category }}</span><div class="inline-flex flex-wrap gap-1.5"><span v-for="skill in section.data.skills" :key="skill" class="text-xs px-2 py-0.5 rounded-full" :style="{ backgroundColor: t.tagBg, color: t.tagColor, border: '1px solid ' + t.headingBorderColor + '25' }">{{ skill }}</span></div></div>
      <div v-else class="mb-1"><span v-if="section.data.category" class="font-semibold text-sm block mb-1" :style="{ color: t.subtitleColor }">{{ section.data.category }}</span><div class="grid grid-cols-3 gap-x-3 gap-y-0.5"><span v-for="skill in section.data.skills" :key="skill" class="text-sm flex items-center gap-1" :style="{ color: t.bodyColor }"><svg class="w-2.5 h-2.5 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>{{ skill }}</span></div></div>
    </template>
    <template v-else><p class="text-sm" :style="{ color: t.bodyColor }">{{ section.data }}</p></template>
  `,
})
</script>

<template>
  <div class="bg-white shadow-lg rounded-lg w-[210mm] min-h-[297mm]" :style="rootStyle">

    <!-- ==================== 单栏布局 ==================== -->
    <template v-if="!isSidebar && !isTwoCol">
      <div :style="{ padding: `${store.layout.margin_top}mm ${store.layout.margin_right}mm ${store.layout.margin_bottom}mm ${store.layout.margin_left}mm` }">

        <!-- ===== 头部样式：simple ===== -->
        <template v-if="t.headerStyle === 'simple'">
          <div v-if="store.personalInfo.name" class="mb-4">
            <div class="flex" :class="t.nameAlign === 'center' ? 'flex-col items-center' : 'items-start gap-5'">
              <div v-if="store.personalInfo.photo" class="flex-shrink-0" :class="t.nameAlign === 'center' ? 'mb-2' : ''">
                <img :src="store.personalInfo.photo" alt="证件照" class="rounded-lg object-cover shadow-sm" :style="{ width: '25mm', height: '35mm' }" />
              </div>
              <div :class="t.nameAlign === 'center' ? '' : 'flex-1 min-w-0'">
                <h1 class="font-bold" :style="nameTextStyle" :class="t.nameAlign === 'center' ? 'text-center' : ''">{{ store.personalInfo.name }}</h1>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm" :class="t.nameAlign === 'center' ? 'justify-center' : ''" :style="{ color: t.contactColor }">
                  <span v-if="store.personalInfo.phone" class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{{ store.personalInfo.phone }}</span>
                  <span v-if="store.personalInfo.email" class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>{{ store.personalInfo.email }}</span>
                  <span v-if="store.personalInfo.location" class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 flex-shrink-0" :style="{ color: t.headingBorderColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{{ store.personalInfo.location }}</span>
                </div>
                <div v-if="store.personalInfo.website || store.personalInfo.github" class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs" :class="t.nameAlign === 'center' ? 'justify-center' : ''" :style="{ color: t.socialColor }">
                  <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
                  <span v-if="store.personalInfo.github">{{ store.personalInfo.github }}</span>
                </div>
                <p v-if="store.personalInfo.summary" class="mt-3 text-sm max-w-2xl relative pl-4" :class="t.nameAlign === 'center' ? 'mx-auto text-center !pl-0' : ''" :style="{ color: t.summaryColor }">
                  <svg v-if="t.nameAlign !== 'center'" class="absolute left-0 top-0.5 w-3 h-3 opacity-40" :style="{ color: t.headingBorderColor }" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/></svg>
                  {{ store.personalInfo.summary }}
                </p>
              </div>
            </div>
          </div>
          <hr v-if="store.personalInfo.name" class="my-3" :style="{ borderColor: t.dividerColor }" />
        </template>

        <!-- ===== 头部样式：banner ===== -->
        <template v-else-if="t.headerStyle === 'banner'">
          <div v-if="store.personalInfo.name" class="mb-4 -mx-3 -mt-1 px-5 py-5 rounded-lg" :style="{ backgroundColor: t.headingBorderColor }">
            <div class="flex items-center gap-4">
              <div v-if="store.personalInfo.photo" class="flex-shrink-0">
                <img :src="store.personalInfo.photo" alt="证件照" class="rounded-full object-cover shadow-lg" :style="{ width: '70px', height: '70px', border: '3px solid white' }" />
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="font-bold text-white" :style="{ fontSize: t.nameSize + 'px', letterSpacing: t.nameTransform === 'wide-spacing' ? '0.15em' : 'normal', textTransform: t.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">{{ store.personalInfo.name }}</h1>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/90">
                  <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
                  <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
                  <span v-if="store.personalInfo.location">{{ store.personalInfo.location }}</span>
                </div>
                <div v-if="store.personalInfo.website || store.personalInfo.github" class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-white/70">
                  <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
                  <span v-if="store.personalInfo.github">{{ store.personalInfo.github }}</span>
                </div>
              </div>
            </div>
            <p v-if="store.personalInfo.summary" class="mt-3 text-sm text-white/85 leading-relaxed">{{ store.personalInfo.summary }}</p>
          </div>
        </template>

        <!-- ===== 头部样式：boxed ===== -->
        <template v-else-if="t.headerStyle === 'boxed'">
          <div v-if="store.personalInfo.name" class="mb-4">
            <div class="border-2 rounded-lg px-5 py-4" :style="{ borderColor: t.headingBorderColor }">
              <div class="flex items-center gap-4">
                <div v-if="store.personalInfo.photo" class="flex-shrink-0">
                  <img :src="store.personalInfo.photo" alt="证件照" class="rounded-lg object-cover shadow-sm" :style="{ width: '60px', height: '80px' }" />
                </div>
                <div class="flex-1 min-w-0">
                  <h1 class="font-bold" :style="nameTextStyle">{{ store.personalInfo.name }}</h1>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm" :style="{ color: t.contactColor }">
                    <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
                    <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
                    <span v-if="store.personalInfo.location">{{ store.personalInfo.location }}</span>
                  </div>
                  <div v-if="store.personalInfo.website || store.personalInfo.github" class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs" :style="{ color: t.socialColor }">
                    <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
                    <span v-if="store.personalInfo.github">{{ store.personalInfo.github }}</span>
                  </div>
                </div>
              </div>
              <p v-if="store.personalInfo.summary" class="mt-3 text-sm pt-3 border-t" :style="{ color: t.summaryColor, borderColor: t.headingBorderColor + '30' }">{{ store.personalInfo.summary }}</p>
            </div>
          </div>
        </template>

        <!-- ===== 头部样式：split ===== -->
        <template v-else-if="t.headerStyle === 'split'">
          <div v-if="store.personalInfo.name" class="mb-4 flex items-stretch gap-5">
            <div v-if="store.personalInfo.photo" class="flex-shrink-0">
              <img :src="store.personalInfo.photo" alt="证件照" class="rounded-lg object-cover" :style="{ width: '25mm', height: '35mm', borderLeft: `4px solid ${t.headingBorderColor}` }" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <h1 class="font-bold" :style="{ ...nameTextStyle, borderLeft: store.personalInfo.photo ? 'none' : `4px solid ${t.headingBorderColor}`, paddingLeft: store.personalInfo.photo ? '0' : '12px' }">{{ store.personalInfo.name }}</h1>
              <div class="w-16 h-0.5 mt-1.5 mb-2" :style="{ backgroundColor: t.headingBorderColor }"></div>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" :style="{ color: t.contactColor }">
                <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
                <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
                <span v-if="store.personalInfo.location">{{ store.personalInfo.location }}</span>
              </div>
              <div v-if="store.personalInfo.website || store.personalInfo.github" class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs" :style="{ color: t.socialColor }">
                <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
                <span v-if="store.personalInfo.github">{{ store.personalInfo.github }}</span>
              </div>
            </div>
          </div>
          <p v-if="store.personalInfo.summary && store.personalInfo.name" class="text-sm mb-3" :style="{ color: t.summaryColor }">{{ store.personalInfo.summary }}</p>
          <hr v-if="store.personalInfo.name" class="my-3" :style="{ borderColor: t.dividerColor }" />
        </template>

        <!-- ===== 头部样式：minimal ===== -->
        <template v-else-if="t.headerStyle === 'minimal'">
          <div v-if="store.personalInfo.name" class="mb-4">
            <h1 class="font-bold" :style="nameTextStyle">{{ store.personalInfo.name }}</h1>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs" :style="{ color: t.contactColor }">
              <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
              <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
              <span v-if="store.personalInfo.location">{{ store.personalInfo.location }}</span>
              <span v-if="store.personalInfo.website">{{ store.personalInfo.website }}</span>
              <span v-if="store.personalInfo.github">{{ store.personalInfo.github }}</span>
            </div>
            <p v-if="store.personalInfo.summary" class="mt-2 text-sm" :style="{ color: t.summaryColor }">{{ store.personalInfo.summary }}</p>
          </div>
          <div v-if="store.personalInfo.name" class="h-1 mb-3" :style="{ backgroundColor: t.dividerColor }"></div>
        </template>

        <!-- ===== 各栏位内容（同类型合并） ===== -->
        <div v-for="group in groupedSections" :key="group.type" class="mb-4">
          <template v-if="t.cardStyle === 'none'">
            <SectionHeading :t="t" :section="group.sections[0]" />
            <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.dividerColor } : {}">
              <SectionBody :t="t" :layout="layout" :section="section" />
            </div>
          </template>
          <template v-else-if="t.cardStyle === 'bordered'">
            <div class="border rounded-lg p-3" :style="{ borderColor: t.headingBorderColor + '30' }">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.headingBorderColor + '20' } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </template>
          <template v-else-if="t.cardStyle === 'shadow'">
            <div class="rounded-lg p-3 shadow-md" :style="{ backgroundColor: t.tagBg }">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.headingBorderColor + '20' } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </template>
          <template v-else-if="t.cardStyle === 'accent-left'">
            <div class="rounded-r-lg p-3" :style="{ borderLeft: `4px solid ${t.headingBorderColor}`, backgroundColor: t.tagBg }">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.headingBorderColor + '20' } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </template>
          <template v-else-if="t.cardStyle === 'tinted'">
            <div class="rounded-lg p-3" :style="{ backgroundColor: t.tagBg }">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.headingBorderColor + '20' } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- ==================== 侧边栏布局 ==================== -->
    <template v-else-if="isSidebar">
      <div class="flex" style="min-height: 297mm;">
        <div class="w-[35%] flex-shrink-0 py-8 px-5" :style="{ backgroundColor: t.sidebarBg, color: t.sidebarColor, padding: `${store.layout.margin_top}mm 5mm ${store.layout.margin_bottom}mm 5mm` }" :class="t.pageLayout === 'sidebar-right' ? 'order-2' : 'order-1'">
          <div v-if="store.personalInfo.photo" class="flex justify-center mb-4">
            <img :src="store.personalInfo.photo" alt="证件照" class="rounded-full object-cover shadow-lg" :style="{ width: '80px', height: '80px', border: `3px solid ${t.sidebarAccentColor}` }" />
          </div>
          <h1 v-if="store.personalInfo.name" class="font-bold text-center mb-4" :style="{ color: t.sidebarHeadingColor, fontSize: t.nameSize + 'px' }">{{ store.personalInfo.name }}</h1>
          <div class="mb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest mb-2" :style="{ color: t.sidebarAccentColor }">联系方式</h3>
            <div class="space-y-1.5 text-xs">
              <div v-if="store.personalInfo.phone" class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0" :style="{ color: t.sidebarAccentColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><span>{{ store.personalInfo.phone }}</span></div>
              <div v-if="store.personalInfo.email" class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0" :style="{ color: t.sidebarAccentColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span>{{ store.personalInfo.email }}</span></div>
              <div v-if="store.personalInfo.location" class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0" :style="{ color: t.sidebarAccentColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span>{{ store.personalInfo.location }}</span></div>
              <div v-if="store.personalInfo.website" class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0" :style="{ color: t.sidebarAccentColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9"/></svg><span>{{ store.personalInfo.website }}</span></div>
              <div v-if="store.personalInfo.github" class="flex items-center gap-2"><svg class="w-3 h-3 flex-shrink-0" :style="{ color: t.sidebarAccentColor }" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg><span>{{ store.personalInfo.github }}</span></div>
            </div>
          </div>
          <div v-for="group in sidebarGrouped" :key="group.type" class="mb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest mb-2" :style="{ color: t.sidebarAccentColor }">{{ group.title }}</h3>
            <template v-if="group.type === 'skill'">
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-2 pt-2 border-t' : ''" :style="idx > 0 ? { borderColor: t.sidebarAccentColor + '30' } : {}">
                <div v-if="section.data.category" class="font-semibold mb-1 text-xs" :style="{ color: t.sidebarHeadingColor }">{{ section.data.category }}</div>
                <div class="flex flex-wrap gap-1">
                  <span v-for="skill in section.data.skills" :key="skill" class="px-2 py-0.5 rounded-full text-[10px]" :style="{ backgroundColor: t.sidebarAccentColor + '25', color: t.sidebarColor, border: `1px solid ${t.sidebarAccentColor}40` }">{{ skill }}</span>
                </div>
              </div>
            </template>
            <template v-else-if="group.type === 'education'">
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-2 pt-2 border-t' : ''" :style="idx > 0 ? { borderColor: t.sidebarAccentColor + '30' } : {}">
                <div class="font-semibold text-xs" :style="{ color: t.sidebarHeadingColor }">{{ section.data.school }}</div>
                <div class="opacity-80 text-xs">{{ section.data.degree }} {{ section.data.major }}</div>
                <div class="opacity-60 text-[10px]">{{ section.data.start_date }} - {{ section.data.end_date || '至今' }}</div>
                <div v-if="section.data.gpa" class="mt-0.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]" :style="{ backgroundColor: t.sidebarAccentColor + '20', color: t.sidebarHeadingColor }">GPA {{ section.data.gpa }}</div>
              </div>
            </template>
          </div>
        </div>
        <div class="flex-1 py-8 px-7" :class="t.pageLayout === 'sidebar-right' ? 'order-1' : 'order-2'" :style="{ padding: `${store.layout.margin_top}mm 7mm ${store.layout.margin_bottom}mm 7mm` }">
          <p v-if="store.personalInfo.summary" class="text-sm mb-5" :style="{ color: t.summaryColor }">{{ store.personalInfo.summary }}</p>
          <div v-for="group in mainGrouped" :key="group.type" class="mb-4">
            <SectionHeading :t="t" :section="group.sections[0]" />
            <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.dividerColor } : {}">
              <SectionBody :t="t" :layout="layout" :section="section" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ==================== 双栏布局 ==================== -->
    <template v-else-if="isTwoCol">
      <div :style="{ padding: `${store.layout.margin_top}mm ${store.layout.margin_right}mm ${store.layout.margin_bottom}mm ${store.layout.margin_left}mm` }">
        <div v-if="store.personalInfo.name" class="mb-4">
          <div class="flex" :class="t.nameAlign === 'center' ? 'flex-col items-center' : 'items-start gap-5'">
            <div v-if="store.personalInfo.photo" class="flex-shrink-0" :class="t.nameAlign === 'center' ? 'mb-2' : ''">
              <img :src="store.personalInfo.photo" alt="证件照" class="rounded-lg object-cover shadow-sm" :style="{ width: '20mm', height: '28mm' }" />
            </div>
            <div :class="t.nameAlign === 'center' ? '' : 'flex-1 min-w-0'">
              <h1 class="font-bold" :style="nameTextStyle" :class="t.nameAlign === 'center' ? 'text-center' : ''">{{ store.personalInfo.name }}</h1>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm" :class="t.nameAlign === 'center' ? 'justify-center' : ''" :style="{ color: t.contactColor }">
                <span v-if="store.personalInfo.phone">{{ store.personalInfo.phone }}</span>
                <span v-if="store.personalInfo.email">{{ store.personalInfo.email }}</span>
                <span v-if="store.personalInfo.location">{{ store.personalInfo.location }}</span>
              </div>
              <p v-if="store.personalInfo.summary" class="mt-2 text-sm" :style="{ color: t.summaryColor }">{{ store.personalInfo.summary }}</p>
            </div>
          </div>
        </div>
        <hr v-if="store.personalInfo.name" class="my-3" :style="{ borderColor: t.dividerColor }" />
        <div class="grid grid-cols-2 gap-x-6">
          <div>
            <div v-for="group in leftColGrouped" :key="group.type" class="mb-4">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.dividerColor } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </div>
          <div>
            <div v-for="group in rightColGrouped" :key="group.type" class="mb-4">
              <SectionHeading :t="t" :section="group.sections[0]" />
              <div v-for="(section, idx) in group.sections" :key="section.id" :class="idx > 0 ? 'mt-3 pt-3 border-t' : ''" :style="idx > 0 ? { borderColor: t.dividerColor } : {}">
                <SectionBody :t="t" :layout="layout" :section="section" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
