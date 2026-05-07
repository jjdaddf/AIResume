<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { themes, type ThemeConfig } from '@/config/themes'

const store = useResumeStore()

const scrollContainer = ref<HTMLElement | null>(null)
const hoveredThemeId = ref<string | null>(null)
const previewStyle = ref<Record<string, string>>({})

const hoveredTheme = computed(() => {
  if (!hoveredThemeId.value) return null
  return themes.find(t => t.id === hoveredThemeId.value) || null
})

function selectTheme(id: string) {
  store.setTheme(id)
}

function onThumbEnter(theme: ThemeConfig, event: MouseEvent) {
  hoveredThemeId.value = theme.id
  nextTick(() => positionPreview(event))
}

function onThumbMove(event: MouseEvent) {
  positionPreview(event)
}

function onThumbLeave() {
  hoveredThemeId.value = null
}

function positionPreview(event: MouseEvent) {
  const thumb = event.currentTarget as HTMLElement
  const rect = thumb.getBoundingClientRect()
  const previewW = 340
  const previewH = 620

  let left = rect.left + rect.width / 2 - previewW / 2
  let top = rect.bottom + 12

  if (left < 8) left = 8
  if (left + previewW > window.innerWidth - 8) left = window.innerWidth - previewW - 8
  if (top + previewH > window.innerHeight - 8) {
    top = rect.top - previewH - 12
  }

  previewStyle.value = {
    position: 'fixed',
    left: left + 'px',
    top: top + 'px',
    zIndex: '9999',
  }
}

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -240, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 240, behavior: 'smooth' })
}
</script>

<template>
  <div class="theme-selector-wrapper">
    <div class="flex items-center gap-1">
      <button @click="scrollLeft" class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <div ref="scrollContainer" class="flex-1 flex gap-2.5 overflow-x-auto py-1.5 px-0.5 scroll-smooth" style="scrollbar-width: thin; scrollbar-color: #d1d5db transparent;">
        <div
          v-for="t in themes"
          :key="t.id"
          class="flex-shrink-0 cursor-pointer group"
          @mouseenter="onThumbEnter(t, $event)"
          @mousemove="onThumbMove"
          @mouseleave="onThumbLeave"
          @click="selectTheme(t.id)"
        >
          <div
            class="w-[76px] rounded-lg border-2 transition-all duration-200 overflow-hidden"
            :class="store.theme === t.id ? 'shadow-md ring-2 ring-primary-200 scale-105' : 'border-gray-200 hover:border-gray-400 hover:shadow-sm group-hover:scale-105'"
            :style="{ borderColor: store.theme === t.id ? t.headingColor : undefined }"
          >
            <!-- Mini 简历缩略图 -->
            <div class="w-full aspect-[210/297] bg-white overflow-hidden" :style="{ fontFamily: t.fontFamily }">
              <!-- === 侧边栏布局缩略图 === -->
              <template v-if="t.pageLayout === 'sidebar-left' || t.pageLayout === 'sidebar-right'">
                <div class="flex h-full">
                  <div class="w-[35%] p-[3px]" :style="{ backgroundColor: t.sidebarBg, color: t.sidebarColor, order: t.pageLayout === 'sidebar-right' ? 2 : 1 }">
                    <div class="font-bold text-center leading-tight mb-[1px]" :style="{ color: t.sidebarHeadingColor, fontSize: '5px' }">张三</div>
                    <div class="text-[2.5px] text-center mb-[2px]" :style="{ color: t.sidebarAccentColor }">联系方式</div>
                    <div class="text-[2px] space-y-[0.5px]" :style="{ color: t.sidebarColor }">
                      <div>138-0000</div>
                      <div>mail@x.com</div>
                    </div>
                    <div class="mt-[2px] text-[2px] font-bold uppercase tracking-wider" :style="{ color: t.sidebarAccentColor }">技能</div>
                    <div class="flex flex-wrap gap-[0.5px] mt-[1px]">
                      <span v-for="tag in ['React', 'Vue', 'TS']" :key="tag" class="rounded-full px-[1.5px]" style="font-size:1.5px;" :style="{ backgroundColor: t.sidebarAccentColor + '25', color: t.sidebarColor }">{{ tag }}</span>
                    </div>
                  </div>
                  <div class="flex-1 p-[3px]" :style="{ order: t.pageLayout === 'sidebar-right' ? 1 : 2 }">
                    <div class="font-bold leading-tight mb-[1px]" :style="{ color: t.headingColor, fontSize: '5px' }">简介</div>
                    <div class="text-[2px] mb-[2px]" :style="{ color: t.bodyColor }">5年前端开发经验</div>
                    <div class="font-bold leading-tight mb-[1px]" :style="{ color: t.headingColor, fontSize: '5px' }">工作经历</div>
                    <div class="font-semibold text-[3px]" :style="{ color: t.nameColor }">字节跳动</div>
                    <div class="text-[2px]" :style="{ color: t.subtitleColor }">前端工程师</div>
                  </div>
                </div>
              </template>
              <!-- === 双栏布局缩略图 === -->
              <template v-else-if="t.pageLayout === 'two-column'">
                <div class="p-[3px]">
                  <div class="font-bold leading-tight mb-[1px] text-center" :style="{ color: t.nameColor, fontSize: '7px' }">张三</div>
                  <div class="flex justify-center gap-[3px] mb-[1px]" :style="{ color: t.contactColor, fontSize: '3px' }"><span>138</span><span>|</span><span>mail</span></div>
                  <div class="w-full h-[0.5px] mb-[2px]" :style="{ backgroundColor: t.dividerColor }"></div>
                  <div class="grid grid-cols-2 gap-x-[3px]">
                    <div>
                      <div class="font-bold text-[4px] mb-[1px]" :style="{ color: t.headingColor }">工作经历</div>
                      <div class="font-semibold text-[3px]" :style="{ color: t.nameColor }">字节跳动</div>
                      <div class="text-[2px]" :style="{ color: t.bodyColor }">前端工程师</div>
                    </div>
                    <div>
                      <div class="font-bold text-[4px] mb-[1px]" :style="{ color: t.headingColor }">专业技能</div>
                      <div class="flex flex-wrap gap-[0.5px]">
                        <span v-for="tag in ['React', 'Vue', 'TS']" :key="tag" class="rounded-full px-[1.5px]" style="font-size:1.5px;" :style="{ backgroundColor: t.tagBg, color: t.tagColor }">{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- === 单栏布局缩略图 === -->
              <template v-else>
                  <!-- banner 头部缩略图 -->
                  <template v-if="t.headerStyle === 'banner'">
                    <div class="px-[4px] pt-[3px] pb-[2px]" :style="{ backgroundColor: t.headingBorderColor }">
                      <div class="font-bold text-white leading-tight" :style="{ fontSize: '7px' }">张三</div>
                      <div class="flex gap-[2px] mt-[1px] text-white/90" style="font-size:2.5px;"><span>138</span><span>mail</span><span>北京</span></div>
                    </div>
                  </template>
                  <!-- boxed 头部缩略图 -->
                  <template v-else-if="t.headerStyle === 'boxed'">
                    <div class="p-[3px]">
                      <div class="border rounded px-[3px] py-[2px]" :style="{ borderColor: t.headingBorderColor }">
                        <div class="font-bold leading-tight" :style="{ color: t.nameColor, fontSize: '7px' }">张三</div>
                        <div class="flex gap-[2px] mt-[1px]" style="font-size:2.5px;" :style="{ color: t.contactColor }"><span>138</span><span>mail</span></div>
                      </div>
                    </div>
                  </template>
                  <!-- split 头部缩略图 -->
                  <template v-else-if="t.headerStyle === 'split'">
                    <div class="p-[3px] flex gap-[3px] items-center">
                      <div class="w-[1.5px] self-stretch" :style="{ backgroundColor: t.headingBorderColor }"></div>
                      <div>
                        <div class="font-bold leading-tight" :style="{ color: t.nameColor, fontSize: '7px' }">张三</div>
                        <div class="flex gap-[2px] mt-[1px]" style="font-size:2.5px;" :style="{ color: t.contactColor }"><span>138</span><span>mail</span></div>
                      </div>
                    </div>
                  </template>
                  <!-- minimal 头部缩略图 -->
                  <template v-else-if="t.headerStyle === 'minimal'">
                    <div class="px-[4px] pt-[3px]">
                      <div class="font-bold leading-tight" :style="{ color: t.nameColor, fontSize: '7px', textTransform: t.nameTransform === 'uppercase' ? 'uppercase' : 'none', letterSpacing: t.nameTransform === 'wide-spacing' ? '0.1em' : 'normal' }">张三</div>
                      <div class="flex gap-[2px] mt-[0.5px]" style="font-size:2px;" :style="{ color: t.contactColor }"><span>138</span><span>|</span><span>mail</span></div>
                      <div class="h-[1px] mt-[2px]" :style="{ backgroundColor: t.dividerColor }"></div>
                    </div>
                  </template>
                  <!-- simple 头部缩略图 (默认) -->
                  <template v-else>
                    <div class="p-[4px]">
                      <div class="font-bold leading-tight mb-[1px]" :style="{ color: t.nameColor, fontSize: '8px', textAlign: t.nameAlign === 'center' ? 'center' : 'left' }">张三</div>
                      <div class="flex justify-center gap-[2px] mb-[1px]" :style="{ color: t.contactColor, fontSize: '3px' }"><span>138</span><span>|</span><span>mail</span></div>
                      <div class="w-full h-[0.5px] mb-[2px]" :style="{ backgroundColor: t.dividerColor }"></div>
                    </div>
                  </template>

                  <!-- 栏位内容 (带 cardStyle) -->
                  <div class="px-[4px]">
                    <!-- cardStyle 包裹 -->
                    <div :class="t.cardStyle === 'bordered' ? 'border rounded px-[2px] py-[1px] mb-[1px]' : t.cardStyle === 'shadow' ? 'rounded px-[2px] py-[1px] mb-[1px] shadow-sm' : t.cardStyle === 'accent-left' ? 'rounded-r px-[2px] py-[1px] mb-[1px]' : t.cardStyle === 'tinted' ? 'rounded px-[2px] py-[1px] mb-[1px]' : ''" :style="t.cardStyle === 'bordered' ? { borderColor: t.headingBorderColor + '40' } : t.cardStyle === 'shadow' ? { backgroundColor: t.tagBg } : t.cardStyle === 'accent-left' ? { borderLeft: `2px solid ${t.headingBorderColor}`, backgroundColor: t.tagBg } : t.cardStyle === 'tinted' ? { backgroundColor: t.tagBg } : {}">
                      <div class="flex items-center gap-[1px] mb-[1px]">
                        <div v-if="t.headingStyle === 'left-bar'" class="w-[1px] h-[4px] rounded-sm flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }"></div>
                        <div v-if="t.headingStyle === 'dot'" class="w-[2px] h-[2px] rounded-full flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }"></div>
                        <div class="font-bold leading-tight flex-1" :style="{ color: t.headingColor, fontSize: '4.5px', fontWeight: t.headingWeight, borderBottom: t.headingStyle === 'underline' ? `0.5px solid ${t.headingBorderColor}` : 'none' }">工作经历</div>
                      </div>
                      <div class="font-semibold" :style="{ color: t.nameColor, fontSize: '4px' }">字节跳动</div>
                      <div :style="{ color: t.subtitleColor, fontSize: '3px' }">前端工程师</div>
                    </div>

                    <div :class="t.cardStyle === 'bordered' ? 'border rounded px-[2px] py-[1px] mb-[1px]' : t.cardStyle === 'shadow' ? 'rounded px-[2px] py-[1px] mb-[1px] shadow-sm' : t.cardStyle === 'accent-left' ? 'rounded-r px-[2px] py-[1px] mb-[1px]' : t.cardStyle === 'tinted' ? 'rounded px-[2px] py-[1px] mb-[1px]' : ''" :style="t.cardStyle === 'bordered' ? { borderColor: t.headingBorderColor + '40' } : t.cardStyle === 'shadow' ? { backgroundColor: t.tagBg } : t.cardStyle === 'accent-left' ? { borderLeft: `2px solid ${t.headingBorderColor}`, backgroundColor: t.tagBg } : t.cardStyle === 'tinted' ? { backgroundColor: t.tagBg } : {}">
                      <div class="flex items-center gap-[1px] mb-[1px]">
                        <div v-if="t.headingStyle === 'left-bar'" class="w-[1px] h-[4px] rounded-sm flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }"></div>
                        <div v-if="t.headingStyle === 'dot'" class="w-[2px] h-[2px] rounded-full flex-shrink-0" :style="{ backgroundColor: t.headingBorderColor }"></div>
                        <div class="font-bold leading-tight flex-1" :style="{ color: t.headingColor, fontSize: '4.5px', fontWeight: t.headingWeight, borderBottom: t.headingStyle === 'underline' ? `0.5px solid ${t.headingBorderColor}` : 'none' }">教育背景</div>
                      </div>
                      <div class="font-semibold" :style="{ color: t.nameColor, fontSize: '4px' }">北京大学</div>
                      <div :style="{ color: t.bodyColor, fontSize: '3px' }">计算机 · 本科</div>
                    </div>

                    <div v-if="t.sectionLayout.skill === 'tags'" class="flex flex-wrap gap-[0.5px] mt-[1px]">
                      <span v-for="tag in ['React', 'Vue', 'TS']" :key="tag" class="rounded-full" style="padding:0.5px 1.5px;font-size:2px;" :style="{ backgroundColor: t.tagBg, color: t.tagColor }">{{ tag }}</span>
                    </div>
                  </div>
              </template>
            </div>
          </div>

          <div class="text-center mt-1 text-[11px] font-medium truncate w-[76px]" :style="{ color: store.theme === t.id ? t.headingColor : '#6b7280' }">{{ t.name }}</div>
        </div>
      </div>

      <button @click="scrollRight" class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <!-- Hover 预览弹出层 - 展示完整 A4 缩略图 -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="hoveredTheme" :style="previewStyle" class="pointer-events-none">
          <div class="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" style="width: 340px;">
            <!-- A4 纸缩略图容器 -->
            <div class="w-full bg-white overflow-hidden" :style="{ fontFamily: hoveredTheme.fontFamily, aspectRatio: '210/297', padding: '12px 16px' }">

              <!-- === 侧边栏布局预览 === -->
              <template v-if="hoveredTheme.pageLayout === 'sidebar-left' || hoveredTheme.pageLayout === 'sidebar-right'">
                <div class="flex h-full -m-3">
                  <div class="w-[35%] p-3" :style="{ backgroundColor: hoveredTheme.sidebarBg, color: hoveredTheme.sidebarColor, order: hoveredTheme.pageLayout === 'sidebar-right' ? 2 : 1 }">
                    <div class="w-10 h-10 rounded-full mx-auto mb-2" :style="{ backgroundColor: hoveredTheme.sidebarAccentColor + '30', border: `2px solid ${hoveredTheme.sidebarAccentColor}` }"></div>
                    <div class="font-bold text-center text-xs mb-2" :style="{ color: hoveredTheme.sidebarHeadingColor }">张三</div>
                    <div class="text-[8px] font-bold uppercase tracking-widest mb-1" :style="{ color: hoveredTheme.sidebarAccentColor }">联系方式</div>
                    <div class="space-y-0.5 text-[7px] mb-2" :style="{ color: hoveredTheme.sidebarColor }">
                      <div>138-0000-0000</div>
                      <div>zhangsan@email.com</div>
                      <div>北京市</div>
                    </div>
                    <div class="text-[8px] font-bold uppercase tracking-widest mb-1" :style="{ color: hoveredTheme.sidebarAccentColor }">技能</div>
                    <div class="flex flex-wrap gap-0.5">
                      <span v-for="tech in ['React', 'Vue3', 'TS', 'Node']" :key="tech" class="text-[6px] px-1 py-px rounded-full" :style="{ backgroundColor: hoveredTheme.sidebarAccentColor + '25', color: hoveredTheme.sidebarColor }">{{ tech }}</span>
                    </div>
                  </div>
                  <div class="flex-1 p-3" :style="{ order: hoveredTheme.pageLayout === 'sidebar-right' ? 1 : 2 }">
                    <p class="text-[8px] mb-3 leading-relaxed" :style="{ color: hoveredTheme.summaryColor }">5年前端开发经验，精通React/Vue生态</p>
                    <div class="flex items-center gap-1 mb-1">
                      <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">工作经历</h3>
                    </div>
                    <div class="font-semibold text-[8px]" :style="{ color: hoveredTheme.nameColor }">字节跳动</div>
                    <div class="text-[7px]" :style="{ color: hoveredTheme.subtitleColor }">高级前端工程师 · 2019-2022</div>
                    <div class="flex items-center gap-1 mt-2 mb-1">
                      <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">教育背景</h3>
                    </div>
                    <div class="font-semibold text-[8px]" :style="{ color: hoveredTheme.nameColor }">北京大学</div>
                    <div class="text-[7px]" :style="{ color: hoveredTheme.bodyColor }">本科 · 计算机 · GPA 3.8</div>
                  </div>
                </div>
              </template>

              <!-- === 双栏布局预览 === -->
              <template v-else-if="hoveredTheme.pageLayout === 'two-column'">
                <div class="font-bold text-center text-sm mb-1" :style="{ color: hoveredTheme.nameColor, fontSize: hoveredTheme.nameSize + 'px' }">张三</div>
                <div class="flex justify-center gap-2 text-[7px] mb-1" :style="{ color: hoveredTheme.contactColor }"><span>138-0000</span><span>|</span><span>zhangsan@email.com</span></div>
                <div class="w-full h-px mb-2 mt-1" :style="{ backgroundColor: hoveredTheme.dividerColor }"></div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <div class="flex items-center gap-1 mb-1">
                      <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">工作经历</h3>
                    </div>
                    <div class="font-semibold text-[8px]" :style="{ color: hoveredTheme.nameColor }">字节跳动</div>
                    <div class="text-[7px]" :style="{ color: hoveredTheme.subtitleColor }">前端工程师 · 2019-22</div>
                  </div>
                  <div>
                    <div class="flex items-center gap-1 mb-1">
                      <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">专业技能</h3>
                    </div>
                    <div class="flex flex-wrap gap-0.5"><span v-for="tech in ['React', 'Vue3', 'TS']" :key="tech" class="text-[6px] px-1 py-px rounded-full" :style="{ backgroundColor: hoveredTheme.tagBg, color: hoveredTheme.tagColor }">{{ tech }}</span></div>
                  </div>
                </div>
              </template>

              <!-- === 单栏布局预览 - 完整展示 headerStyle + cardStyle === -->
              <template v-else>
                <!-- headerStyle: banner -->
                <template v-if="hoveredTheme.headerStyle === 'banner'">
                  <div class="-mx-4 -mt-3 px-4 py-3 mb-2 rounded-lg" :style="{ backgroundColor: hoveredTheme.headingBorderColor }">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full flex-shrink-0 bg-white/20 border-2 border-white/60"></div>
                      <div>
                        <div class="font-bold text-white text-sm" :style="{ fontSize: (hoveredTheme.nameSize * 0.65) + 'px', letterSpacing: hoveredTheme.nameTransform === 'wide-spacing' ? '0.12em' : 'normal', textTransform: hoveredTheme.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">张三</div>
                        <div class="flex gap-2 mt-0.5 text-[7px] text-white/85"><span>138-0000</span><span>zhangsan@email.com</span><span>北京</span></div>
                      </div>
                    </div>
                    <p class="mt-1.5 text-[7px] text-white/80 leading-relaxed">5年前端开发经验，精通React/Vue生态</p>
                  </div>
                </template>

                <!-- headerStyle: boxed -->
                <template v-else-if="hoveredTheme.headerStyle === 'boxed'">
                  <div class="mb-2">
                    <div class="border-2 rounded-lg px-3 py-2" :style="{ borderColor: hoveredTheme.headingBorderColor }">
                      <div class="font-bold text-sm" :style="{ color: hoveredTheme.nameColor, fontSize: (hoveredTheme.nameSize * 0.65) + 'px', letterSpacing: hoveredTheme.nameTransform === 'wide-spacing' ? '0.12em' : 'normal', textTransform: hoveredTheme.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">张三</div>
                      <div class="flex gap-2 mt-1 text-[7px]" :style="{ color: hoveredTheme.contactColor }"><span>138-0000</span><span>zhangsan@email.com</span></div>
                    </div>
                    <p class="mt-1.5 text-[7px]" :style="{ color: hoveredTheme.summaryColor }">5年前端开发经验，精通React/Vue生态</p>
                  </div>
                  <div class="h-px mb-2" :style="{ backgroundColor: hoveredTheme.dividerColor }"></div>
                </template>

                <!-- headerStyle: split -->
                <template v-else-if="hoveredTheme.headerStyle === 'split'">
                  <div class="mb-2 flex items-stretch gap-3">
                    <div class="w-1 self-stretch rounded-sm" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <div>
                      <div class="font-bold text-sm" :style="{ color: hoveredTheme.nameColor, fontSize: (hoveredTheme.nameSize * 0.65) + 'px', letterSpacing: hoveredTheme.nameTransform === 'wide-spacing' ? '0.12em' : 'normal', textTransform: hoveredTheme.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">张三</div>
                      <div class="w-10 h-0.5 mt-1 mb-1" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                      <div class="flex gap-2 text-[7px]" :style="{ color: hoveredTheme.contactColor }"><span>138-0000</span><span>zhangsan@email.com</span></div>
                    </div>
                  </div>
                  <p class="text-[7px] mb-1.5" :style="{ color: hoveredTheme.summaryColor }">5年前端开发经验，精通React/Vue生态</p>
                  <div class="h-px mb-2" :style="{ backgroundColor: hoveredTheme.dividerColor }"></div>
                </template>

                <!-- headerStyle: minimal -->
                <template v-else-if="hoveredTheme.headerStyle === 'minimal'">
                  <div class="mb-2">
                    <div class="font-bold text-sm" :style="{ color: hoveredTheme.nameColor, fontSize: (hoveredTheme.nameSize * 0.65) + 'px', letterSpacing: hoveredTheme.nameTransform === 'wide-spacing' ? '0.15em' : 'normal', textTransform: hoveredTheme.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">张三</div>
                    <div class="flex gap-1.5 mt-0.5 text-[6px]" :style="{ color: hoveredTheme.contactColor }"><span>138-0000</span><span>|</span><span>zhangsan@email.com</span><span>|</span><span>北京</span></div>
                  </div>
                  <div class="h-1 mb-2" :style="{ backgroundColor: hoveredTheme.dividerColor }"></div>
                </template>

                <!-- headerStyle: simple (默认) -->
                <template v-else>
                  <div class="mb-2">
                    <div class="font-bold text-sm mb-1" :style="{ color: hoveredTheme.nameColor, fontSize: (hoveredTheme.nameSize * 0.65) + 'px', textAlign: hoveredTheme.nameAlign === 'center' ? 'center' : 'left', letterSpacing: hoveredTheme.nameTransform === 'wide-spacing' ? '0.12em' : 'normal', textTransform: hoveredTheme.nameTransform === 'uppercase' ? 'uppercase' : 'none' }">张三</div>
                    <div class="flex gap-2 text-[7px] mb-1" :class="hoveredTheme.nameAlign === 'center' ? 'justify-center' : ''" :style="{ color: hoveredTheme.contactColor }"><span>138-0000</span><span>zhangsan@email.com</span><span>北京</span></div>
                    <p class="text-[7px]" :style="{ color: hoveredTheme.summaryColor, textAlign: hoveredTheme.nameAlign === 'center' ? 'center' : 'left' }">5年前端开发经验，精通React/Vue生态</p>
                  </div>
                  <div class="h-px mb-2" :style="{ backgroundColor: hoveredTheme.dividerColor }"></div>
                </template>

                <!-- 工作经历卡片 -->
                <div :class="hoveredTheme.cardStyle === 'bordered' ? 'border rounded-md p-2 mb-2' : hoveredTheme.cardStyle === 'shadow' ? 'rounded-md p-2 mb-2 shadow-md' : hoveredTheme.cardStyle === 'accent-left' ? 'rounded-r-md p-2 mb-2' : hoveredTheme.cardStyle === 'tinted' ? 'rounded-md p-2 mb-2' : 'mb-2'" :style="hoveredTheme.cardStyle === 'bordered' ? { borderColor: hoveredTheme.headingBorderColor + '40' } : hoveredTheme.cardStyle === 'shadow' ? { backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'accent-left' ? { borderLeft: `3px solid ${hoveredTheme.headingBorderColor}`, backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'tinted' ? { backgroundColor: hoveredTheme.tagBg } : {}">
                  <div class="flex items-center gap-1 mb-1">
                    <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontSize: (hoveredTheme.headingSize * 0.6) + 'px', fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">工作经历</h3>
                  </div>
                  <div class="flex justify-between items-baseline"><span class="font-semibold text-[8px]" :style="{ color: hoveredTheme.nameColor }">字节跳动</span><span class="text-[6px]" :style="{ color: hoveredTheme.dateColor }">2019.07 - 2022.03</span></div>
                  <div class="text-[7px]" :style="{ color: hoveredTheme.subtitleColor }">高级前端工程师</div>
                  <ul class="text-[7px] mt-0.5 space-y-px" :style="{ color: hoveredTheme.bodyColor }">
                    <li class="flex items-start gap-1"><span :style="{ color: hoveredTheme.headingBorderColor }">✓</span>主导性能优化，首屏加载降低40%</li>
                  </ul>
                </div>

                <!-- 教育背景卡片 -->
                <div :class="hoveredTheme.cardStyle === 'bordered' ? 'border rounded-md p-2 mb-2' : hoveredTheme.cardStyle === 'shadow' ? 'rounded-md p-2 mb-2 shadow-md' : hoveredTheme.cardStyle === 'accent-left' ? 'rounded-r-md p-2 mb-2' : hoveredTheme.cardStyle === 'tinted' ? 'rounded-md p-2 mb-2' : 'mb-2'" :style="hoveredTheme.cardStyle === 'bordered' ? { borderColor: hoveredTheme.headingBorderColor + '40' } : hoveredTheme.cardStyle === 'shadow' ? { backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'accent-left' ? { borderLeft: `3px solid ${hoveredTheme.headingBorderColor}`, backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'tinted' ? { backgroundColor: hoveredTheme.tagBg } : {}">
                  <div class="flex items-center gap-1 mb-1">
                    <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontSize: (hoveredTheme.headingSize * 0.6) + 'px', fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">教育背景</h3>
                  </div>
                  <div class="flex justify-between items-baseline"><span class="font-semibold text-[8px]" :style="{ color: hoveredTheme.nameColor }">北京大学</span><span class="text-[6px]" :style="{ color: hoveredTheme.dateColor }">2015.09 - 2019.06</span></div>
                  <div class="text-[7px]" :style="{ color: hoveredTheme.bodyColor }">本科 · 计算机科学与技术 <span :style="{ color: hoveredTheme.headingColor }">GPA 3.8</span></div>
                </div>

                <!-- 技能卡片 -->
                <div :class="hoveredTheme.cardStyle === 'bordered' ? 'border rounded-md p-2' : hoveredTheme.cardStyle === 'shadow' ? 'rounded-md p-2 shadow-md' : hoveredTheme.cardStyle === 'accent-left' ? 'rounded-r-md p-2' : hoveredTheme.cardStyle === 'tinted' ? 'rounded-md p-2' : ''" :style="hoveredTheme.cardStyle === 'bordered' ? { borderColor: hoveredTheme.headingBorderColor + '40' } : hoveredTheme.cardStyle === 'shadow' ? { backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'accent-left' ? { borderLeft: `3px solid ${hoveredTheme.headingBorderColor}`, backgroundColor: hoveredTheme.tagBg } : hoveredTheme.cardStyle === 'tinted' ? { backgroundColor: hoveredTheme.tagBg } : {}">
                  <div class="flex items-center gap-1 mb-1">
                    <div v-if="hoveredTheme.headingStyle === 'left-bar'" class="w-0.5 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <div v-if="hoveredTheme.headingStyle === 'dot'" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: hoveredTheme.headingBorderColor }"></div>
                    <h3 class="font-bold text-[9px] flex-1 pb-px" :style="{ color: hoveredTheme.headingColor, fontSize: (hoveredTheme.headingSize * 0.6) + 'px', fontWeight: hoveredTheme.headingWeight, borderBottom: hoveredTheme.headingStyle === 'underline' ? `1px solid ${hoveredTheme.headingBorderColor}` : 'none' }">专业技能</h3>
                  </div>
                  <div v-if="hoveredTheme.sectionLayout.skill === 'tags'" class="flex flex-wrap gap-1">
                    <span v-for="tech in ['React', 'Vue3', 'TypeScript', 'Webpack', 'Vite']" :key="tech" class="text-[6px] px-1.5 py-px rounded-full" :style="{ backgroundColor: hoveredTheme.tagBg, color: hoveredTheme.tagColor, border: `0.5px solid ${hoveredTheme.headingBorderColor}30` }">{{ tech }}</span>
                  </div>
                  <div v-else-if="hoveredTheme.sectionLayout.skill === 'columns'" class="grid grid-cols-3 gap-x-2 gap-y-0.5">
                    <span v-for="tech in ['React', 'Vue3', 'TypeScript']" :key="tech" class="text-[7px]" :style="{ color: hoveredTheme.bodyColor }">› {{ tech }}</span>
                  </div>
                  <div v-else class="text-[7px]" :style="{ color: hoveredTheme.bodyColor }">React · Vue3 · TypeScript · Webpack · Vite</div>
                </div>
              </template>
            </div>

            <!-- 模板名称和描述 -->
            <div class="px-3 py-1.5 text-center text-xs font-semibold border-t flex items-center justify-center gap-1.5" :style="{ color: hoveredTheme.headingColor, borderColor: hoveredTheme.dividerColor, backgroundColor: hoveredTheme.pageLayout !== 'single' ? hoveredTheme.sidebarBg + '50' : hoveredTheme.tagBg }">
              {{ hoveredTheme.name }}
              <span class="font-normal text-gray-400">— {{ hoveredTheme.description }}</span>
              <span v-if="hoveredTheme.pageLayout !== 'single'" class="text-[10px] px-1.5 py-px rounded-full" :style="{ backgroundColor: hoveredTheme.sidebarAccentColor + '20', color: hoveredTheme.sidebarAccentColor }">
                {{ hoveredTheme.pageLayout === 'sidebar-left' ? '左栏' : hoveredTheme.pageLayout === 'sidebar-right' ? '右栏' : '双栏' }}
              </span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.scroll-smooth::-webkit-scrollbar { height: 4px; }
.scroll-smooth::-webkit-scrollbar-track { background: transparent; }
.scroll-smooth::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 9999px; }
.scroll-smooth::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
</style>
