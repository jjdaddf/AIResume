/**
 * 简历主题配置 - 数据驱动
 * 支持多种页面布局：单栏、左侧边栏、右侧边栏、双栏
 */

export interface ThemeConfig {
  id: string
  name: string
  description: string
  /** 字体族 */
  fontFamily: string
  /** 姓名 - 颜色 */
  nameColor: string
  /** 姓名 - 字号 (px) */
  nameSize: number
  /** 栏位标题 - 颜色 */
  headingColor: string
  /** 栏位标题 - 下边框颜色 */
  headingBorderColor: string
  /** 栏位标题 - 字号 (px) */
  headingSize: number
  /** 分割线颜色 */
  dividerColor: string
  /** 副标题/职位 - 颜色 */
  subtitleColor: string
  /** 技术标签 - 背景色 */
  tagBg: string
  /** 技术标签 - 文字色 */
  tagColor: string
  /** 正文 - 颜色 */
  bodyColor: string
  /** 日期/次要信息 - 颜色 */
  dateColor: string
  /** 联系方式 - 颜色 */
  contactColor: string
  /** 社交链接 - 颜色 */
  socialColor: string
  /** 个人简介 - 颜色 */
  summaryColor: string
  /** 标题装饰样式: 'underline' | 'left-bar' | 'dot' | 'none' */
  headingStyle: 'underline' | 'left-bar' | 'dot' | 'none'
  /** 姓名对齐: 'center' | 'left' */
  nameAlign: 'center' | 'left'
  /** 标题字重 */
  headingWeight: string
  /** 头部区域样式: 'simple' 简洁 | 'banner' 彩色横幅 | 'boxed' 框线包裹 | 'split' 左右分割 | 'minimal' 仅姓名 */
  headerStyle: 'simple' | 'banner' | 'boxed' | 'split' | 'minimal'
  /** 内容卡片样式: 'none' 无 | 'bordered' 边框 | 'shadow' 阴影 | 'accent-left' 左色条 | 'tinted' 浅色底 */
  cardStyle: 'none' | 'bordered' | 'shadow' | 'accent-left' | 'tinted'
  /** 姓名文字变换: 'none' | 'uppercase' | 'wide-spacing' */
  nameTransform: 'none' | 'uppercase' | 'wide-spacing'
  /** 页面布局: 'single' 单栏 | 'sidebar-left' 左侧边栏 | 'sidebar-right' 右侧边栏 | 'two-column' 双栏 */
  pageLayout: 'single' | 'sidebar-left' | 'sidebar-right' | 'two-column'
  /** 侧边栏 - 背景色 */
  sidebarBg: string
  /** 侧边栏 - 文字色 */
  sidebarColor: string
  /** 侧边栏 - 标题色 */
  sidebarHeadingColor: string
  /** 侧边栏 - 强调色/图标色 */
  sidebarAccentColor: string
  /** 栏位内容排版配置 */
  sectionLayout: {
    education: 'classic' | 'card'
    work: 'classic' | 'timeline' | 'compact'
    project: 'classic' | 'featured'
    skill: 'inline' | 'tags' | 'columns'
  }
}

// ==================== 单栏主题 ====================

const singleThemes: ThemeConfig[] = [
  {
    id: 'minimal', name: '极简', description: '简约清爽，适合传统行业',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1a1a1a', nameSize: 24, headingColor: '#333333', headingBorderColor: '#333333',
    headingSize: 13, dividerColor: '#d1d5db', subtitleColor: '#374151',
    tagBg: '#f3f4f6', tagColor: '#4b5563', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f3f4f6', sidebarColor: '#4b5563', sidebarHeadingColor: '#333333', sidebarAccentColor: '#333333',
    sectionLayout: { education: 'classic', work: 'classic', project: 'classic', skill: 'inline' },
  },
  {
    id: 'geek', name: '极客', description: '技术导向，突出技术栈与项目成果',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    nameColor: '#0e7490', nameSize: 24, headingColor: '#0e7490', headingBorderColor: '#06b6d4',
    headingSize: 13, dividerColor: '#22d3ee', subtitleColor: '#0e7490',
    tagBg: '#ecfeff', tagColor: '#0e7490', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#ecfeff', sidebarColor: '#0e7490', sidebarHeadingColor: '#0e7490', sidebarAccentColor: '#06b6d4',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'tags' },
  },
  {
    id: 'business', name: '商务', description: '专业正式，突出业务数据与管理能力',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    nameColor: '#1e3a5f', nameSize: 24, headingColor: '#1e3a5f', headingBorderColor: '#1e3a5f',
    headingSize: 13, dividerColor: '#1e3a5f', subtitleColor: '#1e3a5f',
    tagBg: '#eff6ff', tagColor: '#1e3a5f', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#eff6ff', sidebarColor: '#1e3a5f', sidebarHeadingColor: '#1e3a5f', sidebarAccentColor: '#1e3a5f',
    sectionLayout: { education: 'card', work: 'compact', project: 'classic', skill: 'columns' },
  },
  {
    id: 'elegant', name: '雅致', description: '深棕暖调，文雅知性',
    fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
    nameColor: '#5c3d2e', nameSize: 22, headingColor: '#5c3d2e', headingBorderColor: '#8b6f47',
    headingSize: 13, dividerColor: '#c4a882', subtitleColor: '#6b4c3b',
    tagBg: '#faf5ef', tagColor: '#5c3d2e', bodyColor: '#5a4a3f', dateColor: '#8b7355',
    contactColor: '#8b7355', socialColor: '#b0a08a', summaryColor: '#5a4a3f',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#faf5ef', sidebarColor: '#5c3d2e', sidebarHeadingColor: '#5c3d2e', sidebarAccentColor: '#8b6f47',
    sectionLayout: { education: 'card', work: 'classic', project: 'classic', skill: 'tags' },
  },
  {
    id: 'forest', name: '森林', description: '深绿自然，沉稳内敛',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1b4332', nameSize: 24, headingColor: '#2d6a4f', headingBorderColor: '#40916c',
    headingSize: 13, dividerColor: '#95d5b2', subtitleColor: '#2d6a4f',
    tagBg: '#d8f3dc', tagColor: '#2d6a4f', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#d8f3dc', sidebarColor: '#1b4332', sidebarHeadingColor: '#2d6a4f', sidebarAccentColor: '#40916c',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'columns' },
  },
  {
    id: 'lavender', name: '薰衣草', description: '淡紫柔美，温婉优雅',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#5b21b6', nameSize: 22, headingColor: '#6d28d9', headingBorderColor: '#8b5cf6',
    headingSize: 13, dividerColor: '#c4b5fd', subtitleColor: '#6d28d9',
    tagBg: '#ede9fe', tagColor: '#6d28d9', bodyColor: '#4b5563', dateColor: '#7c7394',
    contactColor: '#7c7394', socialColor: '#a099b0', summaryColor: '#4b5563',
    headingStyle: 'dot', nameAlign: 'center', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#ede9fe', sidebarColor: '#5b21b6', sidebarHeadingColor: '#6d28d9', sidebarAccentColor: '#8b5cf6',
    sectionLayout: { education: 'card', work: 'compact', project: 'classic', skill: 'tags' },
  },
  {
    id: 'sunset', name: '日落', description: '暖橙活力，热情积极',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#9a3412', nameSize: 24, headingColor: '#c2410c', headingBorderColor: '#ea580c',
    headingSize: 13, dividerColor: '#fb923c', subtitleColor: '#c2410c',
    tagBg: '#fff7ed', tagColor: '#c2410c', bodyColor: '#4b5563', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fff7ed', sidebarColor: '#9a3412', sidebarHeadingColor: '#c2410c', sidebarAccentColor: '#ea580c',
    sectionLayout: { education: 'classic', work: 'classic', project: 'featured', skill: 'inline' },
  },
  {
    id: 'midnight', name: '午夜', description: '深蓝宁静，沉稳专业',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1e1b4b', nameSize: 22, headingColor: '#312e81', headingBorderColor: '#4338ca',
    headingSize: 13, dividerColor: '#6366f1', subtitleColor: '#312e81',
    tagBg: '#eef2ff', tagColor: '#312e81', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#eef2ff', sidebarColor: '#1e1b4b', sidebarHeadingColor: '#312e81', sidebarAccentColor: '#4338ca',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'tags' },
  },
  {
    id: 'rose', name: '玫瑰', description: '粉红清新，柔和亲和',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#9d174d', nameSize: 22, headingColor: '#be185d', headingBorderColor: '#ec4899',
    headingSize: 13, dividerColor: '#f9a8d4', subtitleColor: '#be185d',
    tagBg: '#fdf2f8', tagColor: '#be185d', bodyColor: '#4b5563', dateColor: '#9ca3af',
    contactColor: '#9ca3af', socialColor: '#d1d5db', summaryColor: '#4b5563',
    headingStyle: 'dot', nameAlign: 'center', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fdf2f8', sidebarColor: '#9d174d', sidebarHeadingColor: '#be185d', sidebarAccentColor: '#ec4899',
    sectionLayout: { education: 'card', work: 'classic', project: 'classic', skill: 'tags' },
  },
  {
    id: 'slate', name: '石板', description: '冷灰克制，极简理性',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1e293b', nameSize: 22, headingColor: '#334155', headingBorderColor: '#64748b',
    headingSize: 12, dividerColor: '#cbd5e1', subtitleColor: '#334155',
    tagBg: '#f1f5f9', tagColor: '#475569', bodyColor: '#475569', dateColor: '#94a3b8',
    contactColor: '#94a3b8', socialColor: '#cbd5e1', summaryColor: '#475569',
    headingStyle: 'underline', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f1f5f9', sidebarColor: '#1e293b', sidebarHeadingColor: '#334155', sidebarAccentColor: '#64748b',
    sectionLayout: { education: 'classic', work: 'compact', project: 'featured', skill: 'columns' },
  },
  {
    id: 'teal', name: '青碧', description: '青绿清新，稳重现代',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#134e4a', nameSize: 24, headingColor: '#0f766e', headingBorderColor: '#14b8a6',
    headingSize: 13, dividerColor: '#5eead4', subtitleColor: '#0f766e',
    tagBg: '#f0fdfa', tagColor: '#0f766e', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f0fdfa', sidebarColor: '#134e4a', sidebarHeadingColor: '#0f766e', sidebarAccentColor: '#14b8a6',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'classic', skill: 'tags' },
  },
  {
    id: 'wine', name: '红酒', description: '深红醇厚，典雅尊贵',
    fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
    nameColor: '#7f1d1d', nameSize: 22, headingColor: '#991b1b', headingBorderColor: '#b91c1c',
    headingSize: 13, dividerColor: '#dc2626', subtitleColor: '#991b1b',
    tagBg: '#fef2f2', tagColor: '#991b1b', bodyColor: '#4b5563', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fef2f2', sidebarColor: '#7f1d1d', sidebarHeadingColor: '#991b1b', sidebarAccentColor: '#b91c1c',
    sectionLayout: { education: 'card', work: 'classic', project: 'classic', skill: 'inline' },
  },
  {
    id: 'ocean', name: '海洋', description: '蔚蓝宽广，开放包容',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#0c4a6e', nameSize: 24, headingColor: '#0369a1', headingBorderColor: '#0284c7',
    headingSize: 13, dividerColor: '#38bdf8', subtitleColor: '#0369a1',
    tagBg: '#f0f9ff', tagColor: '#0369a1', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f0f9ff', sidebarColor: '#0c4a6e', sidebarHeadingColor: '#0369a1', sidebarAccentColor: '#0284c7',
    sectionLayout: { education: 'classic', work: 'compact', project: 'featured', skill: 'tags' },
  },
  {
    id: 'moss', name: '苔藓', description: '橄榄沉稳，低调内敛',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#3f6212', nameSize: 22, headingColor: '#4d7c0f', headingBorderColor: '#65a30d',
    headingSize: 13, dividerColor: '#a3e635', subtitleColor: '#4d7c0f',
    tagBg: '#f7fee7', tagColor: '#4d7c0f', bodyColor: '#4b5563', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#4b5563',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f7fee7', sidebarColor: '#3f6212', sidebarHeadingColor: '#4d7c0f', sidebarAccentColor: '#65a30d',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'classic', skill: 'columns' },
  },
  {
    id: 'graphite', name: '石墨', description: '深灰坚毅，力量感强',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#0f0f0f', nameSize: 24, headingColor: '#262626', headingBorderColor: '#404040',
    headingSize: 13, dividerColor: '#525252', subtitleColor: '#262626',
    tagBg: '#f5f5f5', tagColor: '#404040', bodyColor: '#525252', dateColor: '#737373',
    contactColor: '#737373', socialColor: '#a3a3a3', summaryColor: '#525252',
    headingStyle: 'underline', nameAlign: 'left', headingWeight: '800',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f5f5f5', sidebarColor: '#0f0f0f', sidebarHeadingColor: '#262626', sidebarAccentColor: '#404040',
    sectionLayout: { education: 'classic', work: 'compact', project: 'featured', skill: 'tags' },
  },
  {
    id: 'coral', name: '珊瑚', description: '珊瑚暖色，亲切活泼',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#9f1239', nameSize: 22, headingColor: '#be123c', headingBorderColor: '#e11d48',
    headingSize: 13, dividerColor: '#fb7185', subtitleColor: '#be123c',
    tagBg: '#fff1f2', tagColor: '#be123c', bodyColor: '#4b5563', dateColor: '#9ca3af',
    contactColor: '#9ca3af', socialColor: '#d1d5db', summaryColor: '#4b5563',
    headingStyle: 'dot', nameAlign: 'center', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fff1f2', sidebarColor: '#9f1239', sidebarHeadingColor: '#be123c', sidebarAccentColor: '#e11d48',
    sectionLayout: { education: 'card', work: 'classic', project: 'featured', skill: 'tags' },
  },
  {
    id: 'indigo', name: '靛青', description: '靛蓝深邃，智慧沉稳',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#312e81', nameSize: 22, headingColor: '#3730a3', headingBorderColor: '#4f46e5',
    headingSize: 13, dividerColor: '#818cf8', subtitleColor: '#3730a3',
    tagBg: '#eef2ff', tagColor: '#3730a3', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#eef2ff', sidebarColor: '#312e81', sidebarHeadingColor: '#3730a3', sidebarAccentColor: '#4f46e5',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'classic', skill: 'columns' },
  },
  {
    id: 'sand', name: '沙漠', description: '沙漠暖调，朴实务实',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#78350f', nameSize: 22, headingColor: '#92400e', headingBorderColor: '#b45309',
    headingSize: 13, dividerColor: '#d97706', subtitleColor: '#92400e',
    tagBg: '#fffbeb', tagColor: '#92400e', bodyColor: '#57534e', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#57534e',
    headingStyle: 'underline', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fffbeb', sidebarColor: '#78350f', sidebarHeadingColor: '#92400e', sidebarAccentColor: '#b45309',
    sectionLayout: { education: 'card', work: 'compact', project: 'featured', skill: 'inline' },
  },
  {
    id: 'mist', name: '薄雾', description: '淡蓝轻盈，清透明快',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1e40af', nameSize: 22, headingColor: '#2563eb', headingBorderColor: '#60a5fa',
    headingSize: 13, dividerColor: '#93c5fd', subtitleColor: '#2563eb',
    tagBg: '#eff6ff', tagColor: '#2563eb', bodyColor: '#64748b', dateColor: '#94a3b8',
    contactColor: '#94a3b8', socialColor: '#cbd5e1', summaryColor: '#64748b',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#eff6ff', sidebarColor: '#1e40af', sidebarHeadingColor: '#2563eb', sidebarAccentColor: '#60a5fa',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'tags' },
  },
  {
    id: 'charcoal', name: '炭黑', description: '深黑硬朗，极致对比',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#000000', nameSize: 24, headingColor: '#111827', headingBorderColor: '#111827',
    headingSize: 12, dividerColor: '#374151', subtitleColor: '#111827',
    tagBg: '#f9fafb', tagColor: '#374151', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#6b7280', socialColor: '#9ca3af', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'left', headingWeight: '800',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f9fafb', sidebarColor: '#000000', sidebarHeadingColor: '#111827', sidebarAccentColor: '#111827',
    sectionLayout: { education: 'classic', work: 'compact', project: 'featured', skill: 'columns' },
  },
  {
    id: 'sage', name: '鼠尾草', description: '灰绿淡雅，柔和中性',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#3f6212', nameSize: 22, headingColor: '#4d7c0f', headingBorderColor: '#84cc16',
    headingSize: 13, dividerColor: '#bef264', subtitleColor: '#4d7c0f',
    tagBg: '#f7fee7', tagColor: '#4d7c0f', bodyColor: '#57534e', dateColor: '#a8a29e',
    contactColor: '#a8a29e', socialColor: '#d6d3d1', summaryColor: '#57534e',
    headingStyle: 'dot', nameAlign: 'center', headingWeight: '600',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f7fee7', sidebarColor: '#3f6212', sidebarHeadingColor: '#4d7c0f', sidebarAccentColor: '#84cc16',
    sectionLayout: { education: 'card', work: 'classic', project: 'classic', skill: 'tags' },
  },
  {
    id: 'plum', name: '梅紫', description: '紫梅端庄，沉稳雅致',
    fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
    nameColor: '#581c87', nameSize: 22, headingColor: '#6b21a8', headingBorderColor: '#7c3aed',
    headingSize: 13, dividerColor: '#a78bfa', subtitleColor: '#6b21a8',
    tagBg: '#faf5ff', tagColor: '#6b21a8', bodyColor: '#4b5563', dateColor: '#7c7394',
    contactColor: '#7c7394', socialColor: '#a099b0', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#faf5ff', sidebarColor: '#581c87', sidebarHeadingColor: '#6b21a8', sidebarAccentColor: '#7c3aed',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'inline' },
  },
  {
    id: 'copper', name: '紫铜', description: '铜金复古，成熟稳重',
    fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
    nameColor: '#7c2d12', nameSize: 22, headingColor: '#9a3412', headingBorderColor: '#b45309',
    headingSize: 13, dividerColor: '#d97706', subtitleColor: '#9a3412',
    tagBg: '#fff7ed', tagColor: '#9a3412', bodyColor: '#57534e', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#57534e',
    headingStyle: 'left-bar', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fff7ed', sidebarColor: '#7c2d12', sidebarHeadingColor: '#9a3412', sidebarAccentColor: '#b45309',
    sectionLayout: { education: 'card', work: 'compact', project: 'featured', skill: 'columns' },
  },
  {
    id: 'ice', name: '冰川', description: '冰蓝极简，冷静理性',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#0c4a6e', nameSize: 22, headingColor: '#0284c7', headingBorderColor: '#0ea5e9',
    headingSize: 12, dividerColor: '#7dd3fc', subtitleColor: '#0284c7',
    tagBg: '#f0f9ff', tagColor: '#0284c7', bodyColor: '#64748b', dateColor: '#94a3b8',
    contactColor: '#94a3b8', socialColor: '#cbd5e1', summaryColor: '#64748b',
    headingStyle: 'none', nameAlign: 'left', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#f0f9ff', sidebarColor: '#0c4a6e', sidebarHeadingColor: '#0284c7', sidebarAccentColor: '#0ea5e9',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'tags' },
  },
  {
    id: 'maple', name: '枫叶', description: '枫红秋意，温暖大方',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#9a3412', nameSize: 22, headingColor: '#c2410c', headingBorderColor: '#dc2626',
    headingSize: 13, dividerColor: '#f87171', subtitleColor: '#c2410c',
    tagBg: '#fef2f2', tagColor: '#b91c1c', bodyColor: '#4b5563', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    headerStyle: 'simple', cardStyle: 'none', nameTransform: 'none',
    pageLayout: 'single', sidebarBg: '#fef2f2', sidebarColor: '#9a3412', sidebarHeadingColor: '#c2410c', sidebarAccentColor: '#dc2626',
    sectionLayout: { education: 'card', work: 'classic', project: 'featured', skill: 'inline' },
  },
]

// ==================== 侧边栏/双栏布局主题 ====================

const layoutThemes: ThemeConfig[] = [
  {
    id: 'navy-sidebar', name: '深海侧栏', description: '深蓝侧栏，沉稳大气',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#1e3a5f', headingBorderColor: '#1e3a5f',
    headingSize: 13, dividerColor: '#e2e8f0', subtitleColor: '#1e3a5f',
    tagBg: '#eff6ff', tagColor: '#1e3a5f', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#94a3b8', socialColor: '#cbd5e1', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-left', sidebarBg: '#1e3a5f', sidebarColor: '#cbd5e1', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#60a5fa',
    sectionLayout: { education: 'card', work: 'timeline', project: 'featured', skill: 'tags' },
  },
  {
    id: 'emerald-sidebar', name: '翡翠侧栏', description: '翠绿侧栏，清新自然',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#065f46', headingBorderColor: '#065f46',
    headingSize: 13, dividerColor: '#d1fae5', subtitleColor: '#065f46',
    tagBg: '#ecfdf5', tagColor: '#065f46', bodyColor: '#374151', dateColor: '#6b7280',
    contactColor: '#a7f3d0', socialColor: '#d1fae5', summaryColor: '#374151',
    headingStyle: 'left-bar', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-left', sidebarBg: '#065f46', sidebarColor: '#d1fae5', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#34d399',
    sectionLayout: { education: 'classic', work: 'classic', project: 'classic', skill: 'columns' },
  },
  {
    id: 'burgundy-sidebar', name: '酒红侧栏', description: '酒红侧栏，典雅高贵',
    fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#881337', headingBorderColor: '#881337',
    headingSize: 13, dividerColor: '#fecdd3', subtitleColor: '#881337',
    tagBg: '#fff1f2', tagColor: '#881337', bodyColor: '#374151', dateColor: '#78716c',
    contactColor: '#fda4af', socialColor: '#fecdd3', summaryColor: '#374151',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-left', sidebarBg: '#881337', sidebarColor: '#fecdd3', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#fb7185',
    sectionLayout: { education: 'card', work: 'compact', project: 'featured', skill: 'tags' },
  },
  {
    id: 'obsidian-sidebar', name: '黑曜侧栏', description: '深黑侧栏，极致专业',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#111827', headingBorderColor: '#374151',
    headingSize: 13, dividerColor: '#e5e7eb', subtitleColor: '#111827',
    tagBg: '#f3f4f6', tagColor: '#374151', bodyColor: '#4b5563', dateColor: '#6b7280',
    contactColor: '#9ca3af', socialColor: '#d1d5db', summaryColor: '#4b5563',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-left', sidebarBg: '#111827', sidebarColor: '#d1d5db', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#f59e0b',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'columns' },
  },
  {
    id: 'violet-sidebar', name: '紫罗兰侧栏', description: '紫色侧栏，神秘优雅',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#6d28d9', headingBorderColor: '#7c3aed',
    headingSize: 13, dividerColor: '#e9d5ff', subtitleColor: '#6d28d9',
    tagBg: '#f5f3ff', tagColor: '#6d28d9', bodyColor: '#374151', dateColor: '#6b7280',
    contactColor: '#c4b5fd', socialColor: '#e9d5ff', summaryColor: '#374151',
    headingStyle: 'dot', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-right', sidebarBg: '#5b21b6', sidebarColor: '#e9d5ff', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#a78bfa',
    sectionLayout: { education: 'card', work: 'compact', project: 'classic', skill: 'tags' },
  },
  {
    id: 'teal-sidebar', name: '青碧侧栏', description: '青绿侧栏，现代科技',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#ffffff', nameSize: 22, headingColor: '#0f766e', headingBorderColor: '#0f766e',
    headingSize: 13, dividerColor: '#99f6e4', subtitleColor: '#0f766e',
    tagBg: '#f0fdfa', tagColor: '#0f766e', bodyColor: '#374151', dateColor: '#6b7280',
    contactColor: '#5eead4', socialColor: '#99f6e4', summaryColor: '#374151',
    headingStyle: 'left-bar', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'sidebar-right', sidebarBg: '#134e4a', sidebarColor: '#ccfbf1', sidebarHeadingColor: '#ffffff', sidebarAccentColor: '#2dd4bf',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'featured', skill: 'columns' },
  },
  {
    id: 'amber-twocol', name: '琥珀双栏', description: '暖金双栏，均衡大方',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#78350f', nameSize: 24, headingColor: '#92400e', headingBorderColor: '#d97706',
    headingSize: 13, dividerColor: '#fbbf24', subtitleColor: '#92400e',
    tagBg: '#fffbeb', tagColor: '#92400e', bodyColor: '#57534e', dateColor: '#78716c',
    contactColor: '#78716c', socialColor: '#a8a29e', summaryColor: '#57534e',
    headingStyle: 'underline', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'two-column', sidebarBg: '#fffbeb', sidebarColor: '#92400e', sidebarHeadingColor: '#92400e', sidebarAccentColor: '#d97706',
    sectionLayout: { education: 'card', work: 'compact', project: 'featured', skill: 'tags' },
  },
  {
    id: 'slate-twocol', name: '石板双栏', description: '冷灰双栏，简洁理性',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameColor: '#1e293b', nameSize: 24, headingColor: '#334155', headingBorderColor: '#64748b',
    headingSize: 13, dividerColor: '#94a3b8', subtitleColor: '#334155',
    tagBg: '#f1f5f9', tagColor: '#475569', bodyColor: '#475569', dateColor: '#94a3b8',
    contactColor: '#94a3b8', socialColor: '#cbd5e1', summaryColor: '#475569',
    headingStyle: 'left-bar', nameAlign: 'center', headingWeight: '700',
    pageLayout: 'two-column', sidebarBg: '#f1f5f9', sidebarColor: '#334155', sidebarHeadingColor: '#334155', sidebarAccentColor: '#64748b',
    sectionLayout: { education: 'classic', work: 'timeline', project: 'classic', skill: 'columns' },
  },
]

export const themes: ThemeConfig[] = [...singleThemes, ...layoutThemes]

/** 通过 ID 获取主题配置 */
export function getThemeConfig(id: string): ThemeConfig {
  return themes.find(t => t.id === id) || themes[0]
}

/** 所有主题 ID */
export type ThemeId = typeof themes[number]['id']
