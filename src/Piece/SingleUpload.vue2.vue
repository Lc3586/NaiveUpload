<template>
  <layout-index>
    <template v-if="!upload?.getSettings().readonly" v-slot:uploadContainer>
      <file-input
        v-if="!upload?.anyFile()"
        class="upload-box-container single"
        :title="upload?.getConfig().explain"
      >
        <p class="upload-icon icon-select-file"></p>
      </file-input>
    </template>

    <template v-slot:listContainer>
      <selected-file-info
        v-for="sortKey in upload?.getSelectedFileSortMap().size"
        :key="sortKey"
        :selectedFile="upload?.getSelectedFile(sortKey)"
        v-slot="slotProps"
      >
        <layout-info
          class="item-info-container"
          :slotProps="slotProps"
        ></layout-info>
      </selected-file-info>
    </template>
  </layout-index>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import FileInput from "../Piece/FileInput.vue2.vue";
import SelectedFileInfo from "../Piece/SelectedFileInfo.vue2.vue";
import LayoutIndex from "../Layout/index.vue2.vue";
import LayoutInfo from "../Layout/info.vue2.vue";

export default defineComponent({
  name: "SingleUpload",
  components: {
    FileInput,
    SelectedFileInfo,
    LayoutIndex,
    LayoutInfo,
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
  setup(props) {},
  created() {
    (this.upload as NaiveUpload).getSettings().debug
      ? console.debug("Piece: Single Upload Component(vue2) 已加载")
      : !1;
  },
});
</script>
