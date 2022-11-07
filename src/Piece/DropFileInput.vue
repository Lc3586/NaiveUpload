<template>
  <div
    :class="upload.getSelectCLass()"
    v-on:drop="dropFile"
    v-on:dragover="allowDrop"
    :title="upload.getSelectFileAlarmInfo()"
  >
    <file-input>
      <slot></slot>
    </file-input>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import NaiveUpload from "../Core/NaiveUpload";
import FileInput from "../Piece/FileInput.vue";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 允许拖动/阻止冒泡事件
 *
 * @param {any} e
 */
const allowDrop = (e: DragEvent) => {
  e.preventDefault();
};

/**
 * 拖动文件
 *
 * @param {any} e
 */
const dropFile = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer)
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      upload.append(e.dataTransfer.files[i]);
    }
};

/**
 * 初始化方法
 */
(async () => {
  upload.getSettings().debug
    ? console.debug("Piece: Drop File Input Component 已加载")
    : !1;
})();
</script>