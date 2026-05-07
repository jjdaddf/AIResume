<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { useAuthStore } from '@/stores/auth'
import { themes } from '@/config/themes'

const router = useRouter()
const store = useResumeStore()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const navItems = [
  { name: '简历编辑', path: '/', icon: '✏️' },
  { name: '预览导出', path: '/preview', icon: '👁' },
  { name: 'AI 助手', path: '/ai', icon: '🤖' },
  { name: 'Word 导入', path: '/word-import', icon: '📄' },
]

function navigateTo(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/')">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">AI</span>
          </div>
          <h1 class="text-lg font-bold text-gray-900 hidden sm:block">智能简历平台</h1>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[
              $route.path === item.path
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <span class="mr-1.5">{{ item.icon }}</span>
            {{ item.name }}
          </button>
          <button
            v-if="authStore.isLoggedIn"
            @click="navigateTo('/resumes')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[
              $route.path === '/resumes'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            📋 我的简历
          </button>
        </nav>

        <!-- 右侧操作 -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Theme Switcher -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-500">主题:</label>
            <select
              :value="store.theme"
              @change="store.setTheme(($event.target as HTMLSelectElement).value)"
              class="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>

          <!-- 用户状态 -->
          <template v-if="authStore.isLoggedIn">
            <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div class="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
              </div>
              <span class="text-sm text-gray-600">{{ authStore.user?.username }}</span>
              <button @click="handleLogout" class="text-xs text-gray-400 hover:text-red-500 transition">退出</button>
            </div>
          </template>
          <template v-else>
            <button
              @click="navigateTo('/login')"
              class="px-4 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-200 hover:border-primary-300 rounded-lg transition"
            >登录</button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Nav -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 py-2">
        <button
          v-for="item in navItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          class="block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors"
          :class="[
            $route.path === item.path
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          <span class="mr-2">{{ item.icon }}</span>
          {{ item.name }}
        </button>
        <button
          v-if="authStore.isLoggedIn"
          @click="navigateTo('/resumes')"
          class="block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
        >📋 我的简历</button>
        <div class="px-4 py-2 mt-2 border-t border-gray-100">
          <label class="text-xs text-gray-500">主题:</label>
          <select
            :value="store.theme"
            @change="store.setTheme(($event.target as HTMLSelectElement).value)"
            class="mt-1 block w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
          >
            <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="px-4 py-2 border-t border-gray-100">
          <template v-if="authStore.isLoggedIn">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ authStore.user?.username }}</span>
              <button @click="handleLogout" class="text-xs text-red-500">退出登录</button>
            </div>
          </template>
          <template v-else>
            <button @click="navigateTo('/login')" class="text-sm text-primary-600 font-medium">登录 / 注册</button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
