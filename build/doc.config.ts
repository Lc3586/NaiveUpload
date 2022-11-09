import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// 文档: https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        },
    },
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
        })
    ],
    build: {
        outDir: 'dist'
    }
});
