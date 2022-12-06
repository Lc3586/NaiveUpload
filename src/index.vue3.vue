<!--
初级上传组件

支持大文件上传、多文件上传、文件秒传、断点续传，以及文件数量校验、文件大小校验、文件类型校验

@author LCTR
@date 2022-09-22
-->

<template>
  <div v-if="!renderData.loading">
    <component :is="renderData.currentUpload"></component>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ShallowRef, shallowRef } from "vue-demi";
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import SingleUpload from "./Piece/SingleUpload.vue3.vue";
import MultipleUpload from "./Piece/MultipleUpload.vue3.vue";
import NaiveUpload from "./Core/NaiveUpload";
import RawFile from "./Model/RawFile";
import { IOpenApi } from "./Extention/IOpenApi";
import { IConfig } from "./Model/IConfig";
import SelectedFile from "./Model/SelectedFile";

let upload = null as NaiveUpload | null;
//注册文件上传工具实例
provide("upload", () => upload);

/**
 * 渲染数据
 */
let renderData = reactive({
  /**
   * 加载状态
   */
  loading: true,

  /**
   * 当前的上传组件
   */
  currentUpload: null as ShallowRef<any> | null,
});

let rawFileList = reactive([] as RawFile[]);
let selectedFileList = reactive([] as SelectedFile[]);
let selectedFileSortMap = reactive(new Map<number, number>());

/**
 * 组件属性
 */
const props = withDefaults(
  defineProps<{
    /**
     * 已上传的文件Id集合
     * <p>只读</p>
     */
    modelValue?: string[];

    /**
     * 设置
     */
    settings?: Settings;

    /**
     * 接口服务
     */
    apiService: IApiService;

    /**
     * 只读模式
     */
    readonly?: boolean;
  }>(),
  {
    modelValue: () => [] as string[],
    settings: () => {
      return Settings.default();
    },
    readonly: false,
  }
);

/**
 * 组件自定义事件
 */
const emit = defineEmits<{
  /**
   * 更新用户文件信息Id集合
   *
   * @param e
   * @param ids 用户文件信息Id集合
   */
  (e: "update:modelValue", ids: string[]): void;

  /**
   * 设置组件开放的接口
   *
   * @param e
   * @param openApi 组件开放的接口
   */
  (e: "setOpenApi", openApi: IOpenApi): void;

  /**
   * 文件校验前执行
   *
   * @param e
   * @param file 文件
   * @returns 是否处理并上传该文件
   */
  (e: "beforeCheck", file: File): Promise<boolean>;

  /**
   * 文件校验结束后执行
   *
   * @param e
   * @param rawFile 文件
   */
  (e: "afterCheck", rawFile: RawFile): Promise<void>;

  /**
   * 文件校验全部校验结束后执行
   *
   * @param e
   * @param rawFiles 文件集合
   */
  (e: "afterCheckAll", rawFiles: RawFile[]): Promise<void>;

  /**
   * 文件上传后执行
   *
   * @param e
   * @param rawFile 文件
   */
  (e: "afterUpload", rawFile: RawFile): Promise<void>;

  /**
   * 所有文件上传后执行
   * <p>此方法不会等待</p>
   *
   * @param e
   * @param rawFiles 文件集合
   */
  (e: "afterUploadAll", rawFiles: RawFile[]): Promise<void>;

  /**
   * 组件异常
   *
   * @param e
   * @param error 异常
   */
  (e: "error", error: Error): Promise<void>;
}>();

/**
 * 初始化方法
 */
(async () => {
  if (props.apiService == null)
    throw new Error("必须设置一个IApiService的实现类");

  //获取文件上传工具实例
  if (props.readonly) props.settings.readonly = true;

  try {
    upload = await NaiveUpload.getInstance(props.settings, props.apiService);
  } catch (e: any) {
    emit("error", e);
    return;
  }

  upload.getSettings().debug
    ? console.debug("NaiveUpload Instance 已创建", Object.assign({}, upload))
    : !1;

  //设置各个回调事件
  upload.setupBeforeCheck((file: File) => {
    upload!.getSettings().debug
      ? console.debug("BeforeCheck => ", Object.assign({}, file))
      : !1;
    return emit("beforeCheck", file) === undefined
      ? new Promise<boolean>((resolve) => {
          resolve(true);
        })
      : emit("beforeCheck", file);
  });
  upload.setupAfterCheck((rawFile: RawFile) => {
    upload!.getSettings().debug
      ? console.debug("AfterCheck => ", Object.assign({}, rawFile))
      : !1;
    return emit("afterCheck", rawFile);
  });
  upload.setupAfterCheckAll((rawFileList: RawFile[]) => {
    upload!.getSettings().debug
      ? console.debug("AfterCheckAll => ", Object.assign({}, rawFileList))
      : !1;
    return emit("afterCheckAll", rawFileList);
  });
  upload.setupAfterUpload((rawFile: RawFile) => {
    upload!.getSettings().debug
      ? console.debug("AfterUpload => ", Object.assign({}, rawFile))
      : !1;

    props.modelValue.length = 0;
    upload!
      .getUserFileInfoList(true)
      .forEach((x) => props.modelValue.push(x.id));

    emit("update:modelValue", props.modelValue);

    upload!.getSettings().debug
      ? console.debug(
          "ModelValue UserFileIdList => ",
          Object.assign({}, props.modelValue)
        )
      : !1;
    return emit("afterUpload", rawFile);
  });
  upload.setupAfterUploadAll((rawFileList: RawFile[]) => {
    upload!.getSettings().debug
      ? console.debug("AfterUploadAll => ", Object.assign({}, rawFileList))
      : !1;
    return emit("afterUploadAll", rawFileList);
  });
  upload.setupHandlerError((error: Error) => {
    upload!.getSettings().debug
      ? console.debug("HandlerError => ", Object.assign({}, error))
      : !1;
    return emit("error", error);
  });

  const changConfig = (config?: IConfig) => {
    renderData.loading = true;
    //根据文件数量上限配置相应的上传组件
    if (upload!.getConfig().upperLimit == 1)
      renderData.currentUpload = shallowRef(SingleUpload);
    else renderData.currentUpload = shallowRef(MultipleUpload);

    renderData.loading = false;
    upload!.getSettings().debug
      ? console.debug("Layout：index Component 已变更")
      : !1;
  };

  //注册配置变更事件
  upload.registerConfigChanged(changConfig);

  //初始化
  changConfig();

  //设置组件开发的接口
  emit("setOpenApi", upload.getOpenApi());

  //添加之前已上传过的文件
  if (props.modelValue && props.modelValue.length > 0) {
    for (const id of props.modelValue) {
      await upload.appendById(id);
    }
  }

  renderData.loading = false;

  upload.getSettings().debug
    ? console.debug("Naive Upload Component(Vue3) 已加载")
    : !1;
})();
</script>

<style lang="scss" type="text/scss">
@import "index.scss";
</style>
