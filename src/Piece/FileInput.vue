<template>
  <div
    class="upload-btn"
    v-on:click="chosingFile"
    :title="upload.getSettings().tip"
  >
    <div @click.stop="() => {}">
      <input
        type="file"
        :multiple="upload.getConfig().upperLimit > 1"
        :ref="setFileInputRef"
        :accept="upload.getAllowedTypes()"
        v-on:change="choseFile"
      />
    </div>
    <div class="upload-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, inject, reactive } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 渲染数据
 */
let renderData = reactive({});

// 文件选择框引用对象
let fileInputRef: HTMLInputElement;

/**
 * 设置文件选择框引用对象
 *
 * @param el 引用对象
 */
const setFileInputRef = (el: Element | ComponentPublicInstance | null) => {
  if (el) fileInputRef = el as HTMLInputElement;
};

/**
 * 选择文件
 *
 * @param e
 */
const chosingFile = (e: MouseEvent) => {
  if (upload.limited()) return;

  //隐式触发文件选择事件
  fileInputRef?.click();
};

/**
 * 已选择文件
 *
 * @param {any} e
 */
const choseFile = (e: Event) => {
  if (fileInputRef && fileInputRef.files)
    for (let i = 0; i < fileInputRef.files.length; i++) {
      upload.append(fileInputRef.files[i]);
    }

  //清空
  if (fileInputRef) fileInputRef.value = "";
};

/**
 * 初始化方法
 */
(async () => {
  upload.getSettings().debug
    ? console.debug("Piece: File Input Component 已加载")
    : !1;
})();
</script>