<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'

const store = useResumeStore()

function updateLayout(field: string, value: number) {
  store.updateLayout({ [field]: value })
}
</script>

<template>
  <div class="card">
    <h3 class="text-sm font-semibold text-gray-700 mb-4">排版控制</h3>

    <!-- 页面边距 -->
    <div class="space-y-3 mb-4">
      <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide">页面边距 (mm)</h4>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500">上边距: {{ store.layout.margin_top }}</label>
          <input
            type="range"
            :value="store.layout.margin_top"
            @input="updateLayout('margin_top', Number(($event.target as HTMLInputElement).value))"
            min="5" max="50" step="1"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500">下边距: {{ store.layout.margin_bottom }}</label>
          <input
            type="range"
            :value="store.layout.margin_bottom"
            @input="updateLayout('margin_bottom', Number(($event.target as HTMLInputElement).value))"
            min="5" max="50" step="1"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500">左边距: {{ store.layout.margin_left }}</label>
          <input
            type="range"
            :value="store.layout.margin_left"
            @input="updateLayout('margin_left', Number(($event.target as HTMLInputElement).value))"
            min="5" max="50" step="1"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500">右边距: {{ store.layout.margin_right }}</label>
          <input
            type="range"
            :value="store.layout.margin_right"
            @input="updateLayout('margin_right', Number(($event.target as HTMLInputElement).value))"
            min="5" max="50" step="1"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>
    </div>

    <!-- 行间距 & 字间距 -->
    <div class="space-y-3">
      <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide">间距控制</h4>
      <div>
        <label class="text-xs text-gray-500">行间距: {{ store.layout.line_height.toFixed(1) }}</label>
        <input
          type="range"
          :value="store.layout.line_height"
          @input="updateLayout('line_height', Number(($event.target as HTMLInputElement).value))"
          min="1.0" max="2.5" step="0.1"
          class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
      </div>
      <div>
        <label class="text-xs text-gray-500">字间距: {{ store.layout.letter_spacing.toFixed(1) }}px</label>
        <input
          type="range"
          :value="store.layout.letter_spacing"
          @input="updateLayout('letter_spacing', Number(($event.target as HTMLInputElement).value))"
          min="0" max="5" step="0.5"
          class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
      </div>
    </div>
  </div>
</template>
