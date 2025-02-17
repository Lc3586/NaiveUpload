<template>
  <layout-index>
    <template v-if="!uploadInstance.getSettings().readonly" v-slot:uploadContainer>
      <drop-file-input class="upload-box-container">
        <p class="upload-icon icon-inbox"></p>
        <p class="upload-text" v-html="uploadInstance.getConfig().explain"></p>
        <p class="upload-hint" v-html="uploadInstance.getSettings().tip"></p>
        <div class="upload-error-list pretty-scrollbar">
          <p class="error-info" v-for="(error, index) in renderData.errors" :key="index">
            {{ error }}
          </p>
        </div>
      </drop-file-input>
    </template>

    <template v-slot:listContainer>
      <TransitionGroup tag="div" name="fade" ref="listContainerRef" class="scroll-container pretty-scrollbar"
        v-on:mouseenter="renderData.scrollLock = true" v-on:mouseleave="renderData.scrollLock = false">
        <selected-file-info v-for="sortKey in renderData.selectedFileSortMapSize"
          v-bind:key="uploadInstance.getSelectedFileSortMap().get(sortKey)"
          :selectedFile="uploadInstance.getSelectedFile(sortKey)"
          :readyDrag="renderData.readyDraggingSortKey === sortKey"
          :startDrag="renderData.currentDraggingSortKey !== null"
          :dragging="renderData.currentDraggingSortKey === sortKey" :dragover="renderData.lastDraggingSortKey === sortKey &&
            renderData.currentDraggingSortKey !== sortKey
            " @setContainerRef="(el) => setContainerRef(sortKey, el)"
          @mouseDown="(event) => containerMouseDown(sortKey, event, false)"
          @mouseUp="(event) => containerMouseUp(sortKey, event, false)"
          @touchstart.native.prevent="(event) => containerMouseDown(sortKey, event, true)"
          @touchend.native.prevent="(event) => containerMouseUp(sortKey, event, true)"
          @touchcancel.native.prevent="(event) => containerMouseUp(sortKey, event, true)" v-slot="slotProps">
          <layout-info class="item-info-container" :slotProps="slotProps"></layout-info>
        </selected-file-info>
      </TransitionGroup>
    </template>
  </layout-index>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
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
    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: Multiple Upload Component(vue2) 已加载")
      : !1;
  },
  mounted() {
    //注册选择的文件集合变更事件
    this.uploadInstance.registerSelectedFileSortMapChanged(
      (sortMap: Map<number, number>) => {
        this.renderData.selectedFileSortMapSize = sortMap.size;
      }
    );

    //注册选择的文件集合变更事件
    this.uploadInstance.registerSelectedFileListChanged(this.scroll);

    const alertError = (error: Error) => {
      this.renderData.errors.push(error.message);
      setTimeout(() => {
        this.renderData.errors.shift();
      }, 5000);
    };

    //注册提示异常的事件
    if (this.uploadInstance.getSettings().alertErrorInfo)
      this.uploadInstance.registerAlertError(alertError);
  },
  methods: {
    /**
     * 列表容器引用对象
     */
    listContainerRef(): HTMLDivElement {
      return <HTMLDivElement>(<any>this.$refs.listContainerRef).$el;
    },
    /**
     * 滚动列表，将正在校验和正在上传的文件显示在当前的可视区域中
     *
     * @param files 当前的文件集合（已排序）
     */
    scroll(files: SelectedFile[]) {
      const _listContainerRef = this.listContainerRef();
      if (this.renderData.scrollLock || files.length == 0 || !_listContainerRef)
        return;

      //等待页面元素渲染完成
      this.$nextTick(() => {
        let container: HTMLDivElement | null = null;

        let findChecking = false;

        for (let i = 0; i < files.length; i++) {
          let file = files[i];

          if (!findChecking && file.checking) {
            findChecking = true;
            container = this.renderData.containerRefMap.get(i + 1)!;
          }

          if (file.uploading) {
            container = this.renderData.containerRefMap.get(i + 1)!;
            break;
          }
        }

        if (!container) return;

        //列表容器滚动至当前正在处理中的文件之处
        const calcValue =
          container!.offsetTop - _listContainerRef.offsetTop - 20;
        if (calcValue < 0 || calcValue == _listContainerRef.scrollTop) return;
        _listContainerRef.scrollTop = calcValue;
      });
    },

    /**
     * 设置文件选择框引用对象
     *
     * @param sortKey
     * @param el 引用对象
     */
    setContainerRef(sortKey: number, el: HTMLDivElement) {
      if (!el) return;
      this.renderData.containerRefMap.set(sortKey, el);
    },

    /**
     * 按下鼠标的事件
     *
     * @param sortKey
     * @param event
     * @param touch 是否来自touch事件
     */
    containerMouseDown(sortKey: number, event: any, touch: boolean) {
      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 按下鼠标的事件, sortKey: " + sortKey
        )
        : !1;

      const clientX = touch ? (<TouchEvent>event).targetTouches[0].clientX : (<MouseEvent>event).clientX;
      const clientY = touch ? (<TouchEvent>event).targetTouches[0].clientY : (<MouseEvent>event).clientY;

      this.ready2start(sortKey, clientX, clientY);
    },

    /**
     * 松开鼠标的事件
     *
     * @param sortKey
     * @param event
     * @param touch 是否来自touch事件
     */
    containerMouseUp(sortKey: number, event: any, touch: boolean) {
      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 松开鼠标的事件, sortKey: " + sortKey
        )
        : !1;

      this.end();
    },

    /**
     * 进入目标范围的事件
     *
     * @param targetKey
     */
    containerMouseEnter(targetKey: number) {
      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 进入目标范围的事件, targetKey: " + targetKey
        )
        : !1;

      //延时重新排序

      this.renderData.lastDraggingSortKey = targetKey;

      if (
        this.renderData.currentDraggingSortKey ===
        this.renderData.lastDraggingSortKey
      )
        return;

      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 延时重新排序, sortKey: " + targetKey
        )
        : !1;

      //TODO 自动将列表容器滚动至当前正在拖动的文件之处（注：此功能会和延迟重新排序功能冲突，暂不启用）
      // if (containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight) {
      // listContainerRef.scrollTop = containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight * 2 + 20 - listContainerRef.clientHeight;//containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight ? containerRefMap.get(renderData.lastDraggingSortKey).offsetTop - listContainerRef.offsetTop - 20 : 0;
      // drag4sort.draggingHelper.offset(0, listContainerRef.scrollTop);
      // console.debug('scrollTop', listContainerRef.scrollTop);
      // }

      this.renderData.drag4sort.changeTick && clearTimeout(this.renderData.drag4sort.changeTick);

      this.renderData.drag4sort.changeTick = setTimeout(
        this.changeSort,
        this.uploadInstance.getSettings().dragChangePositionTime
      );
    },

    /**
     * 重新排序
     */
    changeSort() {
      const currentIndex = this.renderData.currentDraggingSortKey!;
      const targetIndex = this.renderData.lastDraggingSortKey!;

      this.uploadInstance.changeSort(currentIndex, targetIndex);

      const current = this.renderData.containerRefMap.get(currentIndex)!;

      if (currentIndex > targetIndex) {
        for (let i = currentIndex; i > targetIndex; i--) {
          setInterval(() => { }, 100);
          this.renderData.containerRefMap.set(
            i,
            this.renderData.containerRefMap.get(i - 1)!
          );
        }
      } else {
        for (let i = currentIndex; i < targetIndex; i++) {
          this.renderData.containerRefMap.set(
            i,
            this.renderData.containerRefMap.get(i + 1)!
          );
        }
      }

      this.renderData.containerRefMap.set(targetIndex, current);

      this.end();
    },

    /**
     * 离开目标范围的事件
     */
    containerMouseLeave() {
      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 离开目标范围的事件"
        )
        : !1;

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
      if (!this.uploadInstance.getSettings().enableDrag) {
        this.uploadInstance.getSettings().debug
          ? console.debug(
            "Piece: Multiple Upload Component(vue2) 未启用拖动排序功能"
          )
          : !1;
        return;
      }

      if (this.uploadInstance.getSelectedFileList(false).length <= 1) return;

      this.uploadInstance.getSettings().debug
        ? console.debug(
          "Piece: Multiple Upload Component(vue2) 延时开启拖动功能, sortKey: " + sortKey
        )
        : !1;

      this.renderData.drag4sort.startTick && clearTimeout(this.renderData.drag4sort.startTick);

      this.renderData.drag4sort.startTick = setTimeout(() => {
        //准备拖动
        this.renderData.readyDraggingSortKey = sortKey;

        this.renderData.drag4sort.startTick = setTimeout(() => {
          if (!this.listContainerRef()) return;
          this.renderData.readyDraggingSortKey = null;
          //开始拖动
          this.renderData.currentDraggingSortKey = sortKey;
          this.renderData.drag4sort.draggingHelper = DraggingHelper.getInstance(
            this.listContainerRef() as HTMLElement,
            this.renderData.containerRefMap,
            this.renderData.currentDraggingSortKey,
            this.uploadInstance.getSettings().isMobile
          );
          (<DraggingHelper>this.renderData.drag4sort.draggingHelper).start(
            clientX,
            clientY, (targetKey, _clientX, _clientY) => {
              this.uploadInstance.getSettings().debug
                ? console.debug(
                  "Piece: Multiple Upload Component(vue2) 鼠标移动事件, sortKey: " + sortKey + ", clientX: " + _clientX + ", clientY: " + _clientY + ", targetKey: " + targetKey
                )
                : !1;

              targetKey == -1 ? this.containerMouseLeave() : this.containerMouseEnter(targetKey);
            });

          // //将拖动元素置于其他元素的底层
          // this.renderData.containerRefMap.forEach(
          //   (item: HTMLDivElement, key: number) => {
          //     if (key == this.renderData.currentDraggingSortKey)
          //       item.style.zIndex = "999";
          //   }
          // );
        }, this.uploadInstance.getSettings().dragPreparationTime);
      }, 500);
    },

    /**
     * 取消重新排序
     */
    cancelChange() {
      this.uploadInstance.getSettings().debug
        ? console.debug(
          'Piece: Multiple Upload Component(vue2) 取消重新排序'
        )
        : !1;

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

      this.uploadInstance.getSettings().debug
        ? console.debug(
          'Piece: Multiple Upload Component(vue2) 结束拖动并复原容器位置'
        )
        : !1;

      //结束拖动并复原位置
      (<DraggingHelper>this.renderData.drag4sort.draggingHelper).end(true);
      this.renderData.drag4sort.draggingHelper = null;

      //恢复其他元素的zIndex
      this.renderData.containerRefMap.forEach(
        (item: HTMLDivElement, key: number) => {
          if (key !== this.renderData.lastDraggingSortKey)
            item.style.zIndex = "";
        }
      );

      this.renderData.lastDraggingSortKey = null;
      this.renderData.currentDraggingSortKey = null;
    },
  },
});
</script>
