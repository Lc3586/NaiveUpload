import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import RawFile from "./Model/RawFile";
import { IOpenApi } from "./Extention/IOpenApi";
declare const _default: {
    new (...args: any[]): {
        $: import("vue-demi").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            readonly: boolean;
            modelValue: string[];
            settings: Settings;
        }> & Omit<Readonly<import("vue-demi").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
            modelValue: () => string[];
            settings: () => Settings;
            readonly: boolean;
        }>>> & {
            onError?: ((error: Error) => any) | undefined;
            "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
            onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
            onBeforeCheck?: ((file: File) => any) | undefined;
            onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
            onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
            onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
            onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
        } & import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, "readonly" | "modelValue" | "settings">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue-demi").Slot | undefined;
        }>;
        $root: import("vue-demi").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: import("vue-demi").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: ((event: "error", error: Error) => void) & ((event: "update:modelValue", ids: string[]) => void) & ((event: "setOpenApi", openApi: IOpenApi) => void) & ((event: "beforeCheck", file: File) => void) & ((event: "afterCheck", rawFile: RawFile) => void) & ((event: "afterCheckAll", rawFiles: RawFile[]) => void) & ((event: "afterUpload", rawFile: RawFile) => void) & ((event: "afterUploadAll", rawFiles: RawFile[]) => void);
        $el: any;
        $options: import("vue-demi").ComponentOptionsBase<Readonly<import("vue-demi").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
            modelValue: () => string[];
            settings: () => Settings;
            readonly: boolean;
        }>>> & {
            onError?: ((error: Error) => any) | undefined;
            "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
            onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
            onBeforeCheck?: ((file: File) => any) | undefined;
            onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
            onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
            onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
            onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
        }, {}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {
            "update:modelValue": (ids: string[]) => void;
        } & {
            setOpenApi: (openApi: IOpenApi) => void;
        } & {
            beforeCheck: (file: File) => void;
        } & {
            afterCheck: (rawFile: RawFile) => void;
        } & {
            afterCheckAll: (rawFiles: RawFile[]) => void;
        } & {
            afterUpload: (rawFile: RawFile) => void;
        } & {
            afterUploadAll: (rawFiles: RawFile[]) => void;
        } & {
            error: (error: Error) => void;
        }, string, {
            readonly: boolean;
            modelValue: string[];
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
            renderTracked?: (((e: import("vue-demi").DebuggerEvent) => void) | ((e: import("vue-demi").DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: import("vue-demi").DebuggerEvent) => void) | ((e: import("vue-demi").DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: import("vue-demi").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue-demi").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue-demi").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue-demi").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue-demi").WatchOptions<boolean> | undefined): import("vue-demi").WatchStopHandle;
    } & Readonly<import("vue-demi").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
        modelValue: () => string[];
        settings: () => Settings;
        readonly: boolean;
    }>>> & {
        onError?: ((error: Error) => any) | undefined;
        "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
        onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
        onBeforeCheck?: ((file: File) => any) | undefined;
        onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
        onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
        onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
        onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
    } & import("vue-demi").ShallowUnwrapRef<{}> & {} & import("vue-demi").ComponentCustomProperties;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue-demi").ComponentOptionsBase<Readonly<import("vue-demi").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
    modelValue: () => string[];
    settings: () => Settings;
    readonly: boolean;
}>>> & {
    onError?: ((error: Error) => any) | undefined;
    "onUpdate:modelValue"?: ((ids: string[]) => any) | undefined;
    onSetOpenApi?: ((openApi: IOpenApi) => any) | undefined;
    onBeforeCheck?: ((file: File) => any) | undefined;
    onAfterCheck?: ((rawFile: RawFile) => any) | undefined;
    onAfterCheckAll?: ((rawFiles: RawFile[]) => any) | undefined;
    onAfterUpload?: ((rawFile: RawFile) => any) | undefined;
    onAfterUploadAll?: ((rawFiles: RawFile[]) => any) | undefined;
}, {}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, {
    "update:modelValue": (ids: string[]) => void;
} & {
    setOpenApi: (openApi: IOpenApi) => void;
} & {
    beforeCheck: (file: File) => void;
} & {
    afterCheck: (rawFile: RawFile) => void;
} & {
    afterCheckAll: (rawFiles: RawFile[]) => void;
} & {
    afterUpload: (rawFile: RawFile) => void;
} & {
    afterUploadAll: (rawFiles: RawFile[]) => void;
} & {
    error: (error: Error) => void;
}, string, {
    readonly: boolean;
    modelValue: string[];
    settings: Settings;
}> & import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps;
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
