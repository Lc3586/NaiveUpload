import { Canceler } from "axios";
import { DefaultApiService, IConfig, IPreUploadChunkFileResponse, IPreUploadFileResponse, IProgress, IUserFileInfo } from "@/export.vue3";
export default class NaiveApiService extends DefaultApiService {
    config(code: string): Promise<IConfig>;
    rename(id: string, fileName: string): Promise<void>;
    getDownloadUrl(id: string, rename: string): string;
    getUserFile(id: string): Promise<IUserFileInfo>;
    getUserFilePreviewUrl(id: string, width?: number | undefined, height?: number | undefined, time?: string | undefined): string;
    preUploadFile(configCode: string, md5: string, type: string, extension: string, length: string, filename?: string | undefined, section?: boolean | undefined, specs?: number | undefined, total?: number | undefined): Promise<IPreUploadFileResponse>;
    singleFile(configCode: string, file: File, filename?: string | undefined, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<IUserFileInfo>;
    getSingleFileByArrayBufferRequestParams(configCode: string, type: string, extension: string, filename?: string | undefined): {
        urlWithParams: string;
        headers: Map<string, string>;
    };
    getUserFileInfoFromSingleFileByArrayBufferResponse(response: any): IUserFileInfo;
    preUploadChunkFile(file_md5: string, md5: string, index: number, specs: number, forced?: boolean | undefined): Promise<IPreUploadChunkFileResponse>;
    singleChunkFile(key: string, md5: string, file: Blob, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<void>;
    getSingleChunkFileByArrayBufferRequestParams(key: string, md5: string): {
        urlWithParams: string;
        headers: Map<string, string>;
    };
    getUserFileInfoFromSingleChunkFileByArrayBufferResponse(response: any): IUserFileInfo;
    uploadChunkFileFinished(configCode: string, file_md5: string, specs: number, total: number, type?: string | undefined, extension?: string | undefined, filename?: string | undefined): Promise<IUserFileInfo>;
}
