<template>
  <div class="upload-container independent">
    <slot name="uploadContainer"></slot>

    <div class="upload-list">
      <slot name="listContainer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue-demi";
import NaiveUpload from "../../Core/NaiveUpload";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 初始化方法
 */
(async () => {
  upload.getSettings().debug
    ? console.debug("Layout: Detailedly Index Component(vue3) 已加载")
    : !1;
})();
</script>

<style scoped lang="scss" type="text/scss">
@import "index.vue3.scss";
</style>