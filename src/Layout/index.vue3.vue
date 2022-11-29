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

<script setup lang="ts">
import { inject, reactive, ShallowRef, shallowRef } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import Card from "../Layout/Card/index.vue3.vue";
import Detailedly from "../Layout/Detailedly/index.vue3.vue";
import { Layout } from "../Model/Layout";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 渲染数据
 */
let renderData = reactive({
  /**
   * 加载状态
   */
  loading: true,

  /**
   * 当前的主题组件
   */
  currentThemeIndex: null as ShallowRef<any> | null,
});

/**
 * 初始化方法
 */
(async () => {
  const changLayout = (layout?: Layout) => {
    renderData.loading = true;
    switch (layout) {
      case Layout.卡片:
        renderData.currentThemeIndex = shallowRef(Card);
        break;
      case Layout.清单:
        renderData.currentThemeIndex = shallowRef(Detailedly);
        break;
    }
    renderData.loading = false;

    upload.getSettings().debug
      ? console.debug("Layout: Index Component(vue3) 已变更")
      : !1;
  };

  //注册布局变更事件
  upload.registerLayoutChanged(changLayout);

  //初始化布局
  changLayout(upload.getSettings().layout);

  upload.getSettings().debug
    ? console.debug("Layout: Index Component(vue3) 已加载")
    : !1;
})();
</script>
