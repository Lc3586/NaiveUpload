<!--
初级上传组件

支持大文件上传、多文件上传、文件秒传、断点续传，以及文件数量校验、文件大小校验、文件类型校验

@author LCTR
@date 2022-09-22
-->

<template>
  <div v-if="!loading">
    <component :is="currentUpload"></component>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  reactive,
  ShallowRef,
  shallowRef,
  PropType,
} from "vue-demi";
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import SingleUpload from "./Piece/SingleUpload.vue";
import MultipleUpload from "./Piece/MultipleUpload.vue";
import NaiveUpload from "./Core/NaiveUpload";
import RawFile from "./Model/RawFile";
import { IOpenApi } from "./Extention/IOpenApi";
import { IConfig } from "./Model/IConfig";

let upload = null as NaiveUpload | null;
export default defineComponent({
  name: "NaiveUpload",
  components: {
    SingleUpload,
    MultipleUpload,
  },
  /**
   * 组件属性
   */
  props: {
    /**
     * 已上传的文件Id集合
     * <p>可选</p>
     */
    modelValue: {
      type: Array<String>,
      default: () => {
        return [] as string[];
      },
      required: false,
    },

    /**
     * 设置
     * <p>可选</p>
     * <p>默认值Settings.default()</p>
     */
    settings: {
      type: Object as PropType<Settings>,
      default: () => {
        return Settings.default();
      },
      required: false,
    },

    /**
     * 接口服务
     * <p>必须</p>
     */
    apiService: {
      type: Object as PropType<IApiService>,
      required: true,
    },

    /**
     * 只读模式
     * <p>默认值false</p>
     * <p>可选</p>
     */
    readonly: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  /**
   * 组件自定义事件
   */
  emits: [
    /**
     * 更新用户文件信息Id集合
     *
     * @param e
     * @param ids 用户文件信息Id集合
     */
    "update:modelValue",

    /**
     * 设置组件开放的接口
     *
     * @param e
     * @param openApi 组件开放的接口
     */
    "setOpenApi",

    /**
     * 文件校验前执行
     *
     * @param e
     * @param file 文件
     * @returns 是否处理并上传该文件
     */
    "beforeCheck",

    /**
     * 文件校验结束后执行
     *
     * @param e
     * @param rawFile 文件
     */
    "afterCheck",

    /**
     * 文件校验全部校验结束后执行
     *
     * @param e
     * @param rawFiles 文件集合
     */
    "afterCheckAll",

    /**
     * 文件上传后执行
     *
     * @param e
     * @param rawFile 文件
     */
    "afterUpload",

    /**
     * 所有文件上传后执行
     * <p>此方法不会等待</p>
     *
     * @param e
     * @param rawFiles 文件集合
     */
    "afterUploadAll",

    /**
     * 组件异常
     *
     * @param e
     * @param error 异常
     */
    "error",
  ],
  /**
   * 渲染数据
   */
  data() {
    return {
      /**
       * 加载状态
       */
      loading: true,

      /**
       * 当前的上传组件
       */
      currentUpload: null as ShallowRef<any> | null,
    };
  },
  /**
   * 注册文件上传工具实例
   */
  provide() {
    return {
      upload: upload,
    };
  },
  /**
   * 初始化方法
   * @param props
   * @param param1
   */
  setup(props, { emit }) {
    if (props.apiService == null)
      throw new Error("必须设置一个IApiService的实现类");

    //获取文件上传工具实例
    if (props.readonly) props.settings.readonly = true;

    NaiveUpload.getInstance(props.settings, props.apiService)
      .then((instance) => {
        upload = instance;
      })
      .catch((e) => {
        emit("error", e);
      });

    upload.getSettings().debug
      ? console.debug("NaiveUpload Instance 已创建", Object.assign({}, upload))
      : !1;

    //设置各个回调事件
    upload.setupBeforeCheck((file: File) => {
      upload!.getSettings().debug
        ? console.debug("BeforeCheck => ", Object.assign({}, file))
        : !1;

      let flagResolve: (flag: boolean) => void;
      emit("beforeCheck", file, (flag?: boolean) => {
        flagResolve(flag ?? true);
      });
      return new Promise<boolean>((resolve) => {
        flagResolve = resolve;
      });
    });
    upload.setupAfterCheck(async (rawFile: RawFile) => {
      upload!.getSettings().debug
        ? console.debug("AfterCheck => ", Object.assign({}, rawFile))
        : !1;

      emit("afterCheck", rawFile);
    });
    upload.setupAfterCheckAll(async (rawFileList: RawFile[]) => {
      upload!.getSettings().debug
        ? console.debug("AfterCheckAll => ", Object.assign({}, rawFileList))
        : !1;

      emit("afterCheckAll", rawFileList);
    });
    upload.setupAfterUpload(async (rawFile: RawFile) => {
      upload!.getSettings().debug
        ? console.debug("AfterUpload => ", Object.assign({}, rawFile))
        : !1;

      emit(
        "update:modelValue",
        upload!.getUserFileInfoList(true).map((x) => x.id)
      );

      upload!.getSettings().debug
        ? console.debug(
            "ModelValue UserFileIdList => ",
            Object.assign({}, props.modelValue)
          )
        : !1;

      emit("afterUpload", rawFile);
    });
    upload.setupAfterUploadAll(async (rawFileList: RawFile[]) => {
      upload!.getSettings().debug
        ? console.debug("AfterUploadAll => ", Object.assign({}, rawFileList))
        : !1;

      emit("afterUploadAll", rawFileList);
    });
    upload.setupHandlerError(async (error: Error) => {
      upload!.getSettings().debug
        ? console.debug("HandlerError => ", Object.assign({}, error))
        : !1;

      emit("error", error);
    });
  },
  /**
   * 初始化方法
   */
  created() {
    const changConfig = (config?: IConfig) => {
      this.loading = true;
      //根据文件数量上限配置相应的上传组件
      if (upload!.getConfig().upperLimit == 1)
        this.currentUpload = shallowRef(SingleUpload);
      else this.currentUpload = shallowRef(MultipleUpload);

      this.loading = false;
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

    this.loading = false;

    upload.getSettings().debug
      ? console.debug("Naive Upload Component 已加载")
      : !1;
  },
});
</script>

<style lang="scss" type="text/scss">
@import "index.scss";
</style>
