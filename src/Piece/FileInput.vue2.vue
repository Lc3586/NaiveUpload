<template>
  <div
    class="upload-btn"
    v-on:click="chosingFile"
    :title="upload?.getSettings().tip"
  >
    <div @click.stop="() => {}">
      <input
        type="file"
        :multiple="(upload?.getConfig().upperLimit ?? 0) > 1"
        :ref="setFileInputRef"
        :accept="upload?.getAllowedTypes()"
        v-on:change="choseFile"
      />
    </div>
    <div class="upload-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ComponentPublicInstance } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";

// 文件选择框引用对象
let fileInputRef: HTMLInputElement;
export default defineComponent({
  name: "Card",
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
      ? console.debug("Piece: File Input Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 设置文件选择框引用对象
     *
     * @param el 引用对象
     */
    setFileInputRef(el: Element | ComponentPublicInstance | null) {
      if (el) fileInputRef = el as HTMLInputElement;
    },

    /**
     * 选择文件
     *
     * @param e
     */
    chosingFile(e: MouseEvent) {
      if ((this.upload as NaiveUpload).limited()) return;

      //隐式触发文件选择事件
      fileInputRef?.click();
    },

    /**
     * 已选择文件
     *
     * @param {any} e
     */
    choseFile(e: Event) {
      if (fileInputRef && fileInputRef.files)
        for (let i = 0; i < fileInputRef.files.length; i++) {
          (this.upload as NaiveUpload).append(fileInputRef.files[i]);
        }

      //清空
      if (fileInputRef) fileInputRef.value = "";
    },
  },
});
</script>
