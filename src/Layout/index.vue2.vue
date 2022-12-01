<template>
  <div v-if="!renderData.loading">
    <component :is="renderData.currentThemeIndex">
      <template #uploadContainer>
        <slot name="uploadContainer"></slot>
      </template>

      <template #listContainer>
        <slot name="listContainer"></slot>
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import CardIndex from "../Layout/Card/index.vue2.vue";
import DetailedlyIndex from "../Layout/Detailedly/index.vue2.vue";
import { Layout } from "../Model/Layout";

export default defineComponent({
  name: "LayoutIndex",
  components: {
    CardIndex,
    DetailedlyIndex,
  },
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
  /**
   * 渲染数据
   */
  data() {
    return {
      renderData: {
        /**
         * 加载状态
         */
        loading: true,

        /**
         * 当前的主题组件
         */
        currentThemeIndex: null as string | null,
      },
    };
  },
  created() {
    const changLayout = (layout?: Layout) => {
      this.renderData.loading = true;
      switch (layout) {
        case Layout.卡片:
          this.renderData.currentThemeIndex = "CardIndex";
          break;
        case Layout.清单:
          this.renderData.currentThemeIndex = "DetailedlyIndex";
          break;
      }
      this.renderData.loading = false;

      this.uploadInstance.getSettings().debug
        ? console.debug("Layout: Index Component(vue2) 已变更")
        : !1;
    };

    //注册布局变更事件
    this.uploadInstance.registerLayoutChanged(changLayout);

    //初始化布局
    changLayout(this.uploadInstance.getSettings().layout);

    this.uploadInstance.getSettings().debug
      ? console.debug("Layout: Index Component(vue2) 已加载")
      : !1;
  },
});
</script>
