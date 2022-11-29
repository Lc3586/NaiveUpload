import { PropType, ComponentPublicInstance } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
declare const _default: import("vue-demi").DefineComponent<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
}, void, unknown, {}, {
    /**
     * 设置文件选择框引用对象
     *
     * @param el 引用对象
     */
    setFileInputRef(el: Element | ComponentPublicInstance | null): void;
    /**
     * 选择文件
     *
     * @param e
     */
    chosingFile(e: MouseEvent): void;
    /**
     * 已选择文件
     *
     * @param {any} e
     */
    choseFile(e: Event): void;
}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {}, string, import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<import("vue-demi").ExtractPropTypes<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
}>>, {
    upload: NaiveUpload;
}>;
export default _default;
