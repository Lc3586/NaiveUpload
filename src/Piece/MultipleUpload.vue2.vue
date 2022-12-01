<template>
  <layout-index>
    <template
      v-if="!uploadInstance.getSettings().readonly"
      v-slot:uploadContainer
    >
      <drop-file-input class="upload-box-container">
        <p class="upload-icon icon-inbox"></p>
        <p class="upload-text" v-html="uploadInstance.getConfig().explain"></p>
        <p class="upload-hint" v-html="uploadInstance.getSettings().tip"></p>
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
        ref="listContainerRef"
        v-on:mouseenter="renderData.scrollLock = true"
        v-on:mouseleave="renderData.scrollLock = false"
      >
        <TransitionGroup tag="div" name="fade">
          <selected-file-info
            v-for="sortKey in renderData.selectedFileSortMapSize"
            v-bind:key="uploadInstance.getSelectedFileSortMap().get(sortKey)"
            :selectedFile="uploadInstance.getSelectedFile(sortKey)"
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
import { defineComponent, ComponentPublicInstance } from "vue-demi";
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
     * 列表容器引用对象
     */
    listContainerRef(): HTMLDivElement {
      return <HTMLDivElement>this.$refs.listContainerRef;
    },
    // /**
    //  *
    //  */
    // selectedFileSortMapSize(): number {
    //   console.warn(this.uploadInstance.getSelectedFileSortMap());
    //   console.warn(this.renderData.selectedFileSortMap);
    //   return this.renderData.selectedFileSortMap.size;
    // },
  },
  /**
   * 渲染数据
   */
  data() {
    return {
      renderData: {
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
        },
        selectedFileSortMapSize: 0 as number,
      },
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
        if (this.listContainerRef)
          this.listContainerRef.scrollTop =
            container.offsetTop - this.listContainerRef.offsetTop - 20;
      });
    };

    //注册选择的文件集合变更事件
    this.uploadInstance.registerSelectedFileListChanged(scroll);
    //注册选择的文件集合变更事件
    this.uploadInstance.registerSelectedFileSortMapChanged(
      (sortMap: Map<number, number>) => {
        this.renderData.selectedFileSortMapSize = sortMap.size;
      }
    );

    const alertError = (error: Error) => {
      this.renderData.errors.push(error.message);
      setTimeout(() => {
        this.renderData.errors.shift();
      }, 5000);
    };

    //注册提示异常的事件
    if (this.uploadInstance.getSettings().alertErrorInfo)
      this.uploadInstance.registerAlertError(alertError);

    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: Multiple Upload Component(vue2) 已加载")
      : !1;
  },
  methods: {
    /**
     * 设置文件选择框引用对象
     *
     * @param sortKey
     * @param el 引用对象
     */
    setContainerRef(sortKey: number, el: HTMLDivElement) {
      if (!this.listContainerRef) return;

      this.renderData.containerRefMap.set(sortKey, el);
    },

    /**
     * 按下鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseDown(sortKey: number, event: MouseEvent) {
      this.ready2start(sortKey, event.clientX, event.clientY);
    },

    /**
     * 松开鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseUp(sortKey: number, event: MouseEvent) {
      this.end();
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
        this.uploadInstance.changeSort(
          this.renderData.currentDraggingSortKey!,
          this.renderData.lastDraggingSortKey!
        );
        this.end();
      }, this.uploadInstance.getSettings().dragChangePositionTime);
    },

    /**
     * 鼠标离开的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseLeave(sortKey: number, event: MouseEvent) {
      this.cancelChange();
    },

    /**
     * 延时开启拖动功能
     *
     * @param sortKey
     * @param clientX
     * @param clientY
     */
    ready2start(sortKey: number, clientX: number, clientY: number) {
      this.renderData.drag4sort.startTick = setTimeout(() => {
        //准备拖动
        this.renderData.readyDraggingSortKey = sortKey;

        this.renderData.drag4sort.startTick = setTimeout(() => {
          if (!this.listContainerRef) return;
          this.renderData.readyDraggingSortKey = null;
          //开始拖动
          this.renderData.currentDraggingSortKey = sortKey;
          this.renderData.drag4sort.draggingHelper = DraggingHelper.getInstance(
            this.listContainerRef as HTMLElement,
            this.renderData.containerRefMap.get(
              this.renderData.currentDraggingSortKey
            )!
          );
          (<DraggingHelper>this.renderData.drag4sort.draggingHelper).start(
            clientX,
            clientY
          );

          //将拖动元素置于其他元素的底层
          this.renderData.containerRefMap.forEach(
            (item: HTMLDivElement, key: number) => {
              if (key !== this.renderData.currentDraggingSortKey)
                item.style.zIndex = "1";
            }
          );
        }, this.uploadInstance.getSettings().dragPreparationTime);
      }, 500);
    },

    /**
     * 取消重新排序
     */
    cancelChange() {
      this.renderData.drag4sort.changeTick &&
        clearTimeout(this.renderData.drag4sort.changeTick);
      this.renderData.lastDraggingSortKey = null;
    },

    /**
     * 结束拖动并复原容器位置
     */
    end() {
      this.renderData.drag4sort.startTick &&
        clearTimeout(this.renderData.drag4sort.startTick);
      this.renderData.drag4sort.changeTick &&
        clearTimeout(this.renderData.drag4sort.changeTick);
      this.renderData.readyDraggingSortKey = null;

      if (!this.renderData.drag4sort.draggingHelper) return;

      //结束拖动并复原位置
      (<DraggingHelper>this.renderData.drag4sort.draggingHelper).end(true);
      this.renderData.drag4sort.draggingHelper = null;

      //恢复其他元素的zIndex
      this.renderData.containerRefMap.forEach(
        (item: HTMLDivElement, key: number) => {
          if (key !== this.renderData.currentDraggingSortKey)
            item.style.zIndex = "";
        }
      );

      this.renderData.lastDraggingSortKey = null;
      this.renderData.currentDraggingSortKey = null;
    },
  },
});
</script>
