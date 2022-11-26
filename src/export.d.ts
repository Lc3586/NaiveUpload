import NaiveUpload from './index.vue';
import type { Plugin } from "vue-demi";
import Settings from "./Model/Settings";
import { IApiService } from "./Core/IApiService";
import { IConfig } from "./Model/IConfig";
import { IPreUploadChunkFileResponse } from "./Model/IPreUploadChunkFileResponse";
import { IPreUploadFileResponse } from "./Model/IPreUploadFileResponse";
import { IProgress } from "./Model/IProgress";
import { IUserFileInfo } from "./Model/IUserFileInfo";
import { IOpenApi } from "./Extention/IOpenApi";
import DefaultApiService from "./Extention/DefaultApiService";
import UploadError from "./Extention/UploadError";
import RawFile from "./Model/RawFile";
import ChunkFile from './Model/ChunkFile';
import { FileType } from './Model/FileType';
import { Layout } from './Model/Layout';
import { PreUploadChunkFileState } from './Model/PreUploadChunkFileState';
import { RunMode } from './Model/RunMode';
import DraggingHelper from './Extention/DraggingHelper';
import FileReadHelper from './Extention/FileReadHelper';
import FileSizeHelper from './Extention/FileSizeHelper';
import FileTypeHelper from './Extention/FileTypeHelper';
import HashHelper from './Extention/HashHelper';
import { HashWorkerScript } from './Extention/HashWorkerScript';
import SimpleGuid from './Extention/SimpleGuid';
import UploadHelper from './Extention/UploadHelper';
import { UploadWorkerScript } from './Extention/UploadWorkerScript';
declare const installer: Plugin;

/**
 * 用于全局注册组件
 */
export default installer;

/**
 * 用于按需引用
 */
export {
    /**
     * 文件上传组件
     */
    NaiveUpload,

    /**
     * 文件上传组件设置
     */
    Settings,

    /**
     * 默认接口服务实现类
     */
    DefaultApiService,

    /**
     * 异常信息
     */
    UploadError,

    /**
     * 源文件
     */
    RawFile,

    /**
     * 切片文件
     */
    ChunkFile,

    /**
     * 文件类型
     */
    FileType,

    /**
     * 上传组件布局
     */
    Layout,

    /**
     * 预备上传分片文件状态
     */
    PreUploadChunkFileState,

    /**
     * 上传组件运行模式
     */
    RunMode,

    /**
     * 拖动！
     */
    DraggingHelper,

    /**
     * 文件读取帮助类
     */
    FileReadHelper,

    /**
     * 文件大小帮助类
     */
    FileSizeHelper,

    /**
     * 文件类型帮助类
     */
    FileTypeHelper,

    /**
     * 哈希值计算帮助类
     */
    HashHelper,

    /**
     * 哈希值计算WebWorker脚本
     */
    HashWorkerScript,

    /**
     * 唯一标识
     */
    SimpleGuid,

    /**
     * 文件上传帮助类
     */
    UploadHelper,

    /**
     * 文件上传WebWorker脚本
     */
    UploadWorkerScript
};

/**
 * 用于规范类型
 */
export type {
    /**
     * 接口服务
     */
    IApiService,

    /**
     * 文件上传配置
     */
    IConfig,

    /**
     * 预备上传文件输出信息
     */
    IPreUploadFileResponse,

    /**
     * 文件上传业务模型
     */
    IPreUploadChunkFileResponse,

    /**
     * 进度信息
     */
    IProgress,

    /**
     * 用户文件信息
     */
    IUserFileInfo,

    /**
     * 组件开放接口
     */
    IOpenApi
};
