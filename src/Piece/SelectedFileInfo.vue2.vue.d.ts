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
     *
     */
    key: {
        type: NumberConstructor;
        require: boolean;
    };
    /**
     * 选择的文件
     */
    selectedFile: {
        type: PropType<SelectedFile>;
        require: boolean;
    };
    /**
     * 准备拖动
     */
    readyDrag: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 拖动操作已开始
     */
    startDrag: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 正在拖动
     */
    dragging: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 和拖动元素重叠
     */
    dragover: {
        type: BooleanConstructor;
        require: boolean;
    };
}, {
    renderData: {
        renameInputRef: HTMLInputElement | null;
        hover: boolean;
        rename: {
            active: boolean;
            value: string;
        };
    };
}, unknown, {}, {
    /**
     * 容器样式
     */
    containerStyle(): string;
    /**
     * 容器信息
     */
    containerInfo(): string;
    /**
     * 显示/隐藏 加载层
     */
    loadingShow(): boolean;
    /**
     * 加载层信息
     */
    loadingInfo(): string;
    /**
     * 显示/隐藏 工具栏
     */
    toolsShow(): boolean;
    /**
     * 启用/禁用 重命名
     */
    renameEnable(): boolean;
    /**
     * 启用/禁用 浏览
     */
    viewEnable(): boolean;
    /**
     * 启用/禁用 保存
     */
    saveEnable(): true;
    /**
     * 设置文件选择框引用对象
     *
     * @param el 引用对象
     */
    setContainerRef(el: Element | ComponentPublicInstance | null): void;
    /**
     * 设置重命名输入框引用对象
     *
     * @param el 引用对象
     */
    setRenameInputRef(el: Element | ComponentPublicInstance | null): void;
    /**
     * 鼠标进入的事件
     *
     * @param event
     */
    mouseEnter(event: MouseEvent): void;
    /**
     * 鼠标离开的事件
     *
     * @param event
     */
    mouseLeave(event: MouseEvent): void;
    /**
     * 按下鼠标的事件
     *
     * @param event
     */
    mouseDown(event: MouseEvent): void;
    /**
     * 松开鼠标的事件
     *
     * @param event
     */
    mouseUp(event: MouseEvent): void;
    /**
     * 重命名
     */
    rename(): void;
    /**
     * 确认重命名
     *
     * @param {any} event
     */
    renameKeydown(event: KeyboardEvent): void;
    /**
     * 重命名结束
     */
    renameDone(): void;
    /**
     * 查看
     */
    view(): void;
    /**
     * 保存
     */
    save(): void;
    /**
     * 删除
     */
    remove(): void;
}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, ("setContainerRef" | "mouseDown" | "mouseUp" | "mouseEnter" | "mouseLeave")[], "setContainerRef" | "mouseDown" | "mouseUp" | "mouseEnter" | "mouseLeave", import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<import("vue-demi").ExtractPropTypes<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
    /**
     *
     */
    key: {
        type: NumberConstructor;
        require: boolean;
    };
    /**
     * 选择的文件
     */
    selectedFile: {
        type: PropType<SelectedFile>;
        require: boolean;
    };
    /**
     * 准备拖动
     */
    readyDrag: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 拖动操作已开始
     */
    startDrag: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 正在拖动
     */
    dragging: {
        type: BooleanConstructor;
        require: boolean;
    };
    /**
     * 和拖动元素重叠
     */
    dragover: {
        type: BooleanConstructor;
        require: boolean;
    };
}>> & {
    onSetContainerRef?: ((...args: any[]) => any) | undefined;
    onMouseDown?: ((...args: any[]) => any) | undefined;
    onMouseUp?: ((...args: any[]) => any) | undefined;
    onMouseEnter?: ((...args: any[]) => any) | undefined;
    onMouseLeave?: ((...args: any[]) => any) | undefined;
}, {
    upload: NaiveUpload;
    readyDrag: boolean;
    startDrag: boolean;
    dragging: boolean;
    dragover: boolean;
}>;
export default _default;
