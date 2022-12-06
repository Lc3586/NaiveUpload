import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import NaiveUploadPlugin from "../src/export.vue2";


Vue.use(VueCompositionAPI);
Vue.use(Element);
// Vue.use(NaiveUploadPlugin);
new Vue({
    el: '#app',
    render: h => h(App)
})
