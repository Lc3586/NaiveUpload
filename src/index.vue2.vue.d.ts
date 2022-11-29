import { PropType } from "vue-demi";
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import NaiveUpload from "./Core/NaiveUpload";
declare const _default: import("vue-demi").DefineComponent<{
    /**
     * 已上传的文件Id集合
     * <p>可选</p>
     */
    modelValue: {
        type: PropType<string[]>;
        default: () => string[];
        required: false;
    };
    /**
     * 设置
     * <p>可选</p>
     * <p>默认值Settings.default()</p>
     */
    settings: {
        type: PropType<Settings>;
        default: () => Settings;
        required: false;
    };
    /**
     * 接口服务
     * <p>必须</p>
     */
    apiService: {
        type: PropType<IApiService>;
        required: true;
    };
    /**
     * 只读模式
     * <p>默认值false</p>
     * <p>可选</p>
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}, {
    renderData: {
        loading: boolean;
        currentUpload: any;
    };
    upload: NaiveUpload | null;
}, unknown, {}, {}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, ("update:modelValue" | "setOpenApi" | "beforeCheck" | "afterCheck" | "afterCheckAll" | "afterUpload" | "afterUploadAll" | "error")[], "error" | "update:modelValue" | "setOpenApi" | "beforeCheck" | "afterCheck" | "afterCheckAll" | "afterUpload" | "afterUploadAll", import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<import("vue-demi").ExtractPropTypes<{
    /**
     * 已上传的文件Id集合
     * <p>可选</p>
     */
    modelValue: {
        type: PropType<string[]>;
        default: () => string[];
        required: false;
    };
    /**
     * 设置
     * <p>可选</p>
     * <p>默认值Settings.default()</p>
     */
    settings: {
        type: PropType<Settings>;
        default: () => Settings;
        required: false;
    };
    /**
     * 接口服务
     * <p>必须</p>
     */
    apiService: {
        type: PropType<IApiService>;
        required: true;
    };
    /**
     * 只读模式
     * <p>默认值false</p>
     * <p>可选</p>
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
}>> & {
    /**
     * 组件异常
     *
     * @param e
     * @param error 异常
     */
    onError?: ((...args: any[]) => any) | undefined;
    
    /**
     * 更新用户文件信息Id集合
     *
     * @param e
     * @param ids 用户文件信息Id集合
     */
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;

    /**
     * 设置组件开放的接口
     *
     * @param e
     * @param openApi 组件开放的接口
     */
    onSetOpenApi?: ((...args: any[]) => any) | undefined;

    /**
     * 文件校验前执行
     *
     * @param e
     * @param file 文件
     * @returns 是否处理并上传该文件
     */
    onBeforeCheck?: ((...args: any[]) => any) | undefined;

    /**
     * 文件校验结束后执行
     *
     * @param e
     * @param rawFile 文件
     */
    onAfterCheck?: ((...args: any[]) => any) | undefined;

    /**
     * 文件校验全部校验结束后执行
     *
     * @param e
     * @param rawFiles 文件集合
     */
    onAfterCheckAll?: ((...args: any[]) => any) | undefined;

    /**
     * 文件上传后执行
     *
     * @param e
     * @param rawFile 文件
     */
    onAfterUpload?: ((...args: any[]) => any) | undefined;

    /**
     * 所有文件上传后执行
     * <p>此方法不会等待</p>
     *
     * @param e
     * @param rawFiles 文件集合
     */
    onAfterUploadAll?: ((...args: any[]) => any) | undefined;
}, {
    readonly: boolean;
    modelValue: string[];
    settings: Settings;
}>;
export default _default;
