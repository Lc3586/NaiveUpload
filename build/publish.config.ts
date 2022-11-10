import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts';

import lib from "../package.json";
const year = new Date().getFullYear();
const banner = `// NaiveUpload v${lib.version} Copyright (c) ${year} ${lib.author}`;

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'filetypes': resolve(__dirname, './dist/filetypes')
    }
  },
  plugins: [
    vue(),
    dts({
      root: "src",
      outputDir: "../lib",
      // compilerOptions:,
      tsConfigFilePath: "../tsconfig.json",
      insertTypesEntry: true,
      skipDiagnostics: true,
      noEmitOnError: true
    })
  ],
  optimizeDeps: {
    disabled: true,
  },
  build: {
    //关闭压缩
    minify: false,
    //css分离
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, '../src/export.ts'),
      name: 'NaiveUpload',
      // fileName: (format) => `naive-upload.${format}.js`
    },
    rollupOptions: {
      input: ['src/export.ts'],
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'axios', 'spark-md5'],
      output: [
        {
          format: "umd",
          entryFileNames: 'naive-upload.min.js',
          //配置打包根目录
          dir: 'dist',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            axios: 'axios',
            SparkMD5: 'SparkMD5'
          },
          banner
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          //配置打包根目录
          dir: 'dist/node',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            axios: 'axios',
            SparkMD5: 'SparkMD5'
          },
          banner
        },
        {
          format: 'esm',
          entryFileNames: '[name].js',
          //配置打包根目录
          dir: 'dist/esm',
          banner
        },
        {
          format: 'module',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: 'lib',
          preserveModulesRoot: 'src',
          banner
        }
      ],
    }
  }
})