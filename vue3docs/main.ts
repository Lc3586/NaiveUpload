import { createApp } from "vue";
import App from "./App.vue";
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import 'default-passive-events';
import './utils/BrowserPatch';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

createApp(App).use(VMdPreview).use(ElementPlus).use(router).mount('#app');