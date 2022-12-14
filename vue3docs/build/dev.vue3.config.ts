import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mdPlugin, { Mode } from 'vite-plugin-markdown';


// 文档: https://vitejs.dev/config/
export default defineConfig({
  root: './',
  // root: 'vue3docs',
  plugins: [
    vue(),
    mdPlugin({
      mode: [Mode.VUE]
    })
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
});
