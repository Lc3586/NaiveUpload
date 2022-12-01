import NaiveUpload from './index.vue2.vue';

const installer: any = {
    install(vue: any) {
        vue.component("naive-upload", NaiveUpload);
    },
};

/**
 * 用于全局注册组件
 */
export default installer;

/**
 * 用于按需引用
 */
export {
    /**
     * 文件上传组件
     */
    NaiveUpload
};

export * from './export.base';