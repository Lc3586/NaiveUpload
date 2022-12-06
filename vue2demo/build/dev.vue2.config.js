import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';


// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  // root: 'vue2demo',
  resolve: {
    alias: {
      '@': '../../src'
    }
  },
  plugins: [
    createVuePlugin()
  ],
  css: {
    preprocessorOptions: {
      scss: {

      }
    }
  }
})