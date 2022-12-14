import { ComponentPublicInstance } from "vue-demi";
import SelectedFile from "../Model/SelectedFile";
declare const _default: {
    new (...args: any[]): {
        $: import("vue-demi").ComponentInternalInstance;
        $data: {};
        $props: Partial<{}> & Omit<Readonly<import("vue-demi").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
            key: number;
            /**
             * 选择的文件
             */
            selectedFile: SelectedFile;
            /**
             * 准备拖动
             */
            readyDrag?: boolean | undefined;
            /**
             * 拖动操作已开始
             */
            startDrag?: boolean | undefined;
            /**
             * 正在拖动
             */
            dragging?: boolean | undefined;
            /**
             * 和拖动元素重叠
             */
            dragover?: boolean | undefined;
        }>>> & {
            onSetContainerRef?: ((el: HTMLDivElement) => any) | undefined;
            onMouseDown?: ((event: MouseEvent) => any) | undefined;
            onMouseUp?: ((event: MouseEvent) => any) | undefined;
            onMouseEnter?: ((event: MouseEvent) => any) | undefined;
            onMouseLeave?: ((event: MouseEvent) => any) | undefined;
        } & import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, never>;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue-demi").Slot | undefined;
        }>;
        $root: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: ((event: "setContainerRef", el: HTMLDivElement) => void) & ((event: "mouseDown", event: MouseEvent) => void) & ((event: "mouseUp", event: MouseEvent) => void) & ((event: "mouseEnter", event: MouseEvent) => void) & ((event: "mouseLeave", event: MouseEvent) => void);
        $el: any;
        $options: import("vue-demi").ComponentOptionsBase<Readonly<import("vue-demi").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
            key: number;
            /**
             * 选择的文件
             */
            selectedFile: SelectedFile;
            /**
             * 准备拖动
             */
            readyDrag?: boolean | undefined;
            /**
             * 拖动操作已开始
             */
            startDrag?: boolean | undefined;
            /**
             * 正在拖动
             */
            dragging?: boolean | undefined;
            /**
             * 和拖动元素重叠
             */
            dragover?: boolean | undefined;
        }>>> & {
            onSetContainerRef?: ((el: HTMLDivElement) => any) | undefined;
            onMouseDown?: ((event: MouseEvent) => any) | undefined;
            onMouseUp?: ((event: MouseEvent) => any) | undefined;
            onMouseEnter?: ((event: MouseEvent) => any) | undefined;
            onMouseLeave?: ((event: MouseEvent) => any) | undefined;
        }, {}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {
            setContainerRef: (el: HTMLDivElement) => void;
        } & {
            mouseDown: (event: MouseEvent) => void;
        } & {
            mouseUp: (event: MouseEvent) => void;
        } & {
            mouseEnter: (event: MouseEvent) => void;
        } & {
            mouseLeave: (event: MouseEvent) => void;
        }, string, {}> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: import("vue-demi").DebuggerEvent) => void) | ((e: import("vue-demi").DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: import("vue-demi").DebuggerEvent) => void) | ((e: import("vue-demi").DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | ((err: unknown, instance: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue-demi").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue-demi").WatchOptions<boolean> | undefined): import("vue-demi").WatchStopHandle;
    } & Readonly<import("vue-demi").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
        key: number;
        /**
         * 选择的文件
         */
        selectedFile: SelectedFile;
        /**
         * 准备拖动
         */
        readyDrag?: boolean | undefined;
        /**
         * 拖动操作已开始
         */
        startDrag?: boolean | undefined;
        /**
         * 正在拖动
         */
        dragging?: boolean | undefined;
        /**
         * 和拖动元素重叠
         */
        dragover?: boolean | undefined;
    }>>> & {
        onSetContainerRef?: ((el: HTMLDivElement) => any) | undefined;
        onMouseDown?: ((event: MouseEvent) => any) | undefined;
        onMouseUp?: ((event: MouseEvent) => any) | undefined;
        onMouseEnter?: ((event: MouseEvent) => any) | undefined;
        onMouseLeave?: ((event: MouseEvent) => any) | undefined;
    } & import("vue-demi").ShallowUnwrapRef<{}> & {} & import("vue-demi").ComponentCustomProperties;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue-demi").ComponentOptionsBase<Readonly<import("vue-demi").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    key: number;
    /**
     * 选择的文件
     */
    selectedFile: SelectedFile;
    /**
     * 准备拖动
     */
    readyDrag?: boolean | undefined;
    /**
     * 拖动操作已开始
     */
    startDrag?: boolean | undefined;
    /**
     * 正在拖动
     */
    dragging?: boolean | undefined;
    /**
     * 和拖动元素重叠
     */
    dragover?: boolean | undefined;
}>>> & {
    onSetContainerRef?: ((el: HTMLDivElement) => any) | undefined;
    onMouseDown?: ((event: MouseEvent) => any) | undefined;
    onMouseUp?: ((event: MouseEvent) => any) | undefined;
    onMouseEnter?: ((event: MouseEvent) => any) | undefined;
    onMouseLeave?: ((event: MouseEvent) => any) | undefined;
}, {}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {
    setContainerRef: (el: HTMLDivElement) => void;
} & {
    mouseDown: (event: MouseEvent) => void;
} & {
    mouseUp: (event: MouseEvent) => void;
} & {
    mouseEnter: (event: MouseEvent) => void;
} & {
    mouseLeave: (event: MouseEvent) => void;
}, string, {}> & import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps & (new () => {
    $slots: {
        default: (_: {
            selectedFile: SelectedFile;
            rename: {
                enable: () => boolean;
                active: boolean;
                value: string;
            };
            funs: {
                setRenameInputRef: (el: Element | ComponentPublicInstance | null) => void;
                renameKeydown: (event: KeyboardEvent) => void;
                renameDone: () => void;
            };
            loading: {
                show: () => boolean;
                info: () => string;
            };
        }) => any;
    };
});
export default _default;
declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
declare type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
