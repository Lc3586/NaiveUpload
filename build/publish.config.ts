import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, '../src/export.ts'),
      name: 'NaiveUpload',
      fileName: (format) => `naive-upload.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'axios', 'spark-md5'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          axios: 'axios',
          SparkMD5: 'SparkMD5'
        }
      }
    }

    // target: 'modules',
    // //压缩
    // minify: false,
    // //css分离
    // cssCodeSplit: true,
    // rollupOptions: {
    //   // 确保外部化处理那些你不想打包进库的依赖
    //   external: ['vue', 'axios', 'spark-md5'],
    //   input: ['src/main.ts'],
    //   output: [
    //     {
    //       format: 'es',
    //       entryFileNames: '[name].js',
    //       //让打包目录和我们目录对应
    //       preserveModules: true,
    //       //配置打包根目录
    //       dir: 'es',
    //       preserveModulesRoot: 'src'
    //     },
    //     {
    //       format: 'cjs',
    //       entryFileNames: '[name].js',
    //       //让打包目录和我们目录对应
    //       preserveModules: true,
    //       //配置打包根目录
    //       dir: 'lib',
    //       preserveModulesRoot: 'src',
    //       // 在UMD构建模式下为这些外部化的依赖提供一个全局变量
    //       globals: {
    //         vue: 'Vue',
    //         axios: 'axios',
    //         SparkMD5: 'SparkMD5'
    //       }
    //     }
    //   ]
    // }
  }
})