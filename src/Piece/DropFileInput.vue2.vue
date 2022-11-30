<template>
  <div
    :class="uploadInstance.getSelectCLass()"
    v-on:drop="dropFile"
    v-on:dragover="allowDrop"
    :title="uploadInstance.getSelectFileAlarmInfo()"
  >
    <file-input>
      <slot></slot>
    </file-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import FileInput from "../Piece/FileInput.vue2.vue";

export default defineComponent({
  name: "Card",
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
  created() {
    this.uploadInstance.getSettings().debug
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
          this.uploadInstance.append(e.dataTransfer.files[i]);
        }
    },
  },
});
</script>
