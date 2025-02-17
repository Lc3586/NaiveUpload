<template>
  <el-tabs :tab-position="tabPosition">
    <el-tab-pane v-for="(link, index) in data.links">
      <template #label>
        <router-link :key="index" :to="link.path">{{ link.name }}</router-link>
      </template>
      <router-view></router-view>
    </el-tab-pane>
  </el-tabs>

  <el-backtop :right="backtopRight" :bottom="100" />
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import router from "./router";
import MobileHelper from "./utils/mobile/Helper";

const data = reactive({
  links: router.getRoutes().splice(1).map((item) => ({
    path: item.path,
    name: item.name,
  })),
});

const tabPosition = ref(MobileHelper.isMobile() ? "top" : "left");
const backtopRight = ref(MobileHelper.isMobile() ? 10 : 100);
</script>
<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

.naive-upload-doc {
  display: flex;
  min-height: 100vh;
}

.naive-upload-doc aside {
  width: 200px;
  padding: 15px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.naive-upload-doc main {
  width: 100%;
  flex: 1;
  padding: 15px;
}

.naive-upload-doc a {}
</style>