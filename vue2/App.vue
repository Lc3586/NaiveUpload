<template>
  <div class="naive-upload-doc">
    <main>
      <Demo />
    </main>
  </div>
</template>
<script lang="ts">
import Demo from "./demo.vue";

export default {
  name: "Vue2 App",
  components: {
    Demo,
  },
};
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
