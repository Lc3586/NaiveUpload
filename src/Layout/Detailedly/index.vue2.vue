<template>
  <div class="upload-container independent">
    <slot name="uploadContainer"></slot>

    <div class="upload-list">
      <slot name="listContainer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import NaiveUpload from "../../Core/NaiveUpload";

export default defineComponent({
  name: "Detailedly",
  inject: [
    /**
     * 注入文件上传工具实例
     */
    "upload",
  ],
  computed: {
    /**
     * 文件上传工具实例
     */
    uploadInstance(): NaiveUpload {
      return <NaiveUpload>(<any>this).upload();
    },
  },
  created() {
    this.uploadInstance.getSettings().debug
      ? console.debug("Layout: Detailedly Index Component(vue2) 已加载")
      : !1;
  },
});
</script>

<style scoped lang="scss" type="text/scss">
@import "index.scss";
</style>
