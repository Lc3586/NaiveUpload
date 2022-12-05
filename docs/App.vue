<template>
  <div class="naive-upload-doc">
    <aside>
      <router-link
        v-for="(link, index) in data.links"
        :key="index"
        :to="link.path"
        >{{ link.name }}</router-link
      >
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import router from "./router";

const data = reactive({
  links: router.getRoutes().map((item) => ({
    path: item.path,
    name: item.name,
  })),
});
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

.naive-upload-doc a {
    
}
</style>