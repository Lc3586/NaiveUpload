<template>
  <div
    :class="upload?.getSelectCLass()"
    v-on:drop="dropFile"
    v-on:dragover="allowDrop"
    :title="upload?.getSelectFileAlarmInfo()"
  >
    <file-input>
      <slot></slot>
    </file-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import FileInput from "../Piece/FileInput.vue2.vue";

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
  // data() {
  //   return {
  //     files: [] as File[],
  //   };
  // },
  // watch: {
  //   files: function (newValue: File[], oldValue: File[]) {
  //     if (newValue != null && newValue.length > 0) {
  //       for (let i = 0; i < newValue.length; i++) {
  //         this.upload.append(newValue[i]);
  //       }
  //       newValue.length = 0;
  //     }
  //   },
  // },
  /**
   * 初始化方法
   */
  setup(props) {},
  created() {
    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Piece: Drop File Input Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 允许拖动/阻止冒泡事件
     *
     * @param {any} e
     */
    allowDrop(e: DragEvent) {
      e.preventDefault();
    },
    /**
     * 拖动文件
     *
     * @param {any} e
     */
    dropFile(e: DragEvent) {
      e.preventDefault();
      if (e.dataTransfer)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          (this.upload as NaiveUpload).append(e.dataTransfer.files[i]);
        }
    },
  },
});
</script>
