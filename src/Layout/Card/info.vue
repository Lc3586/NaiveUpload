<template>
  <div class="item-info">
    <span
      class="single-text-omitted item-name"
      :title="
        props.slotProps.selectedFile.fileType +
        '\r\n' +
        props.slotProps.selectedFile.size +
        '\r\n' +
        props.slotProps.selectedFile.fullname()
      "
      v-html="props.slotProps.selectedFile.fullname()"
      v-if="!props.slotProps.rename.active"
    ></span>
    <input
      class="item-rename-input"
      type="text"
      v-if="props.slotProps.rename.active"
      v-model="props.slotProps.rename.value"
      :ref="props.slotProps.funs.setRenameInputRef"
      v-on:keydown="props.slotProps.funs.renameKeydown($event)"
      v-on:blur="props.slotProps.funs.renameDone()"
    />
  </div>

  <div
    class="item-loading"
    v-if="props.slotProps.loading.show()"
    :style="renderData.lodingStyle()"
    :title="props.slotProps.loading.info()"
  ></div>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, inject, reactive } from "vue";
import NaiveUpload from "../../Core/NaiveUpload";
import SelectedFile from "../../Model/SelectedFile";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 渲染数据
 */
let renderData = reactive({
  /**
   * 选择的文件排序值映射表
   */
  selectedFileSortMap: upload.getSelectedFileSortMap() as Map<number, number>,

  /**
   *加载层样式
   */
  lodingStyle: (): string => {
    return `${
      props.slotProps.selectedFile.checking
        ? upload.getGradientStyle(
            "conic",
            "rgba(255, 236, 201, 0.5)",
            props.slotProps.selectedFile.percent,
            props.slotProps.selectedFile.virtualPercent
          )
        : ""
    } ${
      props.slotProps.selectedFile.uploading
        ? upload.getGradientStyle(
            "conic",
            "rgba(144, 206, 255, 0.5)",
            props.slotProps.selectedFile.percent,
            props.slotProps.selectedFile.virtualPercent
          )
        : ""
    } ${
      props.slotProps.selectedFile.paused
        ? upload.getGradientStyle(
            "conic",
            "rgba(158, 158, 158, 0.5)",
            props.slotProps.selectedFile.percent,
            props.slotProps.selectedFile.virtualPercent
          )
        : ""
    }`;
  },
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
  upload.getSettings().debug
    ? console.debug("Layout: Card Info Component 已加载")
    : !1;
})();
</script>