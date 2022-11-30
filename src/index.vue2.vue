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

<script lang="ts">
import { defineComponent, PropType, ShallowRef, shallowRef } from "vue-demi";
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import SingleUpload from "./Piece/SingleUpload.vue2.vue";
import MultipleUpload from "./Piece/MultipleUpload.vue2.vue";
import NaiveUpload from "./Core/NaiveUpload";
import RawFile from "./Model/RawFile";
import { IConfig } from "./Model/IConfig";

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
      type: Array<string>,
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
  provide() {
    return {
      /**
       * 注册文件上传工具实例
       */
      upload: () => this.renderData.upload,
    };
  },
  /**
   * 渲染数据
   */
  data() {
    return {
      renderData: {
        /**
         * 加载状态
         */
        loading: true,

        /**
         * 当前的上传组件
         */
        currentUpload: null as ShallowRef<any> | null,

        /**
         * 文件上传工具实例
         */
        upload: null as NaiveUpload | null,
      },
    };
  },
  created() {
    this.settings.debug
      ? console.debug("Naive Upload Component(Vue2) 已加载")
      : !1;
  },
  mounted() {
    if (this.apiService == null)
      throw new Error("必须设置一个IApiService的实现类");

    //获取文件上传工具实例
    if (this.readonly) this.settings.readonly = true;

    NaiveUpload.getInstance(this.settings, this.apiService)
      .then((instance) => {
        instance.getSettings().debug
          ? console.debug(
              "NaiveUpload Instance 已创建",
              Object.assign({}, instance)
            )
          : !1;

        //设置各个回调事件
        instance.setupBeforeCheck((file: File) => {
          instance!.getSettings().debug
            ? console.debug("BeforeCheck => ", Object.assign({}, file))
            : !1;

          let flagResolve: (flag: boolean) => void;
          this.$emit("beforeCheck", file, (flag?: boolean) => {
            flagResolve(flag ?? true);
          });
          return new Promise<boolean>((resolve) => {
            flagResolve = resolve;
          });
        });
        instance.setupAfterCheck(async (rawFile: RawFile) => {
          instance!.getSettings().debug
            ? console.debug("AfterCheck => ", Object.assign({}, rawFile))
            : !1;

          this.$emit("afterCheck", rawFile);
        });
        instance.setupAfterCheckAll(async (rawFileList: RawFile[]) => {
          instance!.getSettings().debug
            ? console.debug("AfterCheckAll => ", Object.assign({}, rawFileList))
            : !1;

          this.$emit("afterCheckAll", rawFileList);
        });
        instance.setupAfterUpload(async (rawFile: RawFile) => {
          instance!.getSettings().debug
            ? console.debug("AfterUpload => ", Object.assign({}, rawFile))
            : !1;

          this.$emit(
            "update:modelValue",
            instance!.getUserFileInfoList(true).map((x) => x.id)
          );

          instance!.getSettings().debug
            ? console.debug(
                "ModelValue UserFileIdList => ",
                Object.assign({}, this.modelValue)
              )
            : !1;

          this.$emit("afterUpload", rawFile);
        });
        instance.setupAfterUploadAll(async (rawFileList: RawFile[]) => {
          instance!.getSettings().debug
            ? console.debug(
                "AfterUploadAll => ",
                Object.assign({}, rawFileList)
              )
            : !1;

          this.$emit("afterUploadAll", rawFileList);
        });
        instance.setupHandlerError(async (error: Error) => {
          instance!.getSettings().debug
            ? console.debug("HandlerError => ", Object.assign({}, error))
            : !1;

          this.$emit("error", error);
        });

        const changConfig = (config?: IConfig) => {
          this.renderData.loading = true;
          //根据文件数量上限配置相应的上传组件
          if (instance!.getConfig().upperLimit == 1)
            this.renderData.currentUpload = shallowRef(SingleUpload);
          else this.renderData.currentUpload = shallowRef(MultipleUpload);

          this.renderData.loading = false;
          instance!.getSettings().debug
            ? console.debug("Layout：index Component(Vue2) 已变更")
            : !1;
        };

        //注册配置变更事件
        instance.registerConfigChanged(changConfig);

        //初始化
        changConfig();

        //设置组件开发的接口
        this.$emit("setOpenApi", instance.getOpenApi());

        //添加之前已上传过的文件
        if (this.modelValue && this.modelValue.length > 0) {
          this.modelValue.forEach(async (id) => {
            await instance.appendById(id);
          });
        }

        this.renderData.upload = instance;

        this.renderData.loading = false;
      })
      .catch((e) => {
        this.$emit("error", e);
      });
  },
});
</script>

<style lang="scss" type="text/scss">
@import "index.scss";
</style>
