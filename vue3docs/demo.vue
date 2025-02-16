<template>
  <div class="update-container">
    <el-row :gutter="20">
      <el-col :span="4" class="label">组件配置</el-col>
      <el-col :span="20" class="content">
        <el-collapse>
          <el-collapse-item title="核心" name="Functional">
            <el-row :gutter="20">
              <el-col :span="2" class="label">上传配置</el-col>
              <el-col :span="20" class="content">
                <el-popover placement="bottom" :width="400" trigger="click">
                  <template #reference>
                    <el-button class="item" title="点击切换">{{
                      settings.configCode
                    }}</el-button>
                    <span v-if="renderData.config.error">{{
                      renderData.config.error
                    }}</span>
                  </template>
                  <el-input
                    placeholder="输入名称进行筛选"
                    v-model="renderData.config.filter"
                  ></el-input>
                  <el-tree
                    :props="renderData.config.props"
                    :load="loadConfig"
                    v-loading="renderData.config.loading"
                    :filter-node-method="filterConfig"
                    lazy
                    node-key="id"
                    :expand-on-click-node="false"
                  >
                    <template #default="{ node, data }">
                      <span class="config-tree-node">
                        <span>
                          {{ node.label }}
                        </span>
                        (<span>
                          {{
                            data.childrenCount > 99 ? "99+" : data.childrenCount
                          }} </span
                        >)
                        <span class="tools">
                          <el-link
                            class="button"
                            type="primary"
                            @click="applyConfig(data)"
                            >应用</el-link
                          >

                          <el-popover
                            placement="right"
                            :width="400"
                            trigger="click"
                          >
                            <template #reference>
                              <el-link
                                class="button"
                                type="success"
                                @click="loadConfigDetail(node, data)"
                                >详情</el-link
                              >
                            </template>

                            <span
                              v-show="renderData.config.detail.error !== null"
                            >
                              <span>{{ renderData.config.detail.error }}</span>
                            </span>

                            <span
                              v-if="
                                renderData.config.detail.dataMap.has(data.id)
                              "
                              v-loading="
                                renderData.config.detail.loadingMap.get(data.id)
                              "
                              class="config-detail"
                            >
                              <el-descriptions title="基础信息" :column="1">
                                <el-descriptions-item label="名称">{{
                                  getConfigDetail(data).name
                                }}</el-descriptions-item>
                                <el-descriptions-item label="显示名称">{{
                                  getConfigDetail(data).displayName
                                }}</el-descriptions-item>
                                <el-descriptions-item label="编码">{{
                                  getConfigDetail(data).code
                                }}</el-descriptions-item>
                                <el-descriptions-item label="启用">{{
                                  getConfigDetail(data).enable ? "是" : "否"
                                }}</el-descriptions-item>
                                <el-descriptions-item label="说明">{{
                                  getConfigDetail(data).explain
                                }}</el-descriptions-item>
                              </el-descriptions>
                              <el-descriptions title="配置信息" :column="1">
                                <el-descriptions-item label="文件数量下限">{{
                                  getConfigDetail(data).lowerLimit
                                }}</el-descriptions-item>
                                <el-descriptions-item label="文件数量上限">{{
                                  getConfigDetail(data).upperLimit
                                }}</el-descriptions-item>
                                <el-descriptions-item
                                  label="单个文件大小下限（单位 KB）"
                                  >{{
                                    getConfigDetail(data).lowerSingleSize
                                  }}</el-descriptions-item
                                >
                                <el-descriptions-item
                                  label="单个文件大小上限（单位 KB）"
                                  >{{
                                    getConfigDetail(data).upperSingleSize
                                  }}</el-descriptions-item
                                >
                                <el-descriptions-item
                                  label="所有文件整体大小下限（单位 KB）"
                                  >{{
                                    getConfigDetail(data).lowerTotalSize
                                  }}</el-descriptions-item
                                >
                                <el-descriptions-item
                                  label="所有文件整体大小上限（单位 KB）"
                                  >{{
                                    getConfigDetail(data).upperTotalSize
                                  }}</el-descriptions-item
                                >
                                <el-descriptions-item label="允许的MIME类型">
                                  <simple-tag-list
                                    v-model="
                                      getConfigDetail(data).allowedTypeList
                                    "
                                    :readonly="true"
                                  ></simple-tag-list>
                                </el-descriptions-item>
                                <el-descriptions-item label="禁止的MIME类型">
                                  <simple-tag-list
                                    v-model="
                                      getConfigDetail(data).prohibitedTypeList
                                    "
                                    :readonly="true"
                                  ></simple-tag-list>
                                </el-descriptions-item>
                              </el-descriptions>
                            </span>
                          </el-popover>
                        </span>
                      </span>
                    </template>
                  </el-tree>
                </el-popover>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="2" class="label">文件并发数</el-col>
              <el-col :span="4" class="content">
                <el-input-number
                  v-model="settings.concurrentFile"
                  :min="1"
                  :max="99"
                />
              </el-col>

              <el-col :span="2" class="label" title="发生错误时的重试次数"
                >重试次数</el-col
              >
              <el-col :span="4" class="content">
                <el-input-number v-model="settings.retry" :min="1" :max="10" />
              </el-col>
            </el-row>

            <el-row v-if="settings.enableChunk" :gutter="20">
              <el-col :span="2" class="label" title="文件字节数"
                >切片规格</el-col
              >
              <el-col :span="4" class="content">
                <el-input-number
                  v-model="settings.chunkSize"
                  placeholder="文件字节数"
                  :min="2097152"
                />
              </el-col>

              <el-col :span="2" class="label">切片文件并发数</el-col>
              <el-col :span="4" class="content">
                <el-input-number
                  v-model="settings.concurrentChunkFile"
                  :min="1"
                  :max="99"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="2" class="label">切片上传</el-col>
              <el-col :span="2" class="content">
                <el-switch v-model="settings.enableChunk" />
              </el-col>

              <el-col
                :span="2"
                class="label"
                title="在浏览器不支持时此设置不会生效"
                >Web Worker</el-col
              >
              <el-col :span="2" class="content">
                <el-switch v-model="settings.enableWorker" />
              </el-col>

              <el-col :span="2" class="label">只读模式</el-col>
              <el-col :span="2" class="content">
                <el-switch v-model="settings.readonly" />
              </el-col>

              <el-col :span="2" class="label">调试模式</el-col>
              <el-col :span="2" class="content">
                <el-switch
                  v-model="settings.debug"
                  title="将在控制台输出调试信息"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="2" class="label">运行模式</el-col>
              <el-col :span="22" class="content">
                <el-radio-group class="item" v-model="settings.runMode">
                  <el-radio-button
                    label="AT"
                    title="全自动（添加文件后会自动校验，自动上传）"
                  ></el-radio-button>
                  <el-radio-button
                    label="AMT"
                    title="半自动（添加文件后会自动校验，但需要主动调用上传方法）"
                  ></el-radio-button>
                  <el-radio-button
                    label="MT"
                    title="手动挡（添加文件后需要主动调用校验方法以及上传方法）"
                  ></el-radio-button>
                </el-radio-group>
                <br />
                <span>{{
                  settings.runMode === "AT"
                    ? "全自动（添加文件后会自动校验，自动上传）"
                    : settings.runMode === "MT"
                    ? "手动挡（添加文件后需要主动调用校验方法以及上传方法）"
                    : "半自动（添加文件后会自动校验，但需要主动调用上传方法）"
                }}</span>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="外观&交互" name="Appearance">
            <el-row :gutter="20">
              <el-col :span="4" class="label">小贴士</el-col>
              <el-col :span="20" class="content">
                <el-input
                  v-model="settings.tip"
                  :rows="2"
                  type="textarea"
                  placeholder="小贴士"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4" class="label">布局</el-col>
              <el-col :span="4" class="content">
                <el-switch
                  class="item"
                  v-model="settings.layout"
                  active-color="#00bcd4"
                  inactive-color="#ff9800"
                  active-text="清单式"
                  inactive-text="卡片式"
                  active-value="Detailedly"
                  inactive-value="Card"
                  @change="
                    settings.layout === 'Detailedly' ? 'Card' : 'Detailedly'
                  "
                >
                </el-switch>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4" class="label">状态的颜色</el-col>
              <el-col :span="20" class="content">
                <el-row :gutter="20">
                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >校验{{ settings.statusCheckingColor.toString() }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusCheckingColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusCheckingColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>

                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >上传{{ settings.statusUploadingColor.toString() }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusUploadingColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusUploadingColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>

                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >暂停{{ settings.statusPausedColor.toString() }}，标签{{
                        settings.statusPausedSubColor.toString()
                      }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusPausedColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusPausedColor"
                        title="颜色"
                      />
                    </el-popover>
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusPausedSubColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusPausedSubColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >完成{{ settings.statusDoneColor.toString() }}，标签{{
                        settings.statusDoneSubColor.toString()
                      }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusDoneColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusDoneColor"
                        title="颜色"
                      />
                    </el-popover>
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusDoneSubColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusDoneSubColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>

                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >错误{{ settings.statusErrorColor.toString() }}，标签{{
                        settings.statusErrorSubColor.toString()
                      }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusErrorColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusErrorColor"
                        title="颜色"
                      />
                    </el-popover>
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.statusErrorSubColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.statusErrorSubColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>

                  <el-col :span="8" class="content">
                    <span class="demonstration"
                      >错误{{ settings.dragReadyColor.toString() }}</span
                    >
                    <br />
                    <el-popover placement="top" trigger="click">
                      <template #reference>
                        <el-button
                          class="color-block"
                          title="点击切换颜色"
                          :style="{
                            '--color': settings.dragReadyColor.toString(),
                          }"
                        ></el-button>
                      </template>
                      <sketch-picker
                        v-model="renderData.colors.dragReadyColor"
                        title="颜色"
                      />
                    </el-popover>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4" class="label">拖动排序功能</el-col>
              <el-col :span="20" class="content">
                <el-row :gutter="20">
                  <el-col :span="2" class="content">
                    <el-switch v-model="settings.enableDrag" /> </el-col
                ></el-row>
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-row :gutter="20" v-if="settings.enableDrag">
                      <el-col :span="12" class="content">
                        <span class="demonstration"
                          >准备开始拖动的时间（{{
                            settings.dragPreparationTime
                          }}ms）</span
                        >
                        <el-slider
                          v-model="settings.dragPreparationTime"
                          :step="100"
                          :max="10000"
                          :show-tooltip="false"
                        ></el-slider>
                      </el-col>
                      <el-col :span="12" class="content">
                        <span class="demonstration"
                          >拖动时变换位置的等待时间（{{
                            settings.dragChangePositionTime
                          }}ms）</span
                        >
                        <el-slider
                          v-model="settings.dragChangePositionTime"
                          :step="100"
                          :max="10000"
                          :show-tooltip="false"
                        ></el-slider>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" v-if="settings.enableDrag">
                      <el-col :span="12" class="content">
                        <span class="demonstration"
                          >准备拖动时的动画颜色{{
                            settings.dragReadyColor.toString()
                          }}</span
                        >
                        <br />
                        <el-popover placement="top" trigger="click">
                          <template #reference>
                            <el-button
                              class="color-block"
                              title="点击切换颜色"
                              :style="{
                                '--color': settings.dragReadyColor.toString(),
                              }"
                            ></el-button>
                          </template>
                          <sketch-picker
                            v-model="renderData.colors.dragReadyColor"
                            title="颜色"
                          />
                        </el-popover>
                      </el-col>
                      <el-col :span="12" class="content">
                        <span class="demonstration"
                          >拖动时的动画颜色{{
                            settings.dragMovingColor.toString()
                          }}</span
                        >
                        <br />
                        <el-popover placement="top" trigger="click">
                          <template #reference>
                            <el-button
                              class="color-block"
                              title="点击切换颜色"
                              :style="{
                                '--color': settings.dragMovingColor.toString(),
                              }"
                            ></el-button>
                          </template>
                          <sketch-picker
                            v-model="renderData.colors.dragMovingColor"
                            title="颜色"
                          />
                        </el-popover>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" v-if="settings.enableDrag">
                      <el-col :span="12" class="content">
                        <span class="demonstration"
                          >结束拖动时的动画颜色{{
                            settings.dragOverColor.toString()
                          }}</span
                        >
                        <br />
                        <el-popover placement="top" trigger="click">
                          <template #reference>
                            <el-button
                              class="color-block"
                              title="点击切换颜色"
                              :style="{
                                '--color': settings.dragOverColor.toString(),
                              }"
                            ></el-button>
                          </template>
                          <sketch-picker
                            v-model="renderData.colors.dragOverColor"
                            title="颜色"
                          />
                        </el-popover>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4" class="label">操作</el-col>
      <el-col :span="20" class="content">
        <el-button class="item" type="danger" @click="clean"> 清空 </el-button>
        <el-button class="item" type="warning" @click="pause"> 暂停 </el-button>
        <el-button class="item" type="success" @click="continue_">
          恢复
        </el-button>
        <el-button class="item" type="primary" @click="start"> 开始 </el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4" class="label">已上传的文件ID</el-col>
      <el-col :span="20" class="content">
        <simple-tag-list
          v-model="renderData.fileIds"
          :readonly="true"
        ></simple-tag-list>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4" class="label">设置初始值</el-col>
      <el-col :span="20" class="content">
        <simple-tag-list
          v-model="renderData.preFileIds"
          :name="'已上传的文件ID'"
        ></simple-tag-list>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4" class="label">组件预览</el-col>
      <el-col :span="20" class="content">
        <naive-upload
          v-if="renderData.show"
          v-model="renderData.fileIds"
          :settings="settings"
          :api-service="apiService"
          @setOpenApi="setUploadApi"
          @beforeCheck="beforeCheck"
          @afterCheck="afterCheck"
          @afterCheckAll="afterCheckAll"
          @afterUpload="afterUpload"
          @afterUploadAll="afterUploadAll"
          @error="handlerError"
        ></naive-upload>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, getCurrentInstance } from "vue";
//本地调试
// import { NaiveUpload } from "../src/export.vue3";
//打包发布
import { NaiveUpload } from 'naive-upload';
import 'naive-upload/dist/style.css';
// import { NaiveUpload } from "../lib/export";
// import "../dist/style.css";
import NaiveApiService from "./NaiveApiService";
import FileUploadConfigService from "./fileUploadConfig/Service";
import { ITreeList as UploadConfigTreeList } from "./fileUploadConfig/ITreeList";
import { IDetail as UploadConfigDetail } from "./fileUploadConfig/IDetail";
import SimpleTagList from "./SimpleTagList/index.vue";
import {
  IOpenApi,
  RawFile,
  Settings,
  UploadError,
  RGBAColor,
  RunMode,
} from "../src/export.vue3";
import { Sketch as SketchPicker } from "@ckpack/vue-color";

/**
 * 上传组件的设置
 */
const settings = reactive(
  Settings.defaultWithConfigCode("multiple-file").setup((x) => {
    x.debug = true;
    x.runMode = RunMode.半自动;
  })
);

/**
 * 渲染数据
 */
let renderData = reactive({
  fileIds: [] as string[],
  preFileIds: [] as string[],
  show: true,
  config: {
    loading: true,
    props: {
      label: "displayName",
      children: "children",
      isLeaf: "leaf",
    },
    data: [] as UploadConfigTreeList[],
    detail: {
      loadingMap: new Map<string, boolean>(),
      dataMap: new Map<string, UploadConfigDetail>(),
      error: null as string | null,
    },
    filter: "",
    error: null as string | null,
  },
  activeConfigName: "Functional",
  colors: {
    statusCheckingColor: { rgba: settings.statusCheckingColor },
    statusUploadingColor: { rgba: settings.statusUploadingColor },
    statusPausedColor: { rgba: settings.statusPausedColor },
    statusPausedSubColor: { rgba: settings.statusPausedSubColor },
    statusDoneColor: { rgba: settings.statusDoneColor },
    statusDoneSubColor: { rgba: settings.statusDoneSubColor },
    statusErrorColor: { rgba: settings.statusErrorColor },
    statusErrorSubColor: { rgba: settings.statusErrorSubColor },

    dragReadyColor: { rgba: settings.dragReadyColor },
    dragMovingColor: { rgba: settings.dragMovingColor },
    dragOverColor: { rgba: settings.dragOverColor },
  },
});

// 获取vue实例
const { proxy } = getCurrentInstance() as any;

//监听已上传的文件Id集合变更
watch(
  () => renderData.preFileIds,
  async (current, last) => {
    if (current.length == 0) return;

    renderData.show = false;
    renderData.fileIds.length = 0;
    for (const item of current) {
      renderData.fileIds.push(item);
    }

    proxy.$nextTick(() => (renderData.show = true));
  },
  { deep: true }
);
watch(
  () => renderData.colors,
  async (current, last) => {
    settings.statusCheckingColor = RGBAColor.convertFrom(
      renderData.colors.statusCheckingColor.rgba
    );
    settings.statusUploadingColor = RGBAColor.convertFrom(
      renderData.colors.statusUploadingColor.rgba
    );
    settings.statusPausedColor = RGBAColor.convertFrom(
      renderData.colors.statusPausedColor.rgba
    );
    settings.statusPausedSubColor = RGBAColor.convertFrom(
      renderData.colors.statusPausedSubColor.rgba
    );
    settings.statusDoneColor = RGBAColor.convertFrom(
      renderData.colors.statusDoneColor.rgba
    );
    settings.statusDoneSubColor = RGBAColor.convertFrom(
      renderData.colors.statusDoneSubColor.rgba
    );
    settings.statusErrorColor = RGBAColor.convertFrom(
      renderData.colors.statusErrorColor.rgba
    );
    settings.statusErrorSubColor = RGBAColor.convertFrom(
      renderData.colors.statusErrorSubColor.rgba
    );

    settings.dragReadyColor = RGBAColor.convertFrom(
      renderData.colors.dragReadyColor.rgba
    );
    settings.dragMovingColor = RGBAColor.convertFrom(
      renderData.colors.dragMovingColor.rgba
    );
    settings.dragOverColor = RGBAColor.convertFrom(
      renderData.colors.dragOverColor.rgba
    );
  },
  { deep: true }
);

/**
 * 上传服务
 */
const apiService = new NaiveApiService();

/**
 * 组件开放的接口
 */
let uploadOpenApi = null as IOpenApi | null;

/**
 * 获取组件开放的接口
 *
 * @param openApi 组件开放的接口
 */
const setUploadApi = (openApi: IOpenApi) => {
  uploadOpenApi = openApi;
};

/**
 * 文件校验前执行
 *
 * @param file 文件
 * @return 是否处理并上传该文件
 */
const beforeCheck = (file: File): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    resolve(true);
  });
};

/**
 * 文件校验结束后执行
 *
 * @param rawFile 文件
 */
const afterCheck = (rawFile: RawFile) => {
  // console.debug(rawFile);
};

/**
 * 文件校验全部校验结束后执行
 *
 * @param rawFiles 文件集合
 */
const afterCheckAll = (rawFiles: RawFile[]) => {
  // console.debug(rawFiles);
};

/**
 * 文件上传后执行
 *
 * @param rawFile 文件
 */
const afterUpload = (rawFile: RawFile) => {
  // console.debug(rawFile);
};

/**
 * 所有文件上传后执行
 * <p>此方法不会等待</p>
 *
 * @param rawFiles 文件集合
 */
const afterUploadAll = (rawFiles: RawFile[]) => {
  // console.debug('已经上传好的文件id集合', Object.assign({}, renderData.fileIds));
};

/**
 * 组件异常
 *
 * @param e 异常
 */
const handlerError = (e: Error) => {
  UploadError.consoleWrite(e);
};

/**
 * 加载文件上传配置下拉选择框数据
 *
 * @param node 当前触发的节点
 * @param resolve 回调函数
 */
const loadConfig = (node: any, resolve: (list: any[]) => void) => {
  renderData.config.loading = true;
  renderData.config.error = null;
  FileUploadConfigService.getTreeList()
    .then((result: UploadConfigTreeList[]) => {
      renderData.config.loading = false;
      resolve(
        result.map((x: UploadConfigTreeList) =>
          Object.assign(x, { leaf: !x.hasChildren })
        )
      );
      console.debug(result);
    })
    .catch((e: any) => {
      renderData.config.loading = false;
      renderData.config.error = `加载文件上传配置时发生异常：${e.message}`;
    });
};

/**
 * 筛选文件上传配置
 *
 * @param value 输入值
 * @param data 当前数据
 */
const filterConfig = (value: string, data: UploadConfigTreeList) => {
  if (!value) return true;
  return (
    data.name.indexOf(value) !== -1 ||
    data.code.indexOf(value) !== -1 ||
    data.displayName.indexOf(value) !== -1
  );
};

/**
 * 加载文件上传配置详情
 *
 * @param node
 * @param data 当前数据
 */
const loadConfigDetail = (node: any, data: UploadConfigTreeList) => {
  if (renderData.config.detail.loadingMap.get(data.id) === false) return;

  renderData.config.detail.loadingMap.set(data.id, true);
  FileUploadConfigService.getDetail(data.id)
    .then((result: UploadConfigDetail) => {
      renderData.config.detail.loadingMap.set(data.id, false);
      renderData.config.detail.dataMap.set(data.id, result);
    })
    .catch((e: any) => {
      renderData.config.detail.loadingMap.set(data.id, false);
      renderData.config.detail.error = `加载文件上传配置详情时发生异常：${e.message}`;
    });
};

/**
 * 获取文件上传配置详情
 *
 * @param data 当前数据
 */
const getConfigDetail = (data: UploadConfigTreeList) => {
  return renderData.config.detail.dataMap.get(data.id)!;
};

/**
 * 应用文件上传配置
 *
 * @param data
 */
const applyConfig = (data: UploadConfigTreeList) => {
  settings.configCode = data.code;
};

/**
 * 清空
 */
const clean = () => {
  uploadOpenApi?.clean();
};

/**
 * 暂停
 */
const pause = () => {
  uploadOpenApi?.pause();
};

/**
 * 恢复
 */
const continue_ = () => {
  uploadOpenApi?.continue();
};

/**
 * 开始
 */
const start = () => {
  uploadOpenApi?.startCheck();
  uploadOpenApi?.startUpload();
};

/**
 * 初始化方法
 */
(async () => {
  // console.debug('settings:', settings);
  // console.debug('Index OK');
  // SSOHub.handlerMessage(message => {
  //   console.debug(message);
  // });
})();
</script>
<style scoped>
.scroll-container {
  border: none;
}

.update-container {
  padding: 10px;
}

.update-container .el-row {
  margin-bottom: 20px;
}

.update-container .label {
  text-align: right;
}

.update-container .content {
  text-align: left;
}

.config-tree-node .tools .button {
  margin-left: 10px;
}

.color-block {
  width: 30px;
  height: 30px;
  background-color: var(--color) !important;
}
</style>
