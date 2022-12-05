import { createApp } from "vue";
import App from "./App.vue";
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import NaiveUploadPlugin from "@doc/export.vue3";
import '../dist/style.css';

createApp(App).use(ElementPlus).use(router).use(NaiveUploadPlugin).mount('#app');