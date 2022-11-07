<template>
  <layout-index>
    <template v-if="!upload.getSettings().readonly" v-slot:uploadContainer>
      <file-input
        v-if="!upload.anyFile()"
        class="upload-box-container single"
        :title="upload.getConfig().explain"
      >
        <p class="upload-icon icon-select-file"></p>
      </file-input>
    </template>

    <template v-slot:listContainer>
      <selected-file-info
        v-for="sortKey in upload.getSelectedFileSortMap().size"
        :key="sortKey"
        :selectedFile="upload.getSelectedFile(sortKey)"
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

<script setup lang="ts">
import { inject } from "vue";
import NaiveUpload from "../Core/NaiveUpload";
import FileInput from "../Piece/FileInput.vue";
import SelectedFileInfo from "../Piece/SelectedFileInfo.vue";
import LayoutIndex from "../Layout/index.vue";
import LayoutInfo from "../Layout/info.vue";

//注入文件上传工具实例
const upload = (inject("upload") as () => NaiveUpload)();

/**
 * 初始化方法
 */
(async () => {
  upload.getSettings().debug
    ? console.debug("Piece: Single Upload Component 已加载")
    : !1;
})();
</script>