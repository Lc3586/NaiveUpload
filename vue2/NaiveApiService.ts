import { Canceler } from "axios";
import { DefaultApiService, IConfig, IPreUploadChunkFileResponse, IPreUploadFileResponse, IProgress, IUserFileInfo } from "../src/export.base";
import FileUploadConfigService from "./fileUploadConfig/Service";

export default class NaiveApiService extends DefaultApiService {
    config(code: string): Promise<IConfig> {
        return FileUploadConfigService.getConfig(code);
    }
    rename(id: string, fileName: string): Promise<void> {
        //在此实现调用接口的代码
        return new Promise<void>(resolve => {
            setTimeout(resolve, 5000);
        });
    }
    getDownloadUrl(id: string, rename: string): string {
        throw new Error("Method not implemented.");
    }
    getUserFile(id: string): Promise<IUserFileInfo> {
        throw new Error("Method not implemented.");
    }
    getUserFilePreviewUrl(id: string, width?: number | undefined, height?: number | undefined, time?: string | undefined): string {
        throw new Error("Method not implemented.");
    }
    preUploadFile(configCode: string, md5: string, type: string, extension: string, length: string, filename?: string | undefined, section?: boolean | undefined, specs?: number | undefined, total?: number | undefined): Promise<IPreUploadFileResponse> {
        throw new Error("Method not implemented.");
    }
    singleFile(configCode: string, file: File, filename?: string | undefined, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<IUserFileInfo> {
        throw new Error("Method not implemented.");
    }
    getSingleFileByArrayBufferRequestParams(configCode: string, type: string, extension: string, filename?: string | undefined): { urlWithParams: string; headers: Map<string, string>; } {
        throw new Error("Method not implemented.");
    }
    getUserFileInfoFromSingleFileByArrayBufferResponse(response: any): IUserFileInfo {
        throw new Error("Method not implemented.");
    }
    preUploadChunkFile(file_md5: string, md5: string, index: number, specs: number, forced?: boolean | undefined): Promise<IPreUploadChunkFileResponse> {
        throw new Error("Method not implemented.");
    }
    singleChunkFile(key: string, md5: string, file: Blob, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getSingleChunkFileByArrayBufferRequestParams(key: string, md5: string): { urlWithParams: string; headers: Map<string, string>; } {
        throw new Error("Method not implemented.");
    }
    getUserFileInfoFromSingleChunkFileByArrayBufferResponse(response: any): IUserFileInfo {
        throw new Error("Method not implemented.");
    }
    uploadChunkFileFinished(configCode: string, file_md5: string, specs: number, total: number, type?: string | undefined, extension?: string | undefined, filename?: string | undefined): Promise<IUserFileInfo> {
        throw new Error("Method not implemented.");
    }
}