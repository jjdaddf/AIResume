import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/resumes',
      name: 'resumes',
      component: () => import('@/views/ResumeList.vue'),
      meta: { auth: true },
    },
    {
      path: '/',
      name: 'editor',
      component: () => import('@/views/ResumeEditor.vue'),
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/ResumePreview.vue'),
    },
    {
      path: '/ai',
      name: 'ai-assistant',
      component: () => import('@/views/AIAssistant.vue'),
    },
    {
      path: '/word-import',
      name: 'word-import',
      component: () => import('@/views/WordImport.vue'),
    },
  ],
})

// 导航守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 需要登录但未登录 → 跳转登录
  if (to.meta.auth && !authStore.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 已登录访问登录页 → 跳转简历列表
  if (to.meta.guest && authStore.isLoggedIn) {
    return next({ name: 'resumes' })
  }

  next()
})

export default router
