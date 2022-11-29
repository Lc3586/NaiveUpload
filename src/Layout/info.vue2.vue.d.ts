import { PropType, ComponentPublicInstance } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import SelectedFile from "../Model/SelectedFile";
declare const _default: import("vue-demi").DefineComponent<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
    /**
     * 插槽属性
     */
    slotProps: {
        type: PropType<{
            /**
             * 选择的文件
             */
            selectedFile: SelectedFile;
            /**
             * 重命名
             */
            rename: {
                /**
                 * 启用/禁用
                 */
                enable: () => boolean;
                /**
                 * 正在重命名
                 */
                active: boolean;
                /**
                 * 值
                 */
                value: string;
            };
            /**
             * 方法
             */
            funs: {
                /**
                 * 设置重命名输入框引用对象
                 *
                 * @param el 引用对象
                 */
                setRenameInputRef: (el: Element | ComponentPublicInstance | null) => void;
                /**
                 * 确认重命名
                 *
                 * @param {any} event
                 */
                renameKeydown: (event: KeyboardEvent) => void;
                /**
                 * 重命名结束
                 */
                renameDone: () => void;
            };
            /**
             * 显示/隐藏 加载层
             */
            loadingShow: boolean;
            /**
             * 加载层信息
             */
            loadingInfo: string;
        }>;
        require: boolean;
    };
}, {
    renderData: {
        loading: boolean;
        currentThemeInfo: any;
    };
}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {}, string, import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<import("vue-demi").ExtractPropTypes<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
    /**
     * 插槽属性
     */
    slotProps: {
        type: PropType<{
            /**
             * 选择的文件
             */
            selectedFile: SelectedFile;
            /**
             * 重命名
             */
            rename: {
                /**
                 * 启用/禁用
                 */
                enable: () => boolean;
                /**
                 * 正在重命名
                 */
                active: boolean;
                /**
                 * 值
                 */
                value: string;
            };
            /**
             * 方法
             */
            funs: {
                /**
                 * 设置重命名输入框引用对象
                 *
                 * @param el 引用对象
                 */
                setRenameInputRef: (el: Element | ComponentPublicInstance | null) => void;
                /**
                 * 确认重命名
                 *
                 * @param {any} event
                 */
                renameKeydown: (event: KeyboardEvent) => void;
                /**
                 * 重命名结束
                 */
                renameDone: () => void;
            };
            /**
             * 显示/隐藏 加载层
             */
            loadingShow: boolean;
            /**
             * 加载层信息
             */
            loadingInfo: string;
        }>;
        require: boolean;
    };
}>>, {
    upload: NaiveUpload;
}>;
export default _default;
