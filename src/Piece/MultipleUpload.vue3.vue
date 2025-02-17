<template>
  <layout-index>
    <template v-if="!upload.getSettings().readonly" v-slot:uploadContainer>
      <drop-file-input class="upload-box-container">
        <p class="upload-icon icon-inbox"></p>
        <p class="upload-text" v-html="upload.getConfig().explain"></p>
        <p class="upload-hint" v-html="upload.getSettings().tip"></p>
        <div class="upload-error-list pretty-scrollbar">
          <p class="error-info" v-for="(error, index) in renderData.errors" :key="index">
            {{ error }}
          </p>
        </div>
      </drop-file-input>
    </template>

    <template v-slot:listContainer>
      <div class="scroll-container pretty-scrollbar" :ref="setListRef" v-on:mouseenter="renderData.scrollLock = true"
        v-on:mouseleave="renderData.scrollLock = false">
        <TransitionGroup name="fade">
          <selected-file-info v-for="sortKey in upload.getSelectedFileSortMap().size"
            :key="upload.getSelectedFileSortMap().get(sortKey) ?? -1" :selectedFile="upload.getSelectedFile(sortKey)"
            :readyDrag="renderData.readyDraggingSortKey === sortKey"
            :startDrag="renderData.currentDraggingSortKey !== null"
            :dragging="renderData.currentDraggingSortKey === sortKey" :dragover="renderData.lastDraggingSortKey === sortKey &&
              renderData.currentDraggingSortKey !== sortKey
              " @setContainerRef="(el) => setContainerRef(sortKey, el)"
            @mouseDown="(event) => containerMouseDown(sortKey, event, false)"
            @mouseUp="(event) => containerMouseUp(sortKey, event, false)"
            @touchstart="(event: TouchEvent) => containerMouseDown(sortKey, event, true)"
            @touchend="(event: TouchEvent) => containerMouseUp(sortKey, event, true)"
            @touchcancel="(event: TouchEvent) => containerMouseUp(sortKey, event, true)" v-slot="slotProps">
            <layout-info class="item-info-container" :slotProps="slotProps"></layout-info>
          </selected-file-info>
        </TransitionGroup>
      </div>
    </template>
  </layout-index>
</template>

<script setup lang="ts">
import {
  reactive,
  inject,
  getCurrentInstance,
  ComponentPublicInstance,
} from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import DropFileInput from "../Piece/DropFileInput.vue3.vue";
import SelectedFileInfo from "../Piece/SelectedFileInfo.vue3.vue";
import LayoutIndex from "../Layout/index.vue3.vue";
import LayoutInfo from "../Layout/info.vue3.vue";
import SelectedFile from "../Model/SelectedFile";
import DraggingHelper from "../Extention/DraggingHelper";
import r from "../../lib/vue2/Piece/DropFileInput.vue2.vue_vue_type_script_lang";

// 获取vue实例
const { proxy } = getCurrentInstance() as any;
//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 渲染数据
 */
let renderData = reactive({
  /**
   * 锁定滚动条
   */
  scrollLock: false,

  /**
   * 准备拖动的索引
   */
  readyDraggingSortKey: null as number | null,

  /**
   * 当前正在拖动中的索引
   */
  currentDraggingSortKey: null as number | null,

  /**
   * 上一个接收拖动对象的索引
   */
  lastDraggingSortKey: null as number | null,

  /**
   * 异常信息
   */
  errors: [] as string[],
});

/**
 * 列表容器引用对象
 */
let listContainerRef: HTMLDivElement;

/**
 * 容器引用对象集合
 */
let containerRefMap = new Map<number, HTMLDivElement>();

/**
 * 拖动排序功能
 */
let drag4sort = {
  /**
   * 延时开启拖动功能的计时器
   */
  startTick: null as NodeJS.Timeout | null,

  /**
   * 延时更改排序的计时器
   */
  changeTick: null as NodeJS.Timeout | null,

  /**
   * 当前拖动对象
   */
  draggingHelper: null as DraggingHelper | null,

  /**
   * 延时开启拖动功能
   *
   * @param sortKey
   * @param clientX
   * @param clientY
   */
  ready2start: (sortKey: number, clientX: number, clientY: number) => {
    if (!upload.getSettings().enableDrag) {
      upload.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue3) 未启用拖动排序功能"
        )
        : !1;
      return;
    }
    if (upload.getSelectedFileList(false).length <= 1) return;

    upload.getSettings().debug
      ? console.debug(
        `Piece: Multiple Upload Component(vue3) 延时开启拖动功能, sortKey: ${sortKey}`
      )
      : !1;

    drag4sort.startTick && clearTimeout(drag4sort.startTick);

    drag4sort.startTick = setTimeout(() => {
      //准备拖动
      renderData.readyDraggingSortKey = sortKey;

      drag4sort.startTick = setTimeout(() => {
        if (!listContainerRef) return;
        renderData.readyDraggingSortKey = null;
        //开始拖动
        renderData.currentDraggingSortKey = sortKey;
        drag4sort.draggingHelper = DraggingHelper.getInstance(
          listContainerRef,
          containerRefMap,
          renderData.currentDraggingSortKey,
          upload.getSettings().isMobile
        );
        drag4sort.draggingHelper.start(clientX, clientY, (targetKey, _clientX, _clientY) => {
          upload.getSettings().debug
            ? console.debug(
              `Piece: Multiple Upload Component(vue3) 鼠标移动事件, sortKey: ${sortKey}, clientX: ${_clientX}, clientY: ${_clientY}, targetKey: ${targetKey}`
            )
            : !1;

          targetKey == -1 ? containerMouseLeave() : containerMouseEnter(targetKey);
        });

        // //将拖动元素置于其他元素的底层
        // containerRefMap.forEach((item: HTMLDivElement, key: number) => {
        //   if (key == renderData.currentDraggingSortKey)
        //     item.style.zIndex = "999";
        // });
      }, upload.getSettings().dragPreparationTime);
    }, 500);
  },

  /**
   * 延时重新排序
   *
   * @param sortKey
   */
  ready2change: (targetKey: number) => {
    renderData.lastDraggingSortKey = targetKey;

    if (renderData.currentDraggingSortKey === renderData.lastDraggingSortKey)
      return;

    upload.getSettings().debug
      ? console.debug(
        `Piece: Multiple Upload Component(vue3) 延时重新排序, targetKey: ${targetKey}`
      )
      : !1;

    //TODO 自动将列表容器滚动至当前正在拖动的文件之处（注：此功能会和延迟重新排序功能冲突，暂不启用）
    // if (containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight) {
    // listContainerRef.scrollTop = containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight * 2 + 20 - listContainerRef.clientHeight;//containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight ? containerRefMap.get(renderData.lastDraggingSortKey).offsetTop - listContainerRef.offsetTop - 20 : 0;
    // drag4sort.draggingHelper.offset(0, listContainerRef.scrollTop);
    // console.debug('scrollTop', listContainerRef.scrollTop);
    // }

    drag4sort.changeTick && clearTimeout(drag4sort.changeTick);

    drag4sort.changeTick = setTimeout(() => {
      //重新排序
      upload.changeSort(
        renderData.currentDraggingSortKey!,
        renderData.lastDraggingSortKey!
      );
      drag4sort.end();
    }, upload.getSettings().dragChangePositionTime);
  },

  /**
   * 取消重新排序
   */
  cancelChange: () => {
    upload.getSettings().debug
      ? console.debug(
        'Piece: Multiple Upload Component(vue3) 取消重新排序'
      )
      : !1;

    drag4sort.changeTick && clearTimeout(drag4sort.changeTick);
    renderData.lastDraggingSortKey = null;
  },

  /**
   * 结束拖动并复原容器位置
   */
  end: () => {
    drag4sort.startTick && clearTimeout(drag4sort.startTick);
    drag4sort.changeTick && clearTimeout(drag4sort.changeTick);
    renderData.readyDraggingSortKey = null;

    if (!drag4sort.draggingHelper) return;

    upload.getSettings().debug
      ? console.debug(
        'Piece: Multiple Upload Component(vue3) 结束拖动并复原容器位置'
      )
      : !1;

    //结束拖动并复原位置
    drag4sort.draggingHelper.end(true);
    drag4sort.draggingHelper = null;

    //恢复其他元素的zIndex
    containerRefMap.forEach((item: HTMLDivElement, key: number) => {
      if (key !== renderData.currentDraggingSortKey) item.style.zIndex = "";
    });

    renderData.lastDraggingSortKey = null;
    renderData.currentDraggingSortKey = null;
  },
};

/**
 * 设置列表引用对象
 *
 * @param el 引用对象
 */
const setListRef = (el: Element | ComponentPublicInstance | null) => {
  el ? (listContainerRef = el as HTMLDivElement) : !1;
};

/**
 * 设置文件选择框引用对象
 *
 * @param sortKey
 * @param el 引用对象
 */
const setContainerRef = (sortKey: number, el: HTMLDivElement) => {
  if (!listContainerRef) return;

  containerRefMap.set(sortKey, el);
};

/**
 * 按下鼠标的事件
 *
 * @param sortKey
 * @param event
 * @param touch 是否来自touch事件
 */
const containerMouseDown = (sortKey: number, event: MouseEvent | TouchEvent, touch: boolean) => {
  upload.getSettings().debug
    ? console.debug(
      `Piece: Multiple Upload Component(vue3) 按下鼠标的事件, sortKey: ${sortKey}`
    )
    : !1;

  const clientX = touch ? (<TouchEvent>event).targetTouches[0].clientX : (<MouseEvent>event).clientX;
  const clientY = touch ? (<TouchEvent>event).targetTouches[0].clientY : (<MouseEvent>event).clientY;

  drag4sort.ready2start(sortKey, clientX, clientY);
};

/**
 * 松开鼠标的事件
 *
 * @param sortKey
 * @param event
 * @param touch 是否来自touch事件
 */
const containerMouseUp = (sortKey: number, event: MouseEvent | TouchEvent, touch: boolean) => {
  upload.getSettings().debug
    ? console.debug(
      `Piece: Multiple Upload Component(vue3) 松开鼠标的事件, sortKey: ${sortKey}`
    )
    : !1;

  drag4sort.end();
};

/**
 * 进入目标范围的事件
 *
 * @param targetKey
 */
const containerMouseEnter = (targetKey: number) => {
  upload.getSettings().debug
    ? console.debug(
      `Piece: Multiple Upload Component(vue3) 进入目标范围的事件, targetKey: ${targetKey}`
    )
    : !1;

  drag4sort.ready2change(targetKey);
};

/**
 * 离开目标范围的事件
 */
const containerMouseLeave = () => {
  upload.getSettings().debug
    ? console.debug(
      `Piece: Multiple Upload Component(vue3) 离开目标范围的事件`
    )
    : !1;

  drag4sort.cancelChange();
};

/**
 * 初始化方法
 */
(async () => {
  /**
   * 滚动列表，将正在校验和正在上传的文件显示在当前的可视区域中
   *
   * @param files 当前的文件集合（已排序）
   */
  const scroll = (files: SelectedFile[]) => {
    if (renderData.scrollLock || files.length == 0) return;

    //等待页面元素已渲染完成
    proxy.$nextTick(() => {
      let container: HTMLDivElement | null = null;

      let findChecking = false;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (!findChecking && file.checking) {
          findChecking = true;
          container = containerRefMap.get(i)!;
        }

        if (file.uploading) {
          container = containerRefMap.get(i)!;
          break;
        }
      }

      if (!container) return;

      //列表容器滚动至当前正在处理中的文件之处
      if (listContainerRef)
        listContainerRef.scrollTop =
          container.offsetTop - listContainerRef.offsetTop - 20;
    });
  };

  //注册选择的文件集合变更事件
  upload.registerSelectedFileListChanged(scroll);

  const alertError = (error: Error) => {
    renderData.errors.push(error.message);
    setTimeout(() => {
      renderData.errors.shift();
    }, 5000);
  };

  //注册提示异常的事件
  if (upload.getSettings().alertErrorInfo)
    upload.registerAlertError(alertError);

  upload.getSettings().debug
    ? console.debug("Piece: Multiple Upload Component(vue3) 已加载")
    : !1;
})();
</script>
