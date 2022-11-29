import NaiveUpload from '../src/index.vue2.vue';
import type { Plugin } from "vue-demi";
declare const installer: Plugin;
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
export * from '../src/export.base';
