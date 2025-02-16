import { defineConfig } from 'vite';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';


// 文档: https://vitejs.dev/config/
export default defineConfig({
    root: './',
    plugins: [
        vue(),
        Components(
            {
                resolvers: [VantResolver()]
            }
        )
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            external: []
        }
    },
    optimizeDeps: {
        exclude: ['vue-demi']
    }
});
