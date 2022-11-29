<template>
  <layout-index>
    <template v-if="!upload?.getSettings().readonly" v-slot:uploadContainer>
      <drop-file-input class="upload-box-container">
        <p class="upload-icon icon-inbox"></p>
        <p class="upload-text" v-html="upload?.getConfig().explain"></p>
        <p class="upload-hint" v-html="upload?.getSettings().tip"></p>
        <div class="upload-error-list pretty-scrollbar">
          <p
            class="error-info"
            v-for="(error, index) in renderData.errors"
            :key="index"
          >
            {{ error }}
          </p>
        </div>
      </drop-file-input>
    </template>

    <template v-slot:listContainer>
      <div
        class="scroll-container pretty-scrollbar"
        :ref="setListRef"
        v-on:mouseenter="renderData.scrollLock = true"
        v-on:mouseleave="renderData.scrollLock = false"
      >
        <TransitionGroup name="fade">
          <selected-file-info
            v-for="sortKey in upload?.getSelectedFileSortMap().size"
            :key="upload?.getSelectedFileSortMap().get(sortKey) ?? -1"
            :selectedFile="upload?.getSelectedFile(sortKey)"
            :readyDrag="renderData.readyDraggingSortKey === sortKey"
            :startDrag="renderData.currentDraggingSortKey !== null"
            :dragging="renderData.currentDraggingSortKey === sortKey"
            :dragover="
              renderData.lastDraggingSortKey === sortKey &&
              renderData.currentDraggingSortKey !== sortKey
            "
            @setContainerRef="(el) => setContainerRef(sortKey, el)"
            @mouseDown="(event) => containerMouseDown(sortKey, event)"
            @mouseUp="(event) => containerMouseUp(sortKey, event)"
            @mouseEnter="(event) => containerMouseEnter(sortKey, event)"
            @mouseLeave="(event) => containerMouseLeave(sortKey, event)"
            v-slot="slotProps"
          >
            <layout-info
              class="item-info-container"
              :slotProps="slotProps"
            ></layout-info>
          </selected-file-info>
        </TransitionGroup>
      </div>
    </template>
  </layout-index>
</template>

<script lang="ts">
import {
  reactive,
  defineComponent,
  PropType,
  ComponentPublicInstance,
} from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import DropFileInput from "../Piece/DropFileInput.vue2.vue";
import SelectedFileInfo from "../Piece/SelectedFileInfo.vue2.vue";
import LayoutIndex from "../Layout/index.vue2.vue";
import LayoutInfo from "../Layout/info.vue2.vue";
import SelectedFile from "../Model/SelectedFile";
import DraggingHelper from "../Extention/DraggingHelper";

export default defineComponent({
  name: "MultipleUpload",
  components: {
    DropFileInput,
    SelectedFileInfo,
    LayoutIndex,
    LayoutInfo,
    SelectedFile,
  },
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
  setup(props) {
    /**
     * 渲染数据
     */
    const renderData = reactive({
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

      /**
       * 列表容器引用对象
       */
      listContainerRef: null as HTMLDivElement | null,

      /**
       * 容器引用对象集合
       */
      containerRefMap: new Map<number, HTMLDivElement>(),

      /**
       * 拖动排序功能
       */
      drag4sort: {
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
          renderData.drag4sort.startTick = setTimeout(() => {
            //准备拖动
            renderData.readyDraggingSortKey = sortKey;

            renderData.drag4sort.startTick = setTimeout(() => {
              if (!renderData.listContainerRef) return;
              renderData.readyDraggingSortKey = null;
              //开始拖动
              renderData.currentDraggingSortKey = sortKey;
              renderData.drag4sort.draggingHelper = DraggingHelper.getInstance(
                renderData.listContainerRef as HTMLElement,
                renderData.containerRefMap.get(
                  renderData.currentDraggingSortKey
                )!
              );
              (renderData.drag4sort.draggingHelper as DraggingHelper).start(
                clientX,
                clientY
              );

              //将拖动元素置于其他元素的底层
              renderData.containerRefMap.forEach(
                (item: HTMLDivElement, key: number) => {
                  if (key !== renderData.currentDraggingSortKey)
                    item.style.zIndex = "1";
                }
              );
            }, 1500);
          }, 500);
        },

        /**
         * 取消重新排序
         */
        cancelChange: () => {
          renderData.drag4sort.changeTick &&
            clearTimeout(renderData.drag4sort.changeTick);
          renderData.lastDraggingSortKey = null;
        },

        /**
         * 结束拖动并复原容器位置
         */
        end: () => {
          renderData.drag4sort.startTick &&
            clearTimeout(renderData.drag4sort.startTick);
          renderData.drag4sort.changeTick &&
            clearTimeout(renderData.drag4sort.changeTick);
          renderData.readyDraggingSortKey = null;

          if (!renderData.drag4sort.draggingHelper) return;

          //结束拖动并复原位置
          (renderData.drag4sort.draggingHelper as DraggingHelper).end(true);
          renderData.drag4sort.draggingHelper = null;

          //恢复其他元素的zIndex
          renderData.containerRefMap.forEach(
            (item: HTMLDivElement, key: number) => {
              if (key !== renderData.currentDraggingSortKey)
                item.style.zIndex = "";
            }
          );

          renderData.lastDraggingSortKey = null;
          renderData.currentDraggingSortKey = null;
        },
      },
    });

    return {
      renderData: renderData,
    };
  },
  created() {
    /**
     * 滚动列表，将正在校验和正在上传的文件显示在当前的可视区域中
     *
     * @param files 当前的文件集合（已排序）
     */
    const scroll = (files: SelectedFile[]) => {
      if (this.renderData.scrollLock || files.length == 0) return;

      //等待页面元素已渲染完成
      this.$nextTick(() => {
        let container: HTMLDivElement | null = null;

        let findChecking = false;

        for (let i = 0; i < files.length; i++) {
          let file = files[i];

          if (!findChecking && file.checking) {
            findChecking = true;
            container = this.renderData.containerRefMap.get(i)!;
          }

          if (file.uploading) {
            container = this.renderData.containerRefMap.get(i)!;
            break;
          }
        }

        if (!container) return;

        //列表容器滚动至当前正在处理中的文件之处
        if (this.renderData.listContainerRef)
          this.renderData.listContainerRef.scrollTop =
            container.offsetTop -
            this.renderData.listContainerRef.offsetTop -
            20;
      });
    };

    //注册选择的文件集合变更事件
    (this.upload as NaiveUpload).registerSelectedFileListChanged(scroll);

    const alertError = (error: Error) => {
      this.renderData.errors.push(error.message);
      setTimeout(() => {
        this.renderData.errors.shift();
      }, 5000);
    };

    //注册提示异常的事件
    if ((this.upload as NaiveUpload).getSettings().alertErrorInfo)
      (this.upload as NaiveUpload).registerAlertError(alertError);

    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Piece: Multiple Upload Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 设置列表引用对象
     *
     * @param el 引用对象
     */
    setListRef(el: Element | ComponentPublicInstance | null) {
      el ? (this.renderData.listContainerRef = el as HTMLDivElement) : !1;
    },

    /**
     * 设置文件选择框引用对象
     *
     * @param sortKey
     * @param el 引用对象
     */
    setContainerRef(sortKey: number, el: HTMLDivElement) {
      if (!this.renderData.listContainerRef) return;

      this.renderData.containerRefMap.set(sortKey, el);
    },

    /**
     * 按下鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseDown(sortKey: number, event: MouseEvent) {
      this.renderData.drag4sort.ready2start(
        sortKey,
        event.clientX,
        event.clientY
      );
    },

    /**
     * 松开鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseUp(sortKey: number, event: MouseEvent) {
      this.renderData.drag4sort.end();
    },

    /**
     * 鼠标进入的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseEnter(sortKey: number, event: MouseEvent) {
      //延时重新排序

      this.renderData.lastDraggingSortKey = sortKey;

      if (
        this.renderData.currentDraggingSortKey ===
        this.renderData.lastDraggingSortKey
      )
        return;

      //TODO 自动将列表容器滚动至当前正在拖动的文件之处（注：此功能会和延迟重新排序功能冲突，暂不启用）
      // if (containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight) {
      // listContainerRef.scrollTop = containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight * 2 + 20 - listContainerRef.clientHeight;//containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight ? containerRefMap.get(renderData.lastDraggingSortKey).offsetTop - listContainerRef.offsetTop - 20 : 0;
      // drag4sort.draggingHelper.offset(0, listContainerRef.scrollTop);
      // console.debug('scrollTop', listContainerRef.scrollTop);
      // }

      this.renderData.drag4sort.changeTick = setTimeout(() => {
        //重新排序
        (this.upload as NaiveUpload).changeSort(
          this.renderData.currentDraggingSortKey!,
          this.renderData.lastDraggingSortKey!
        );
        this.renderData.drag4sort.end();
      }, 1300);
    },

    /**
     * 鼠标离开的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseLeave(sortKey: number, event: MouseEvent) {
      this.renderData.drag4sort.cancelChange();
    },
  },
});
</script>
