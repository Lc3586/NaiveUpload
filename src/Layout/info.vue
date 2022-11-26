<template>
  <div v-if="!renderData.loading">
    <component :is="renderData.currentThemeInfo" :slotProps="props.slotProps">
    </component>
  </div>
</template>

<script setup lang="ts">
import {
  ComponentPublicInstance,
  inject,
  reactive,
  ShallowRef,
  shallowRef,
} from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import Card from "../Layout/Card/info.vue";
import Detailedly from "../Layout/Detailedly/info.vue";
import SelectedFile from "../Model/SelectedFile";
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
  currentThemeInfo: null as ShallowRef<any> | null,
});

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 插槽属性
   */
  slotProps: {
    /**
     * 选择的文件
     */
    selectedFile: SelectedFile;

    /**
     * 重命名
     */
    rename: {
      /**
       * 启用/禁用
       */
      enable: () => boolean;

      /**
       * 正在重命名
       */
      active: boolean;

      /**
       * 值
       */
      value: string;
    };

    /**
     * 方法
     */
    funs: {
      /**
       * 设置重命名输入框引用对象
       *
       * @param el 引用对象
       */
      setRenameInputRef: (el: Element | ComponentPublicInstance | null) => void;

      /**
       * 确认重命名
       *
       * @param {any} event
       */
      renameKeydown: (event: KeyboardEvent) => void;

      /**
       * 重命名结束
       */
      renameDone: () => void;
    };

    /**
     * 加载层
     */
    loading: {
      /**
       * 显示/隐藏
       */
      show: () => boolean;

      /**
       * 信息
       */
      info: () => string;
    };
  };
}>();

/**
 * 初始化方法
 */
(async () => {
  const changLayout = (layout?: Layout) => {
    renderData.loading = true;
    switch (upload.getSettings().layout) {
      case Layout.卡片:
        renderData.currentThemeInfo = shallowRef(Card);
        break;
      case Layout.清单:
        renderData.currentThemeInfo = shallowRef(Detailedly);
        break;
    }
    renderData.loading = false;

    upload.getSettings().debug
      ? console.debug("Layout: Info Component 已变更")
      : !1;
  };

  //注册布局变更事件（index中已进行监听）
  // upload.registerLayoutChanged(changLayout);

  //初始化布局
  changLayout();

  upload.getSettings().debug
    ? console.debug("Layout: Info Component 已加载")
    : !1;
})();
</script>