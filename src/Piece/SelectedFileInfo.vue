<template>
  <div
    :class="renderData.container.style()"
    :title="renderData.container.info()"
    v-on:mouseenter="mouseEnter"
    v-on:mouseleave="mouseLeave"
    v-on:mousedown="mouseDown"
    v-on:mouseup="mouseUp"
    :ref="setContainerRef"
  >
    <div v-if="!props.selectedFile.canceled" class="item-body">
      <div class="item-image">
        <img
          :src="props.selectedFile.thumbnail"
          loading="lazy"
          :alt="props.selectedFile.fullname()"
        />
      </div>

      <span class="item-tools" v-if="renderData.tools.show()">
        <span
          class="upload-icon icon-rename"
          title="重命名"
          v-on:click="rename()"
          v-if="renderData.rename.enable() && !upload.getSettings().readonly"
        ></span>
        <span
          class="upload-icon icon-view"
          title="查看"
          v-if="renderData.view.enable()"
          v-on:click="view()"
        ></span>
        <span
          class="upload-icon icon-download"
          title="保存"
          v-if="renderData.save.enable()"
          v-on:click="save()"
        ></span>
        <span
          class="upload-icon icon-remove"
          title="删除"
          v-on:click="remove()"
          v-if="!upload.getSettings().readonly"
        ></span>
      </span>

      <slot
        :selectedFile="props.selectedFile"
        :rename="renderData.rename"
        :funs="{
          setRenameInputRef: setRenameInputRef,
          renameKeydown: renameKeydown,
          renameDone: renameDone,
        }"
        :loading="renderData.loading"
      ></slot>

      <div v-if="props.selectedFile.paused" class="item-sub sub-paused">
        暂停
      </div>
      <div v-if="props.selectedFile.done" class="item-sub sub-done">完成</div>
      <div v-if="props.selectedFile.error" class="item-sub sub-error">错误</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ComponentPublicInstance,
  getCurrentInstance,
  inject,
  reactive,
} from "vue";
import NaiveUpload from "../Core/NaiveUpload";
import SelectedFile from "../Model/SelectedFile";
import { FileType } from "../Model/FileType";

// 获取vue实例
const { proxy } = getCurrentInstance() as any;
//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 渲染数据
 */
let renderData = reactive({
  /**
   * 鼠标悬浮
   */
  hover: false,

  /**
   * 容器
   */
  container: {
    /**
     * 样式
     */
    style: () =>
      `item-container ${props.selectedFile.done ? " item-done" : ""} ${
        props.selectedFile.error ? " item-error" : ""
      } ${
        renderData.hover &&
        !renderData.rename.active &&
        !props.selectedFile.checking &&
        !props.selectedFile.uploading &&
        !props.readyDrag &&
        !props.startDrag
          ? " item-hover"
          : ""
      } ${props.selectedFile.checking ? " item-checking" : ""} ${
        props.selectedFile.uploading ? " item-uploading" : ""
      } ${props.selectedFile.canceled ? " item-canceled" : ""} ${
        props.selectedFile.paused ? " item-paused" : ""
      } ${props.readyDrag ? " item-ready-drag" : ""} ${
        props.dragging ? " item-dragging" : ""
      } ${props.dragover ? " item-drag-over" : ""}`,

    /**
     * 信息
     */
    info: () =>
      `${props.selectedFile.done ? "上传成功" : ""} ${
        props.selectedFile.error ? props.selectedFile.errorMessage : ""
      } ${props.selectedFile.paused ? "已暂停" : ""}`,
  },

  /**
   * 加载层
   */
  loading: {
    /**
     * 显示/隐藏
     */
    show: () =>
      !renderData.rename.active &&
      (props.selectedFile.checking || props.selectedFile.uploading),

    /**
     * 信息
     */
    info: () =>
      `${
        props.selectedFile.checking
          ? "扫描中..." + props.selectedFile.percent + "%"
          : ""
      } ${
        props.selectedFile.uploading
          ? "上传中..." + props.selectedFile.percent + "%"
          : ""
      }`,
  },

  /**
   * 工具栏
   */
  tools: {
    /**
     * 显示/隐藏
     */
    show: () =>
      renderData.hover &&
      props.dragging === false &&
      !renderData.rename.active &&
      !props.selectedFile.checking &&
      !props.selectedFile.uploading,
  },

  /**
   * 重命名
   */
  rename: {
    /**
     * 启用/禁用
     */
    enable: () => !props.selectedFile.uploading,

    /**
     * 正在重命名
     */
    active: false,

    /**
     * 值
     */
    value: "",
  },

  /**
   * 浏览
   */
  view: {
    /**
     * 启用/禁用
     */
    enable: () => {
      switch (props.selectedFile.fileType) {
        case FileType.图片:
        case FileType.音频:
          return props.selectedFile.extensionLower !== ".flac";
        case FileType.视频:
          return true;
        case FileType.文本文件:
          return true;
        case FileType.电子文档:
          return (
            props.selectedFile.extensionLower === ".pdf" ||
            props.selectedFile.extensionLower === ".doc" ||
            props.selectedFile.extensionLower === ".docx"
          );
        default:
          return false;
      }
    },
  },

  /**
   * 保存
   */
  save: {
    /**
     * 启用/禁用
     */
    enable: () => {
      return true;
    },
  },
});

/**
 * 组件属性
 */
const props = defineProps<{
  key: number;

  /**
   * 选择的文件
   */
  selectedFile: SelectedFile;

  /**
   * 准备拖动
   */
  readyDrag?: boolean;

  /**
   * 拖动操作已开始
   */
  startDrag?: boolean;

  /**
   * 正在拖动
   */
  dragging?: boolean;

  /**
   * 和拖动元素重叠
   */
  dragover?: boolean;
}>();

/**
 * 组件自定义事件
 */
const emit = defineEmits<{
  /**
   * 设置容器引用对象
   *
   * @param e
   * @param el 容器引用对象
   */
  (e: "setContainerRef", el: HTMLDivElement): void;

  /**
   * 按下鼠标的事件
   *
   * @param e
   * @param event
   */
  (e: "mouseDown", event: MouseEvent): void;

  /**
   * 松开鼠标的事件
   *
   * @param e
   * @param event
   */
  (e: "mouseUp", event: MouseEvent): void;

  /**
   * 鼠标进入的事件
   *
   * @param e
   * @param event
   */
  (e: "mouseEnter", event: MouseEvent): boolean;

  /**
   * 鼠标离开的事件
   *
   * @param e
   * @param event
   */
  (e: "mouseLeave", event: MouseEvent): void;
}>();

/**
 * 文件重命名输入框
 */
let renameInputRef: HTMLInputElement;

/**
 * 设置文件选择框引用对象
 *
 * @param el 引用对象
 */
const setContainerRef = (el: Element | ComponentPublicInstance | null) => {
  el ? emit("setContainerRef", el as HTMLDivElement) : !1;
};

/**
 * 设置重命名输入框引用对象
 *
 * @param el 引用对象
 */
const setRenameInputRef = (el: Element | ComponentPublicInstance | null) => {
  renameInputRef = el as HTMLInputElement;
};

/**
 * 鼠标进入的事件
 *
 * @param event
 */
const mouseEnter = (event: MouseEvent) => {
  if (props.readyDrag || props.startDrag) {
    emit("mouseEnter", event);
    renderData.hover = false;
  } else renderData.hover = true;
};

/**
 * 鼠标离开的事件
 *
 * @param event
 */
const mouseLeave = (event: MouseEvent) => {
  if (props.readyDrag || props.startDrag) emit("mouseLeave", event);

  renderData.hover = false;
};

/**
 * 按下鼠标的事件
 *
 * @param event
 */
const mouseDown = (event: MouseEvent) => {
  emit("mouseDown", event);
};

/**
 * 松开鼠标的事件
 *
 * @param event
 */
const mouseUp = (event: MouseEvent) => {
  emit("mouseUp", event);
};

/**
 * 重命名
 */
const rename = () => {
  renderData.rename.active = true;

  proxy.$nextTick(() => {
    renameInputRef.focus();
  });
};

/**
 * 确认重命名
 *
 * @param {any} event
 */
const renameKeydown = (event: KeyboardEvent) => {
  if (event.key == "Enter") {
    renameDone();
  }
};

/**
 * 重命名结束
 */
const renameDone = () => {
  upload
    .rename(props.selectedFile.token!, renderData.rename.value)
    .then(() => {
      renderData.rename.active = false;
    })
    .catch(() => {
      renderData.rename.active = false;
    });
};

/**
 * 查看
 */
const view = () => {
  const file = upload.getRawFile(props.selectedFile);
  const bodyStyle =
    "margin:0px;text-align: center;display: flex;flex-direction: row;justify-content: center;align-items: center";

  switch (props.selectedFile.fileType) {
    case FileType.图片:
      let winImage = window.open();
      winImage?.document.write(
        `<head><title>${props.selectedFile.fullname()}</title></head><body style="${bodyStyle};background-color: black;"><img src="${
          file.objectURL
        }" alt="${props.selectedFile.fullname()}"></body>`
      );
      break;
    case FileType.音频:
      if (props.selectedFile.extensionLower === ".flac") return;

      let winAudio = window.open();
      winAudio?.document.write(
        `<head><title>${props.selectedFile.fullname()}</title></head><body style="${bodyStyle};background-color: black;"><audio src="${
          file.objectURL
        }" controls="controls">抱歉, 暂不支持</audio></body>`
      );
      break;
    case FileType.视频:
      let winVideo = window.open();
      winVideo?.document.write(
        `<head><title>${props.selectedFile.fullname()}</title></head><body style="${bodyStyle};background-color: black;"><video src="${
          file.objectURL
        }" controls="controls">抱歉, 暂不支持</video></body>`
      );
      break;
    default:
      let win = window.open();
      win?.document.write(
        `<head><title>${props.selectedFile.fullname()}</title></head><body style="${bodyStyle};"><object data="${
          file.objectURL
        }" type="${
          props.selectedFile.extensionLower === ".txt"
            ? "text/plain"
            : props.selectedFile.extensionLower === ".pdf"
            ? "application/pdf"
            : "application/octet-stream"
        }" width="100%" height="100%"><iframe src="${
          file.objectURL
        }" width="100%" height="100%" ></iframe></object></body>`
      );
      break;
  }
};

/**
 * 保存
 */
const save = () => {
  const file = upload.getRawFile(props.selectedFile);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = upload.getDownloadUrl(props.selectedFile)!;
  if (file.file) a.download = props.selectedFile.fullname();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * 删除
 */
const remove = () => {
  upload.remove(props.selectedFile.token!);
};

/**
 * 初始化方法
 */
(async () => {
  upload.getSettings().debug
    ? console.debug("Piece: Selected File Info Component 已加载")
    : !1;
})();
</script>