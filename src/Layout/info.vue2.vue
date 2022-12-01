<template>
  <div v-if="!renderData.loading">
    <component :is="renderData.currentThemeInfo" :slotProps="slotProps">
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import CardInfo from "../Layout/Card/info.vue2.vue";
import DetailedlyInfo from "../Layout/Detailedly/info.vue2.vue";
import SelectedFile from "../Model/SelectedFile";
import { Layout } from "../Model/Layout";

export default defineComponent({
  name: "LayoutInfo",
  components: {
    CardInfo,
    DetailedlyInfo,
  },
  /**
   * 组件属性
   */
  props: {
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
            el: HTMLInputElement | null
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
        currentThemeInfo: null as string | null,
      },
    };
  },
  created() {
    const changLayout = (layout?: Layout) => {
      this.renderData.loading = true;
      switch (this.uploadInstance.getSettings().layout) {
        case Layout.卡片:
          this.renderData.currentThemeInfo = "CardInfo";
          break;
        case Layout.清单:
          this.renderData.currentThemeInfo = "DetailedlyInfo";
          break;
      }
      this.renderData.loading = false;

      this.uploadInstance.getSettings().debug
        ? console.debug("Layout: Info Component(vue2) 已变更")
        : !1;
    };

    //注册布局变更事件（index中已进行监听）
    // upload.registerLayoutChanged(changLayout);

    //初始化布局
    changLayout();

    this.uploadInstance.getSettings().debug
      ? console.debug("Layout: Info Component(vue2) 已加载")
      : !1;
  },
});
</script>
