import NaiveUpload from './index.vue2.vue';
import type { App, Component, Plugin } from "vue-demi";

const installer: Plugin = {
    install(app: App) {
        app.component("naive-upload", NaiveUpload);
    },
};

// type SFCWithInstall<T> = T & Plugin;
// const withInstall = <T>(component: Component) => {
//     (component as SFCWithInstall<T>).install = (app: App) => {
//         //注册组件
//         app.component("naive-upload", component);
//     }
//     return component as SFCWithInstall<T>;
// }

// export const installer = withInstall(NaiveUpload);

/**
 * 用于全局注册组件
 */
export default installer;

/**
 * 用于按需引用
 */
export {
    NaiveUpload
};

export * from './export';