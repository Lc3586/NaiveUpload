<template>
  <div v-if="!renderData.loading">
    <component :is="renderData.currentThemeInfo" :slotProps="slotProps">
    </component>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ComponentPublicInstance,
  reactive,
  ShallowRef,
  shallowRef,
} from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import Card from "../Layout/Card/info.vue2.vue";
import Detailedly from "../Layout/Detailedly/info.vue2.vue";
import SelectedFile from "../Model/SelectedFile";
import { Layout } from "../Model/Layout";

export default defineComponent({
  name: "LayoutInfo",
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
    /**
     * 插槽属性
     */
    slotProps: {
      type: Object as PropType<{
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
          setRenameInputRef: (
            el: Element | ComponentPublicInstance | null
          ) => void;

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
         * 显示/隐藏 加载层
         */
        loadingShow: boolean;

        /**
         * 加载层信息
         */
        loadingInfo: string;
      }>,
      require: true,
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
      currentThemeInfo: null as ShallowRef<any> | null,
    });

    return {
      renderData: renderData,
    };
  },
  created() {
    const changLayout = (layout?: Layout) => {
      this.renderData.loading = true;
      switch ((this.upload as NaiveUpload).getSettings().layout) {
        case Layout.卡片:
          this.renderData.currentThemeInfo = shallowRef(Card);
          break;
        case Layout.清单:
          this.renderData.currentThemeInfo = shallowRef(Detailedly);
          break;
      }
      this.renderData.loading = false;

      (this.upload as NaiveUpload).getSettings().debug
        ? console.debug("Layout: Info Component(vue2) 已变更")
        : !1;
    };

    //注册布局变更事件（index中已进行监听）
    // upload.registerLayoutChanged(changLayout);

    //初始化布局
    changLayout();

    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Layout: Info Component(vue2) 已加载")
      : !1;
  },
});
</script>
