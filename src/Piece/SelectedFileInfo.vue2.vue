<template>
  <div
    :class="containerStyle"
    :title="containerInfo"
    v-on:mouseenter="mouseEnter"
    v-on:mouseleave="mouseLeave"
    v-on:mousedown="mouseDown"
    v-on:mouseup="mouseUp"
    ref="containerRef"
  >
    <div v-if="!selectedFile?.canceled" class="item-body">
      <div class="item-image">
        <img
          :src="selectedFile?.thumbnail"
          loading="lazy"
          :alt="selectedFile?.fullname()"
        />
      </div>

      <span class="item-tools" v-if="toolsShow">
        <span
          class="upload-icon icon-rename"
          title="重命名"
          v-on:click="rename()"
          v-if="renameEnable && !uploadInstance.getSettings().readonly"
        ></span>
        <span
          class="upload-icon icon-view"
          title="查看"
          v-if="viewEnable"
          v-on:click="view()"
        ></span>
        <span
          class="upload-icon icon-download"
          title="保存"
          v-if="saveEnable"
          v-on:click="save()"
        ></span>
        <span
          class="upload-icon icon-remove"
          title="删除"
          v-on:click="remove()"
          v-if="!uploadInstance.getSettings().readonly"
        ></span>
      </span>

      <slot
        :selectedFile="selectedFile"
        :rename="renderData.rename"
        :funs="{
          setRenameInputRef: setRenameInputRef,
          renameKeydown: renameKeydown,
          renameDone: renameDone,
        }"
        :loadingInfo="loadingInfo"
        :loadingShow="loadingShow"
      ></slot>

      <div v-if="selectedFile?.paused" class="item-sub sub-paused">暂停</div>
      <div v-if="selectedFile?.done" class="item-sub sub-done">完成</div>
      <div v-if="selectedFile?.error" class="item-sub sub-error">错误</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import SelectedFile from "../Model/SelectedFile";
import { FileType } from "../Model/FileType";

export default defineComponent({
  name: "SelectedFileInfo",
  /**
   * 组件属性
   */
  props: {
    /**
     * 选择的文件
     */
    selectedFile: {
      type: Object as PropType<SelectedFile>,
      require: true,
    },
    /**
     * 准备拖动
     */
    readyDrag: {
      type: Boolean,
      require: false,
    },
    /**
     * 拖动操作已开始
     */
    startDrag: {
      type: Boolean,
      require: false,
    },
    /**
     * 正在拖动
     */
    dragging: {
      type: Boolean,
      require: false,
    },
    /**
     * 和拖动元素重叠
     */
    dragover: {
      type: Boolean,
      require: false,
    },
  },
  /**
   * 组件自定义事件
   */
  emits: [
    /**
     * 设置容器引用对象
     *
     * @param e
     * @param {HTMLDivElement} el 容器引用对象
     */
    "setContainerRef",
    /**
     * 按下鼠标的事件
     *
     * @param e
     * @param {MouseEvent} event
     */
    "mouseDown",
    /**
     * 松开鼠标的事件
     *
     * @param e
     * @param {MouseEvent} event
     */
    "mouseUp",
    /**
     * 鼠标进入的事件
     *
     * @param e
     * @param {MouseEvent} event
     * @return {boolean}
     */
    "mouseEnter",
    /**
     * 鼠标离开的事件
     *
     * @param e
     * @param {MouseEvent} event
     */
    "mouseLeave",
  ],
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
     * 容器样式
     */
    containerStyle(): string {
      return `item-container ${this.selectedFile?.done ? " item-done" : ""} ${
        this.selectedFile?.error ? " item-error" : ""
      } ${
        this.renderData.hover &&
        !this.renderData.rename.active &&
        !this.selectedFile?.checking &&
        !this.selectedFile?.uploading &&
        !this.readyDrag &&
        !this.startDrag
          ? " item-hover"
          : ""
      } ${this.selectedFile?.checking ? " item-checking" : ""} ${
        this.selectedFile?.uploading ? " item-uploading" : ""
      } ${this.selectedFile?.canceled ? " item-canceled" : ""} ${
        this.selectedFile?.paused ? " item-paused" : ""
      } ${this.readyDrag ? " item-ready-drag" : ""} ${
        this.dragging ? " item-dragging" : ""
      } ${this.dragover ? " item-drag-over" : ""}`;
    },
    /**
     * 容器信息
     */
    containerInfo(): string {
      return `${this.selectedFile?.done ? "上传成功" : ""} ${
        this.selectedFile?.error ? this.selectedFile.errorMessage : ""
      } ${this.selectedFile?.paused ? "已暂停" : ""}`;
    },
    /**
     * 显示/隐藏 加载层
     */
    loadingShow(): boolean {
      return (
        !this.renderData.rename.active &&
        (this.selectedFile!.checking || this.selectedFile!.uploading)
      );
    },
    /**
     * 加载层信息
     */
    loadingInfo(): string {
      return `${
        this.selectedFile?.checking
          ? "扫描中..." + this.selectedFile.percent + "%"
          : ""
      } ${
        this.selectedFile?.uploading
          ? "上传中..." + this.selectedFile.percent + "%"
          : ""
      }`;
    },
    /**
     * 显示/隐藏 工具栏
     */
    toolsShow(): boolean {
      return (
        this.renderData.hover &&
        this.dragging === false &&
        !this.renderData.rename.active &&
        !this.selectedFile?.checking &&
        !this.selectedFile?.uploading
      );
    },
    /**
     * 启用/禁用 重命名
     */
    renameEnable(): boolean {
      return !this.selectedFile?.uploading;
    },
    /**
     * 启用/禁用 浏览
     */
    viewEnable(): boolean {
      switch (this.selectedFile?.fileType) {
        case FileType.图片:
        case FileType.音频:
          return this.selectedFile.extensionLower !== ".flac";
        case FileType.视频:
          return true;
        case FileType.文本文件:
          return true;
        case FileType.电子文档:
          return (
            this.selectedFile.extensionLower === ".pdf" ||
            this.selectedFile.extensionLower === ".doc" ||
            this.selectedFile.extensionLower === ".docx"
          );
        default:
          return false;
      }
    },
    /**
     * 启用/禁用 保存
     */
    saveEnable(): boolean {
      return true;
    },
  },
  /**
   * 渲染数据
   */
  data() {
    return {
      renderData: {
        /**
         * 文件重命名输入框
         */
        renameInputRef: null as HTMLInputElement | null,
        /**
         * 鼠标悬浮
         */
        hover: false,
        /**
         * 重命名
         */
        rename: {
          /**
           * 正在重命名
           */
          active: false,

          /**
           * 值
           */
          value: "",
        },
      },
    };
  },
  created() {
    //设置文件选择框引用对象
    this.$nextTick(() => {
      this.$emit("setContainerRef", <HTMLDivElement>this.$refs.containerRef);
    });

    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: Selected File Info Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 设置重命名输入框引用对象
     *
     * @param el 引用对象
     */
    setRenameInputRef(el: HTMLInputElement | null) {
      if (el) this.renderData.renameInputRef = el as HTMLInputElement;
    },
    /**
     * 鼠标进入的事件
     *
     * @param event
     */
    mouseEnter(event: MouseEvent) {
      if (this.readyDrag || this.startDrag) {
        this.$emit("mouseEnter", event);
        this.renderData.hover = false;
      } else this.renderData.hover = true;
    },
    /**
     * 鼠标离开的事件
     *
     * @param event
     */
    mouseLeave(event: MouseEvent) {
      if (this.readyDrag || this.startDrag) this.$emit("mouseLeave", event);

      this.renderData.hover = false;
    },
    /**
     * 按下鼠标的事件
     *
     * @param event
     */
    mouseDown(event: MouseEvent) {
      this.$emit("mouseDown", event);
    },
    /**
     * 松开鼠标的事件
     *
     * @param event
     */
    mouseUp(event: MouseEvent) {
      this.$emit("mouseUp", event);
    },
    /**
     * 重命名
     */
    rename() {
      this.renderData.rename.active = true;

      this.$nextTick(() => {
        if (this.renderData.renameInputRef)
          this.renderData.renameInputRef.focus();
      });
    },
    /**
     * 确认重命名
     *
     * @param {any} event
     */
    renameKeydown(event: KeyboardEvent) {
      if (event.key == "Enter") {
        this.renameDone();
      }
    },
    /**
     * 重命名结束
     */
    renameDone() {
      this.uploadInstance
        .rename(
          (this.selectedFile as SelectedFile).token!,
          this.renderData.rename.value
        )
        .then(() => {
          this.renderData.rename.active = false;
        })
        .catch(() => {
          this.renderData.rename.active = false;
        });
    },
    /**
     * 查看
     */
    view() {
      const file = this.uploadInstance.getRawFile(
        this.selectedFile as SelectedFile
      );
      const bodyStyle =
        "margin:0px;text-align: center;display: flex;flex-direction: row;justify-content: center;align-items: center";

      switch ((this.selectedFile as SelectedFile).fileType) {
        case FileType.图片:
          let winImage = window.open();
          winImage?.document.write(
            `<head><title>${(
              this.selectedFile as SelectedFile
            ).fullname()}</title></head><body style="${bodyStyle};background-color: black;"><img src="${
              file.objectURL
            }" alt="${(this.selectedFile as SelectedFile).fullname()}"></body>`
          );
          break;
        case FileType.音频:
          if ((this.selectedFile as SelectedFile).extensionLower === ".flac")
            return;

          let winAudio = window.open();
          winAudio?.document.write(
            `<head><title>${(
              this.selectedFile as SelectedFile
            ).fullname()}</title></head><body style="${bodyStyle};background-color: black;"><audio src="${
              file.objectURL
            }" controls="controls">抱歉, 暂不支持</audio></body>`
          );
          break;
        case FileType.视频:
          let winVideo = window.open();
          winVideo?.document.write(
            `<head><title>${(
              this.selectedFile as SelectedFile
            ).fullname()}</title></head><body style="${bodyStyle};background-color: black;"><video src="${
              file.objectURL
            }" controls="controls">抱歉, 暂不支持</video></body>`
          );
          break;
        default:
          let win = window.open();
          win?.document.write(
            `<head><title>${(
              this.selectedFile as SelectedFile
            ).fullname()}</title></head><body style="${bodyStyle};"><object data="${
              file.objectURL
            }" type="${
              (this.selectedFile as SelectedFile).extensionLower === ".txt"
                ? "text/plain"
                : (this.selectedFile as SelectedFile).extensionLower === ".pdf"
                ? "application/pdf"
                : "application/octet-stream"
            }" width="100%" height="100%"><iframe src="${
              file.objectURL
            }" width="100%" height="100%" ></iframe></object></body>`
          );
          break;
      }
    },
    /**
     * 保存
     */
    save() {
      const file = this.uploadInstance.getRawFile(
        this.selectedFile as SelectedFile
      );

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = this.uploadInstance.getDownloadUrl(
        this.selectedFile as SelectedFile
      )!;
      if (file.file)
        a.download = (this.selectedFile as SelectedFile).fullname();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    /**
     * 删除
     */
    remove() {
      this.uploadInstance.remove((this.selectedFile as SelectedFile).token!);
    },
  },
});
</script>
