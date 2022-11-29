import { PropType } from "vue-demi";
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
     * 允许拖动/阻止冒泡事件
     *
     * @param {any} e
     */
    allowDrop(e: DragEvent): void;
    /**
     * 拖动文件
     *
     * @param {any} e
     */
    dropFile(e: DragEvent): void;
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
