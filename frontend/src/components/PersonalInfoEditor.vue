<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'

const store = useResumeStore()
const info = store.personalInfo

function update(field: string, value: string) {
  store.updatePersonalInfo({ [field]: value })
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div>
      <label class="label-text">姓名</label>
      <input :value="info.name" @input="update('name', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="张三" />
    </div>
    <div>
      <label class="label-text">手机号</label>
      <input :value="info.phone" @input="update('phone', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="138-0000-0000" />
    </div>
    <div>
      <label class="label-text">邮箱</label>
      <input :value="info.email" @input="update('email', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="example@email.com" />
    </div>
    <div>
      <label class="label-text">所在地</label>
      <input :value="info.location" @input="update('location', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="北京市" />
    </div>
    <div>
      <label class="label-text">个人网站</label>
      <input :value="info.website" @input="update('website', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="https://example.com" />
    </div>
    <div>
      <label class="label-text">LinkedIn</label>
      <input :value="info.linkedin" @input="update('linkedin', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="linkedin.com/in/..." />
    </div>
    <div>
      <label class="label-text">GitHub</label>
      <input :value="info.github" @input="update('github', ($event.target as HTMLInputElement).value)" class="input-field" placeholder="github.com/..." />
    </div>
    <div class="sm:col-span-2">
      <label class="label-text">个人简介</label>
      <textarea :value="info.summary" @input="update('summary', ($event.target as HTMLTextAreaElement).value)" class="input-field min-h-[80px]" placeholder="用 2-3 句话概括你的核心优势..."></textarea>
    </div>
  </div>
</template>
