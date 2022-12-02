import { createApp } from "vue-demi";
import App from "./App.vue";
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import NaiveUploadPlugin from "@/export";
import '../dist/style.css';

createApp(App).use(ElementPlus).use(router).use(NaiveUploadPlugin).mount('#app');