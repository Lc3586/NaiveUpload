<template>
  <div
    class="upload-btn"
    v-on:click="chosingFile"
    :title="uploadInstance.getSettings().tip"
  >
    <div @click.stop="() => {}">
      <input
        type="file"
        :multiple="(uploadInstance.getConfig().upperLimit ?? 0) > 1"
        ref="fileInputRef"
        :accept="uploadInstance.getAllowedTypes()"
        v-on:change="choseFile"
      />
    </div>
    <div class="upload-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";

export default defineComponent({
  name: "FileInput",
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
     * 文件选择框引用对象
     */
    fileInputRef(): HTMLInputElement {
      return <HTMLInputElement>this.$refs.fileInputRef;
    },
  },
  created() {
    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: File Input Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 选择文件
     *
     * @param e
     */
    chosingFile(e: MouseEvent) {
      if (this.uploadInstance.limited()) return;

      //隐式触发文件选择事件
      this.fileInputRef?.click();
    },

    /**
     * 已选择文件
     *
     * @param {any} e
     */
    choseFile(e: Event) {
      if (this.fileInputRef && this.fileInputRef.files)
        for (let i = 0; i < this.fileInputRef.files.length; i++) {
          this.uploadInstance.append(this.fileInputRef.files[i]);
        }

      //清空
      if (this.fileInputRef) this.fileInputRef.value = "";
    },
  },
});
</script>
