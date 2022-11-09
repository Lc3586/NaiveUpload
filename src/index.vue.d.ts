import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import RawFile from "./Model/RawFile";
import "./index.css";
import { IOpenApi } from "./Extention/IOpenApi";
/**
 * 初级上传组件
 * 支持大文件上传、多文件上传、文件秒传、断点续传，以及文件数量校验、文件大小校验、文件类型校验
 * 
 * @author LCTR
 * @date 2022-09-22
*/
declare const _default: {
    new(...args: any[]): {
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            readonly: boolean;
            modelValue: string[];
            settings: Settings;
        }> & Omit<Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
            /**
             * 已上传的文件Id集合
             */
            modelValue?: string[] | undefined;
            /**
             * 设置
             */
            settings?: Settings | undefined;
            /**
             * 接口服务
             */
            apiService: IApiService;
            /**
             * 只读模式
             */
            readonly?: boolean | undefined;
        }>, {
            /**
             * 已上传的文件Id集合
             */
            modelValue: () => string[];
            /**
             * 设置
             */
            settings: () => Settings;
            /**
             * 只读模式
             */
            readonly: boolean;
        }>>> & {
            /**
             * 组件异常
             *
             * @param e
             * @param error 异常
             */
            onError?: ((error: Error) => any) | undefined;
            /**
             * 更新用户文件信息Id集合
             *
             * @param e
             * @param ids 用户文件信息Id集合
             */
            "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
            /**
             * 设置组件开放的接口
             *
             * @param e
             * @param openApi 组件开放的接口
             */
            onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
            /**
             * 文件校验前执行
             *
             * @param e
             * @param file 文件
             * @returns 是否处理并上传该文件
             */
            onBeforeCheck?: ((file: File) => any) | undefined;
            /**
             * 文件校验结束后执行
             *
             * @param e
             * @param rawFile 文件
             */
            onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
            /**
             * 文件校验全部校验结束后执行
             *
             * @param e
             * @param rawFiles 文件集合
             */
            onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
            /**
             * 文件上传后执行
             *
             * @param e
             * @param rawFile 文件
             */
            onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
            /**
             * 所有文件上传后执行
             * <p>此方法不会等待</p>
             *
             * @param e
             * @param rawFiles 文件集合
             */
            onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "readonly" | "modelValue" | "settings">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot | undefined;
        }>;
        $root: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: ((event: "error", error: Error) => void) & ((event: "update:modelValue", ids: string[]) => void) & ((event: "setOpenApi", openApi: IOpenApi) => void) & ((event: "beforeCheck", file: File) => void) & ((event: "afterCheck", rawFile: RawFile) => void) & ((event: "afterCheckAll", rawFiles: RawFile[]) => void) & ((event: "afterUpload", rawFile: RawFile) => void) & ((event: "afterUploadAll", rawFiles: RawFile[]) => void);
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
            /**
             * 已上传的文件Id集合
             */
            modelValue?: string[] | undefined;
            /**
             * 设置
             */
            settings?: Settings | undefined;
            /**
             * 接口服务
             */
            apiService: IApiService;
            /**
             * 只读模式
             */
            readonly?: boolean | undefined;
        }>, {
            /**
             * 已上传的文件Id集合
             */
            modelValue: () => string[];
            /**
             * 设置
             */
            settings: () => Settings;
            /**
             * 只读模式
             */
            readonly: boolean;
        }>>> & {
            /**
             * 组件异常
             *
             * @param e
             * @param error 异常
             */
            onError?: ((error: Error) => any) | undefined;
            /**
             * 更新用户文件信息Id集合
             *
             * @param e
             * @param ids 用户文件信息Id集合
             */
            "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
            /**
             * 设置组件开放的接口
             *
             * @param e
             * @param openApi 组件开放的接口
             */
            onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
            /**
             * 文件校验前执行
             *
             * @param e
             * @param file 文件
             * @returns 是否处理并上传该文件
             */
            onBeforeCheck?: ((file: File) => any) | undefined;
            /**
             * 文件校验结束后执行
             *
             * @param e
             * @param rawFile 文件
             */
            onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
            /**
             * 文件校验全部校验结束后执行
             *
             * @param e
             * @param rawFiles 文件集合
             */
            onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
            /**
             * 文件上传后执行
             *
             * @param e
             * @param rawFile 文件
             */
            onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
            /**
             * 所有文件上传后执行
             * <p>此方法不会等待</p>
             *
             * @param e
             * @param rawFiles 文件集合
             */
            onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
        }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            /**
             * 更新用户文件信息Id集合
             *
             * @param e
             * @param ids 用户文件信息Id集合
             */
            "update:modelValue": (ids: string[]) => void;
        } & {
            /**
             * 设置组件开放的接口
             *
             * @param e
             * @param openApi 组件开放的接口
             */
            setOpenApi: (openApi: IOpenApi) => void;
        } & {
            /**
             * 文件校验前执行
             *
             * @param e
             * @param file 文件
             * @returns 是否处理并上传该文件
             */
            beforeCheck: (file: File) => void;
        } & {
            /**
             * 文件校验结束后执行
             *
             * @param e
             * @param rawFile 文件
             */
            afterCheck: (rawFile: RawFile) => void;
        } & {
            /**
             * 文件校验全部校验结束后执行
             *
             * @param e
             * @param rawFiles 文件集合
             */
            afterCheckAll: (rawFiles: RawFile[]) => void;
        } & {
            /**
             * 文件上传后执行
             *
             * @param e
             * @param rawFile 文件
             */
            afterUpload: (rawFile: RawFile) => void;
        } & {
            /**
             * 所有文件上传后执行
             * <p>此方法不会等待</p>
             *
             * @param e
             * @param rawFiles 文件集合
             */
            afterUploadAll: (rawFiles: RawFile[]) => void;
        } & {
            /**
             * 组件异常
             *
             * @param e
             * @param error 异常
             */
            error: (error: Error) => void;
        }, string, {
            /**
             * 只读模式
             */
            readonly: boolean;
            /**
             * 已上传的文件Id集合
             */
            modelValue: string[];
            /**
             * 设置
             */
            settings: Settings;
        }> & {
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
            renderTracked?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean> | undefined): import("vue").WatchStopHandle;
    } & Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
        /**
         * 已上传的文件Id集合
         */
        modelValue?: string[] | undefined;
        /**
         * 设置
         */
        settings?: Settings | undefined;
        /**
         * 接口服务
         */
        apiService: IApiService;
        /**
         * 只读模式
         */
        readonly?: boolean | undefined;
    }>, {
        /**
         * 已上传的文件Id集合
         */
        modelValue: () => string[];
        /**
         * 设置
         */
        settings: () => Settings;
        /**
         * 只读模式
         */
        readonly: boolean;
    }>>> & {
        /**
         * 组件异常
         *
         * @param e
         * @param error 异常
         */
        onError?: ((error: Error) => any) | undefined;
        /**
         * 更新用户文件信息Id集合
         *
         * @param e
         * @param ids 用户文件信息Id集合
         */
        "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
        /**
         * 设置组件开放的接口
         *
         * @param e
         * @param openApi 组件开放的接口
         */
        onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
        /**
         * 文件校验前执行
         *
         * @param e
         * @param file 文件
         * @returns 是否处理并上传该文件
         */
        onBeforeCheck?: ((file: File) => any) | undefined;
        /**
         * 文件校验结束后执行
         *
         * @param e
         * @param rawFile 文件
         */
        onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
        /**
         * 文件校验全部校验结束后执行
         *
         * @param e
         * @param rawFiles 文件集合
         */
        onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
        /**
         * 文件上传后执行
         *
         * @param e
         * @param rawFile 文件
         */
        onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
        /**
         * 所有文件上传后执行
         * <p>此方法不会等待</p>
         *
         * @param e
         * @param rawFiles 文件集合
         */
        onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
    } & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    /**
     * 已上传的文件Id集合
     */
    modelValue?: string[] | undefined;
    /**
     * 设置
     */
    settings?: Settings | undefined;
    /**
     * 接口服务
     */
    apiService: IApiService;
    /**
     * 只读模式
     */
    readonly?: boolean | undefined;
}>, {
    /**
     * 已上传的文件Id集合
     */
    modelValue: () => string[];
    /**
     * 设置
     */
    settings: () => Settings;
    /**
     * 只读模式
     */
    readonly: boolean;
}>>> & {
    /**
     * 组件异常
     *
     * @param e
     * @param error 异常
     */
    onError?: ((error: Error) => any) | undefined;
    /**
     * 更新用户文件信息Id集合
     *
     * @param e
     * @param ids 用户文件信息Id集合
     */
    "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
    /**
     * 设置组件开放的接口
     *
     * @param e
     * @param openApi 组件开放的接口
     */
    onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
    /**
     * 文件校验前执行
     *
     * @param e
     * @param file 文件
     * @returns 是否处理并上传该文件
     */
    onBeforeCheck?: ((file: File) => any) | undefined;
    /**
     * 文件校验结束后执行
     *
     * @param e
     * @param rawFile 文件
     */
    onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
    /**
     * 文件校验全部校验结束后执行
     *
     * @param e
     * @param rawFiles 文件集合
     */
    onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
    /**
     * 文件上传后执行
     *
     * @param e
     * @param rawFile 文件
     */
    onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
    /**
     * 所有文件上传后执行
     * <p>此方法不会等待</p>
     *
     * @param e
     * @param rawFiles 文件集合
     */
    onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    /**
     * 更新用户文件信息Id集合
     *
     * @param e
     * @param ids 用户文件信息Id集合
     */
    "update:modelValue": (ids: string[]) => void;
} & {
    /**
     * 设置组件开放的接口
     *
     * @param e
     * @param openApi 组件开放的接口
     */
    setOpenApi: (openApi: IOpenApi) => void;
} & {
    /**
     * 文件校验前执行
     *
     * @param e
     * @param file 文件
     * @returns 是否处理并上传该文件
     */
    beforeCheck: (file: File) => void;
} & {
    /**
     * 文件校验结束后执行
     *
     * @param e
     * @param rawFile 文件
     */
    afterCheck: (rawFile: RawFile) => void;
} & {
    /**
     * 文件校验全部校验结束后执行
     *
     * @param e
     * @param rawFiles 文件集合
     */
    afterCheckAll: (rawFiles: RawFile[]) => void;
} & {
    /**
     * 文件上传后执行
     *
     * @param e
     * @param rawFile 文件
     */
    afterUpload: (rawFile: RawFile) => void;
} & {
    /**
     * 所有文件上传后执行
     * <p>此方法不会等待</p>
     *
     * @param e
     * @param rawFiles 文件集合
     */
    afterUploadAll: (rawFiles: RawFile[]) => void;
} & {
    /**
     * 组件异常
     *
     * @param e
     * @param error 异常
     */
    error: (error: Error) => void;
}, string, {
    /**
     * 只读模式
     */
    readonly: boolean;
    /**
     * 已上传的文件Id集合
     */
    modelValue: string[];
    /**
     * 设置
     */
    settings: Settings;
}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
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
declare type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? P[K] & {
        default: D[K];
    } : P[K];
};
