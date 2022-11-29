/// <reference types="node" />
import { PropType, ComponentPublicInstance } from "vue-demi";
import NaiveUpload from "../Core/NaiveUpload";
import DraggingHelper from "../Extention/DraggingHelper";
declare const _default: import("vue-demi").DefineComponent<{
    /**
     * 文件上传工具实例
     */
    upload: {
        type: PropType<NaiveUpload>;
        default(): any;
        require: boolean;
    };
}, {
    renderData: {
        scrollLock: boolean;
        readyDraggingSortKey: number | null;
        currentDraggingSortKey: number | null;
        lastDraggingSortKey: number | null;
        errors: string[];
        listContainerRef: HTMLDivElement | null;
        containerRefMap: Map<number, HTMLDivElement>;
        drag4sort: {
            startTick: {
                hasRef: () => boolean;
                refresh: () => NodeJS.Timeout;
                [Symbol.toPrimitive]: () => number;
                ref: () => NodeJS.Timeout;
                unref: () => NodeJS.Timeout;
            } | null;
            changeTick: {
                hasRef: () => boolean;
                refresh: () => NodeJS.Timeout;
                [Symbol.toPrimitive]: () => number;
                ref: () => NodeJS.Timeout;
                unref: () => NodeJS.Timeout;
            } | null;
            draggingHelper: {
                start: (this: DraggingHelper, clientX: number, clientY: number, handlerMoving?: ((event: MouseEvent) => void) | undefined) => void;
                offset: (this: DraggingHelper, x: number, y: number) => void;
                save: (this: DraggingHelper) => void;
                restore: (this: DraggingHelper) => void;
                end: (this: DraggingHelper, restore: boolean) => void;
            } | null;
            ready2start: (sortKey: number, clientX: number, clientY: number) => void;
            cancelChange: () => void;
            end: () => void;
        };
    };
}, unknown, {}, {
    /**
     * 设置列表引用对象
     *
     * @param el 引用对象
     */
    setListRef(el: Element | ComponentPublicInstance | null): void;
    /**
     * 设置文件选择框引用对象
     *
     * @param sortKey
     * @param el 引用对象
     */
    setContainerRef(sortKey: number, el: HTMLDivElement): void;
    /**
     * 按下鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseDown(sortKey: number, event: MouseEvent): void;
    /**
     * 松开鼠标的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseUp(sortKey: number, event: MouseEvent): void;
    /**
     * 鼠标进入的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseEnter(sortKey: number, event: MouseEvent): void;
    /**
     * 鼠标离开的事件
     *
     * @param sortKey
     * @param event
     */
    containerMouseLeave(sortKey: number, event: MouseEvent): void;
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
