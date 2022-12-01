<template>
  <div>
    <div class="item-info">
      <span
        class="single-text-omitted item-name"
        :title="
          slotProps?.selectedFile.fileType +
          '\r\n' +
          slotProps?.selectedFile.size +
          '\r\n' +
          slotProps?.selectedFile.fullname()
        "
        v-html="slotProps?.selectedFile.fullname()"
        v-if="!slotProps?.rename.active"
      ></span>
      <input
        class="item-rename-input"
        type="text"
        v-if="slotProps?.rename.active"
        v-model="slotProps.rename.value"
        ref="renameInputRef"
        v-on:keydown="slotProps?.funs.renameKeydown($event)"
        v-on:blur="slotProps?.funs.renameDone()"
      />
    </div>

    <div
      class="item-loading"
      v-if="slotProps?.loadingShow"
      :style="lodingStyle"
      :title="slotProps.loadingInfo"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../../Core/NaiveUpload";
import SelectedFile from "../../Model/SelectedFile";

export default defineComponent({
  name: "CardInfo",
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
          setRenameInputRef: (el: HTMLInputElement | null) => void;

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
    /**
     * 选择的文件排序值映射表
     */
    selectedFileSortMap(): Map<number, number> {
      return this.uploadInstance.getSelectedFileSortMap();
    },
    /**
     *加载层样式
     */
    lodingStyle(): Array<Record<string, string>> {
      return (
        this.slotProps?.selectedFile.checking
          ? [
              this.uploadInstance.getGradientStyleObject(
                "conic",
                "rgba(255, 236, 201, 0.5)",
                this.slotProps.selectedFile.percent,
                this.slotProps.selectedFile.virtualPercent
              )[0],
            ]
          : []
      )
        .concat(
          this.slotProps?.selectedFile.uploading
            ? [
                this.uploadInstance.getGradientStyleObject(
                  "conic",
                  "rgba(144, 206, 255, 0.5)",
                  this.slotProps.selectedFile.percent,
                  this.slotProps.selectedFile.virtualPercent
                )[0],
              ]
            : []
        )
        .concat(
          this.slotProps?.selectedFile.paused
            ? [
                this.uploadInstance.getGradientStyleObject(
                  "conic",
                  "rgba(158, 158, 158, 0.5)",
                  this.slotProps.selectedFile.percent,
                  this.slotProps.selectedFile.virtualPercent
                )[0],
              ]
            : []
        );
    },
  },
  created() {
    this.$nextTick(() => {
      this.slotProps?.funs.setRenameInputRef(
        <HTMLInputElement>this.$refs.renameInputRef
      );
    });

    console.warn(this.slotProps);

    this.uploadInstance.getSettings().debug
      ? console.debug("Layout: Card Info Component(vue2) 已加载")
      : !1;
  },
});
</script>
