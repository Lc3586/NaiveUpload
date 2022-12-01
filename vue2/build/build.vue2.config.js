import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';


import lib from "../../package.json";
const year = new Date().getFullYear();
const banner = `// NaiveUpload v${lib.version} Copyright (c) ${year} ${lib.author}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin()
  ],
  css: {
    preprocessorOptions: {
      scss: {

      }
    }
  },
  optimizeDeps: {
    // disabled: true,
    exclude: ['vue-demi']
  },
  build: {
    //压缩
    minify: true,
    //css分离
    cssCodeSplit: false,
    //源码映射
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, '../src/export.vue2.ts'),
      name: 'NaiveUpload',
      // fileName: (format) => `naive-upload.${format}.js`
    },
    rollupOptions: {
      input: ['../src/export.vue2.ts'],
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@vue/composition-api', 'vue-demi', 'axios', 'spark-md5'],
      output: [
        {
          format: "umd",
          entryFileNames: 'naive-upload.min.js',
          //配置打包根目录
          dir: '../dist/vue2',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            vue_composition_api: '@vue/composition-api',
            vue_demi: 'vue-demi',
            axios: 'axios',
            SparkMD5: 'SparkMD5'
          },
          banner
        },
        {
          format: 'cjs',
          entryFileNames: 'naive-upload.min.cjs',
          //配置打包根目录
          dir: '../dist/vue2/node',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            vue_composition_api: '@vue/composition-api',
            vue_demi: 'vue-demi',
            axios: 'axios',
            SparkMD5: 'SparkMD5'
          },
          banner
        },
        {
          format: 'esm',
          entryFileNames: 'naive-upload.js',
          //配置打包根目录
          dir: '../dist/vue2/esm',
          banner
        },
        {
          format: 'module',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: '../lib/vue2',
          preserveModulesRoot: 'src',
          banner
        }
      ],
    }
  }
})