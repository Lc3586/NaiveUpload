import { Canceler } from "axios";
import { IApiService } from "../Core/IApiService";
import { FileType } from "../Model/FileType";
import { IConfig } from "../Model/IConfig";
import { IPreUploadChunkFileResponse } from "../Model/IPreUploadChunkFileResponse";
import { IPreUploadFileResponse } from "../Model/IPreUploadFileResponse";
import { IProgress } from "../Model/IProgress";
import { IUserFileInfo } from "../Model/IUserFileInfo";
import FileTypeHelper from "./FileTypeHelper";


/**
 * 默认接口服务实现类
 * <p>此为抽象类，部分接口方法需要对接项目的后端接口</p>
 * 
 * @author LCTR
 * @date 2022-11-07
 */
export default abstract class DefaultApiService implements IApiService {
    abstract config(code: string): Promise<IConfig>;

    getFileTypeByExtension(extension: string): Promise<FileType> {
        return Promise.resolve(FileTypeHelper.getByExtension(extension));
    }

    getFileTypeByMIME(mimetype: string): Promise<FileType> {
        return Promise.resolve(FileTypeHelper.getByMIME(mimetype));
    }

    getFileTypeImageUrl(extension: string): string {
        return `/filetypes/${(extension ?? '.empty').substring(1)}.png`;
    }

    getUnknowFileTypeImageUrl(): string {
        return '/filetypes/empty.png';
    }

    abstract rename(id: string, fileName: string): Promise<void>;

    abstract getDownloadUrl(id: string, rename: string): string;

    abstract getUserFile(id: string): Promise<IUserFileInfo>;

    abstract getUserFilePreviewUrl(id: string, width?: number | undefined, height?: number | undefined, time?: string | undefined): string;

    abstract getUserFileBrowseUrl(id: string): string;

    abstract preUploadFile(configCode: string, md5: string, type: string, extension: string, length: string, filename?: string | undefined, section?: boolean | undefined, specs?: number | undefined, total?: number | undefined): Promise<IPreUploadFileResponse>;

    abstract singleFile(configCode: string, file: File, filename?: string | undefined, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<IUserFileInfo>;
    abstract getSingleFileByArrayBufferRequestParams(configCode: string, type: string, extension: string, filename?: string | undefined): { urlWithParams: string; headers: Map<string, string>; };
    abstract getUserFileInfoFromSingleFileByArrayBufferResponse(response: any): IUserFileInfo;

    abstract preUploadChunkFile(file_md5: string, md5: string, index: number, specs: number, forced?: boolean | undefined): Promise<IPreUploadChunkFileResponse>;
    abstract singleChunkFile(key: string, md5: string, file: Blob, onProgress?: ((progress: IProgress) => void) | undefined, setupCancelToken?: ((cancelToken: Canceler) => void) | undefined): Promise<void>;
    abstract getSingleChunkFileByArrayBufferRequestParams(key: string, md5: string): { urlWithParams: string; headers: Map<string, string>; };
    abstract getUserFileInfoFromSingleChunkFileByArrayBufferResponse(response: any): IUserFileInfo;
    abstract uploadChunkFileFinished(configCode: string, file_md5: string, specs: number, total: number, type?: string | undefined, extension?: string | undefined, filename?: string | undefined): Promise<IUserFileInfo>;
}