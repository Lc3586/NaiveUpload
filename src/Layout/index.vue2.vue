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
import {
  defineComponent,
  PropType,
  reactive,
  ShallowRef,
  shallowRef,
} from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import Card from "../Layout/Card/index.vue2.vue";
import Detailedly from "../Layout/Detailedly/index.vue2.vue";
import { Layout } from "../Model/Layout";

export default defineComponent({
  name: "LayoutIndex",
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
  setup(props) {
    /**
     * 渲染数据
     */
    const renderData = reactive({
      /**
       * 加载状态
       */
      loading: true,

      /**
       * 当前的主题组件
       */
      currentThemeIndex: null as ShallowRef<any> | null,
    });

    return {
      renderData: renderData,
    };
  },
  created() {
    const changLayout = (layout?: Layout) => {
      this.renderData.loading = true;
      switch (layout) {
        case Layout.卡片:
          this.renderData.currentThemeIndex = shallowRef(Card);
          break;
        case Layout.清单:
          this.renderData.currentThemeIndex = shallowRef(Detailedly);
          break;
      }
      this.renderData.loading = false;

      (this.upload as NaiveUpload).getSettings().debug
        ? console.debug("Layout: Index Component(vue2) 已变更")
        : !1;
    };

    //注册布局变更事件
    (this.upload as NaiveUpload).registerLayoutChanged(changLayout);

    //初始化布局
    changLayout((this.upload as NaiveUpload).getSettings().layout);

    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Layout: Index Component(vue2) 已加载")
      : !1;
  },
});
</script>
