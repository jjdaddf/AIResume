<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const email = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (isLogin.value) {
      await authStore.login(username.value, password.value)
    } else {
      await authStore.register(username.value, password.value, email.value || undefined)
    }
    const redirect = (route.query.redirect as string) || '/resumes'
    router.push(redirect)
  } catch (err: any) {
    const msg = err.response?.data?.detail || err.message || '操作失败'
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 cursor-pointer mb-3" @click="router.push('/')">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">AI</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">AI Resume</h1>
        <p class="text-gray-500 mt-1">智能简历生成与优化平台</p>
      </div>

      <!-- 表单卡片 -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Tab 切换 -->
        <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            @click="isLogin = true"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            :class="isLogin ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'"
          >登录</button>
          <button
            @click="isLogin = false"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            :class="!isLogin ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'"
          >注册</button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              v-model="username"
              type="text"
              required
              minlength="3"
              placeholder="请输入用户名"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 <span class="text-gray-400">（选填）</span></label>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="请输入密码（至少6位）"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '处理中...' : (isLogin ? '登 录' : '注 册') }}
          </button>
        </form>
      </div>

      <p class="text-center text-gray-400 text-xs mt-6">无需登录也可使用编辑器，登录后可保存简历</p>
    </div>
  </div>
</template>
