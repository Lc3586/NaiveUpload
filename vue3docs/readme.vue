<template>
  <v-md-preview :text="markdownTxt"></v-md-preview>
</template>
<script setup lang="ts">

// 获取props 数据
let props = defineProps({
  markdownTxt: String
}) 
</script>