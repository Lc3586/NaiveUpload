import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


// 文档: https://vitejs.dev/config/
export default defineConfig({
  root: './',
  // root: 'vue3docs',
  plugins: [
    vue()
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
});
