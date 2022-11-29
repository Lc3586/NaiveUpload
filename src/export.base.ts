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

/**
 * 用于按需引用
 */
export {
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
