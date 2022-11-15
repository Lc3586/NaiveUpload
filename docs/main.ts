import { createApp } from "vue";
import App from "./App.vue";
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import NaiveUploadPlugin from "@/export";
import '../dist/style.css';

const app = createApp(App)
app.use(ElementPlus).use(router).use(NaiveUploadPlugin).mount('#app');