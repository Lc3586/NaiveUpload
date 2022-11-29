<template>
  <div class="item-info">
    <span class="single-text-omitted item-name">
      名称：<span
        :title="slotProps?.selectedFile.fullname()"
        v-html="slotProps?.selectedFile.fullname()"
        v-if="!slotProps?.rename.active"
      ></span>
      <input
        class="item-rename-input"
        type="text"
        v-if="slotProps?.rename.value"
        v-model="slotProps.selectedFile.newName"
        :ref="slotProps.funs.setRenameInputRef"
        v-on:keydown="slotProps?.funs.renameKeydown($event)"
        v-on:blur="slotProps?.funs.renameDone()"
      />
    </span>

    <span class="single-text-omitted item-size">
      大小：<span
        :title="slotProps?.selectedFile.size"
        v-html="slotProps?.selectedFile.size"
      ></span>
    </span>

    <span class="single-text-omitted item-filetype">
      类型：<span
        :title="slotProps?.selectedFile.fileType"
        v-html="slotProps?.selectedFile.fileType"
      ></span>
    </span>
  </div>

  <div
    class="item-loading"
    v-if="slotProps?.loadingShow"
    :style="lodingStyle()"
    :title="slotProps.loadingInfo"
  ></div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ComponentPublicInstance,
  reactive,
} from "vue-demi";
import NaiveUpload from "../../Core/NaiveUpload";
import SelectedFile from "../../Model/SelectedFile";

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
       * 选择的文件排序值映射表
       */
      selectedFileSortMap: props.upload?.getSelectedFileSortMap() as Map<
        number,
        number
      >,
    });

    return {
      renderData: renderData,
    };
  },
  created() {
    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Layout: Detailedly Info Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     *加载层样式
     */
    lodingStyle() {
      return `${
        this.slotProps?.selectedFile.checking
          ? this.upload?.getGradientStyle(
              "linear",
              "rgba(255, 236, 201, 0.5)",
              this.slotProps.selectedFile.percent,
              this.slotProps.selectedFile.virtualPercent
            )
          : ""
      } ${
        this.slotProps?.selectedFile.uploading
          ? this.upload?.getGradientStyle(
              "linear",
              "rgba(144, 206, 255, 0.5)",
              this.slotProps.selectedFile.percent,
              this.slotProps.selectedFile.virtualPercent
            )
          : ""
      } ${
        this.slotProps?.selectedFile.paused
          ? this.upload?.getGradientStyle(
              "linear",
              "rgba(158, 158, 158, 0.5)",
              this.slotProps.selectedFile.percent,
              this.slotProps.selectedFile.virtualPercent
            )
          : ""
      }`;
    },
  },
});
</script>
