<template>
  <layout-index>
    <template
      v-if="!uploadInstance.getSettings().readonly"
      v-slot:uploadContainer
    >
      <file-input
        v-if="!uploadInstance.anyFile()"
        class="upload-box-container single"
        :title="uploadInstance.getConfig().explain"
      >
        <p class="upload-icon icon-select-file"></p>
      </file-input>
    </template>

    <template v-slot:listContainer>
      <selected-file-info
        v-for="sortKey in uploadInstance.getSelectedFileSortMap().size"
        :key="sortKey"
        :selectedFile="uploadInstance.getSelectedFile(sortKey)"
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
import { defineComponent } from "vue-demi";
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
  created() {
    this.uploadInstance.getSettings().debug
      ? console.debug("Piece: Single Upload Component(vue2) 已加载")
      : !1;
  },
});
</script>
