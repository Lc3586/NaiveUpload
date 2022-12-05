import { defineConfig } from 'vite';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import mdPlugin, { Mode } from 'vite-plugin-markdown';


// 文档: https://vitejs.dev/config/
export default defineConfig({
    root: 'docs',
    resolve: {
        alias: {
            '@doc': resolve(__dirname, '../src')
        },
    },
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
        mdPlugin({
            mode: [Mode.VUE]
        })
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            external: [

            ]
        }
    }
});
