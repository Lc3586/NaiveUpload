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
      <TransitionGroup
        tag="div"
        name="fade"
        ref="listContainerRef"
        class="scroll-container pretty-scrollbar"
        v-on:mouseenter="renderData.scrollLock = true"
        v-on:mouseleave="renderData.scrollLock = false"
      >
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
     * ??????????????????????????????
     */
    "upload",
  ],
  computed: {
    /**
     * ????????????????????????
     */
    uploadInstance(): NaiveUpload {
      return <NaiveUpload>(<any>this).upload();
    },
  },
  /**
   * ????????????
   */
  data() {
    return {
      renderData: {
        /**
         * ???????????????
         */
        scrollLock: false,

        /**
         * ?????????????????????
         */
        readyDraggingSortKey: null as number | null,

        /**
         * ??????????????????????????????
         */
        currentDraggingSortKey: null as number | null,

        /**
         * ????????????????????????????????????
         */
        lastDraggingSortKey: null as number | null,

        /**
         * ????????????
         */
        errors: [] as string[],

        /**
         * ????????????????????????
         */
        containerRefMap: new Map<number, HTMLDivElement>(),

        /**
         * ??????????????????
         */
        drag4sort: {
          /**
           * ????????????????????????????????????
           */
          startTick: null as NodeJS.Timeout | null,

          /**
           * ??????????????????????????????
           */
          changeTick: null as NodeJS.Timeout | null,

          /**
           * ??????????????????
           */
          draggingHelper: null as DraggingHelper | null,
        },
        selectedFileSortMapSize: 0 as number,
      },
    };
  },
  created() {
    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: Multiple Upload Component(vue2) ?????????")
      : !1;
  },
  mounted() {
    //???????????????????????????????????????
    this.uploadInstance.registerSelectedFileSortMapChanged(
      (sortMap: Map<number, number>) => {
        this.renderData.selectedFileSortMapSize = sortMap.size;
      }
    );

    //???????????????????????????????????????
    this.uploadInstance.registerSelectedFileListChanged(this.scroll);

    const alertError = (error: Error) => {
      this.renderData.errors.push(error.message);
      setTimeout(() => {
        this.renderData.errors.shift();
      }, 5000);
    };

    //???????????????????????????
    if (this.uploadInstance.getSettings().alertErrorInfo)
      this.uploadInstance.registerAlertError(alertError);
  },
  methods: {
    /**
     * ????????????????????????
     */
    listContainerRef(): HTMLDivElement {
      return <HTMLDivElement>(<any>this.$refs.listContainerRef).$el;
    },
    /**
     * ???????????????????????????????????????????????????????????????????????????????????????
     *
     * @param files ????????????????????????????????????
     */
    scroll(files: SelectedFile[]) {
      const _listContainerRef = this.listContainerRef();
      if (this.renderData.scrollLock || files.length == 0 || !_listContainerRef)
        return;

      //??????????????????????????????
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

        //?????????????????????????????????????????????????????????
        const calcValue =
          container!.offsetTop - _listContainerRef.offsetTop - 20;
        if (calcValue < 0 || calcValue == _listContainerRef.scrollTop) return;
        _listContainerRef.scrollTop = calcValue;
      });
    },

    /**
     * ?????????????????????????????????
     *
     * @param sortKey
     * @param el ????????????
     */
    setContainerRef(sortKey: number, el: HTMLDivElement) {
      if (!el) return;
      this.renderData.containerRefMap.set(sortKey, el);
    },

    /**
     * ?????????????????????
     *
     * @param sortKey
     * @param event
     */
    containerMouseDown(sortKey: number, event: MouseEvent) {
      this.ready2start(sortKey, event.clientX, event.clientY);
    },

    /**
     * ?????????????????????
     *
     * @param sortKey
     * @param event
     */
    containerMouseUp(sortKey: number, event: MouseEvent) {
      this.end();
    },

    /**
     * ?????????????????????
     *
     * @param sortKey
     * @param event
     */
    containerMouseEnter(sortKey: number, event: MouseEvent) {
      //??????????????????

      this.renderData.lastDraggingSortKey = sortKey;

      if (
        this.renderData.currentDraggingSortKey ===
        this.renderData.lastDraggingSortKey
      )
        return;

      //TODO ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      // if (containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight) {
      // listContainerRef.scrollTop = containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight * 2 + 20 - listContainerRef.clientHeight;//containerRefMap.get(renderData.lastDraggingSortKey).offsetTop + containerRefMap.get(renderData.lastDraggingSortKey).clientHeight + 20 > listContainerRef.clientHeight ? containerRefMap.get(renderData.lastDraggingSortKey).offsetTop - listContainerRef.offsetTop - 20 : 0;
      // drag4sort.draggingHelper.offset(0, listContainerRef.scrollTop);
      // console.debug('scrollTop', listContainerRef.scrollTop);
      // }

      this.renderData.drag4sort.changeTick = setTimeout(
        this.changeSort,
        this.uploadInstance.getSettings().dragChangePositionTime
      );
    },

    /**
     * ????????????
     */
    changeSort() {
      const currentIndex = this.renderData.currentDraggingSortKey!;
      const targetIndex = this.renderData.lastDraggingSortKey!;

      this.uploadInstance.changeSort(currentIndex, targetIndex);

      const current = this.renderData.containerRefMap.get(currentIndex)!;

      if (currentIndex > targetIndex) {
        for (let i = currentIndex; i > targetIndex; i--) {
          setInterval(() => {}, 100);
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
     * ?????????????????????
     *
     * @param sortKey
     * @param event
     */
    containerMouseLeave(sortKey: number, event: MouseEvent) {
      this.cancelChange();
    },

    /**
     * ????????????????????????
     *
     * @param sortKey
     * @param clientX
     * @param clientY
     */
    ready2start(sortKey: number, clientX: number, clientY: number) {
      if (!this.uploadInstance.getSettings().enableDrag) {
        this.uploadInstance.getSettings().debug
          ? console.debug(
              "Piece: Multiple Upload Component(vue2) ???????????????????????????"
            )
          : !1;
        return;
      }

      if (this.uploadInstance.getSelectedFileList(false).length <= 1) return;

      this.renderData.drag4sort.startTick = setTimeout(() => {
        //????????????
        this.renderData.readyDraggingSortKey = sortKey;

        this.renderData.drag4sort.startTick = setTimeout(() => {
          if (!this.listContainerRef()) return;
          this.renderData.readyDraggingSortKey = null;
          //????????????
          this.renderData.currentDraggingSortKey = sortKey;
          this.renderData.drag4sort.draggingHelper = DraggingHelper.getInstance(
            this.listContainerRef() as HTMLElement,
            this.renderData.containerRefMap.get(
              this.renderData.currentDraggingSortKey
            )!
          );
          (<DraggingHelper>this.renderData.drag4sort.draggingHelper).start(
            clientX,
            clientY
          );

          //??????????????????????????????????????????
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
     * ??????????????????
     */
    cancelChange() {
      this.renderData.drag4sort.changeTick &&
        clearTimeout(this.renderData.drag4sort.changeTick);
      this.renderData.lastDraggingSortKey = null;
    },

    /**
     * ?????????????????????????????????
     */
    end() {
      this.renderData.drag4sort.startTick &&
        clearTimeout(this.renderData.drag4sort.startTick);
      this.renderData.drag4sort.changeTick &&
        clearTimeout(this.renderData.drag4sort.changeTick);
      this.renderData.readyDraggingSortKey = null;

      if (!this.renderData.drag4sort.draggingHelper) return;

      //???????????????????????????
      (<DraggingHelper>this.renderData.drag4sort.draggingHelper).end(true);
      this.renderData.drag4sort.draggingHelper = null;

      //?????????????????????zIndex
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
