<template>
  <div class="upload-container independent">
    <slot name="uploadContainer"></slot>

    <div class="upload-list">
      <slot name="listContainer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../../Core/NaiveUpload";

export default defineComponent({
  name: "Detailedly",
  /**
   * 组件属性
   */
  props: {
    /**
     * 文件上传工具实例
     */
    upload: {
      type: Object as PropType<NaiveUpload>,
      default() {
        return (this as any).upload;
      },
      require: false,
    },
  },
  inject: [
    /**
     * 注入文件上传工具实例
     */
    "upload",
  ],
  /**
   * 初始化方法
   */
  setup(props) {},
  created() {
    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Layout: Detailedly Index Component(vue2) 已加载")
      : !1;
  },
});
</script>

<style scoped lang="scss" type="text/scss">
@import "index.scss";
</style>
