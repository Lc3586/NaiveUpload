import NaiveUpload from './index.vue';
import type { App, Component, Plugin } from "vue"
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

const installer: Plugin = {
    install(app: App) {
        app.component("naive-upload", NaiveUpload);
    },
};

// type SFCWithInstall<T> = T & Plugin;
// const withInstall = <T>(component: Component) => {
//     (component as SFCWithInstall<T>).install = (app: App) => {
//         //注册组件
//         app.component("naive-upload", component);
//     }
//     return component as SFCWithInstall<T>;
// }

// export const installer = withInstall(NaiveUpload);

/**
 * 用于全局注册组件
 */
export default installer;

/**
 * 用于按需引用
 */
export {
    NaiveUpload,
    Settings,
    DefaultApiService,
    UploadError,
    RawFile,
    ChunkFile,
    FileType,
    Layout,
    PreUploadChunkFileState,
    RunMode,
    DraggingHelper,
    FileReadHelper,
    FileSizeHelper,
    FileTypeHelper,
    HashHelper,
    HashWorkerScript,
    SimpleGuid,
    UploadHelper,
    UploadWorkerScript
};

/**
 * 用于规范类型
 */
export type {
    IApiService,
    IConfig,
    IPreUploadFileResponse,
    IPreUploadChunkFileResponse,
    IProgress,
    IUserFileInfo,
    IOpenApi
};
