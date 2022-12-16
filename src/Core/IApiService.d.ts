import { IConfig } from "../Model/IConfig";
import { IUserFileInfo } from "../Model/IUserFileInfo";
import { FileType } from "../Model/FileType";
import { Canceler } from "axios";
import { IPreUploadChunkFileResponse } from "../Model/IPreUploadChunkFileResponse";
import { IProgress } from "../Model/IProgress";
import { IPreUploadFileResponse } from "../Model/IPreUploadFileResponse";
/**
 * 接口服务
 *
 * @author LCTR
 * @date 2022-09-21
 */
export interface IApiService {
    /**
     * 获取上传配置
     *
     * @param code 配置编码
     * @return 配置
     */
    config(code: string): Promise<IConfig>;
    /**
     * 获取用户文件信息
     *
     * @param id 标识
     * @return 用户文件信息
     */
    getUserFile(id: string): Promise<IUserFileInfo>;
    /**
     * 重命名
     *
     * @param id 主键
     * @param fileName 文件名
     */
    rename(id: string, fileName: string): Promise<void>;
    /**
     * 获取下载地址
     *
     * @param id 主键
     * @param rename 文件重命名
     * @return 下载地址
     */
    getDownloadUrl(id: string, rename: string): string;
    /**
     * 获取用户文件预览地址
     *
     * @param id     主键
     * @param width  宽度（可选）
     * @param height 高度（可选）
     * @param time   视频的时间轴位置（示例值：1:59:59）（可选）
     * @return 地址
     */
    getUserFilePreviewUrl(id: string, width?: number, height?: number, time?: string): string;
    /**
     * 获取用户文件浏览地址
     *
     * @param id     主键
     * @return 地址
     */
    getUserFileBrowseUrl(id: string): string;
    /**
     * 获取文件类型预览图地址
     *
     * @param extension 文件拓展名
     * @return 地址
     */
    getFileTypeImageUrl(extension: string): string;
    /**
     * 获取未知文件类型的预览图地址
     *
     * @return 地址
     */
    getUnknowFileTypeImageUrl(): string;
    /**
     * 获取文件类型
     *
     * @param extension 文件拓展名
     * @return 文件类型
     */
    getFileTypeByExtension(extension: string): Promise<FileType>;
    /**
     * 获取文件类型
     *
     * @param mimetype 文件内容类型
     * @return 文件类型
     */
    getFileTypeByMIME(mimetype: string): Promise<FileType>;
    /**
     * 预备上传文件
     *
     * @param configCode 上传配置编码
     * @param md5        文件MD5值
     * @param type       文件类型
     * @param extension  文件拓展名
     * @param length     文件字节数
     * @param filename   文件重命名（可选）
     * @param section    是否分片处理（可选）
     * @param specs      分片文件规格（可选）
     * @param total      分片文件总数（可选）
     * @return 输出信息
     */
    preUploadFile(configCode: string, md5: string, type: string, extension: string, length: string, filename?: string, section?: boolean, specs?: number, total?: number): Promise<IPreUploadFileResponse>;
    /**
     * 预备上传分片文件
     *
     * @param file_md5 文件MD5值
     * @param md5      分片文件MD5值
     * @param index    分片文件索引
     * @param specs    分片文件规格
     * @param forced   强制上传（可选）
     * @return 输出信息
     */
    preUploadChunkFile(file_md5: string, md5: string, index: number, specs: number, forced?: boolean): Promise<IPreUploadChunkFileResponse>;
    /**
     * 上传单个文件
     *
     * @param configCode 上传配置编码
     * @param file       文件
     * @param filename   文件重命名（可选）
     * @param onProgress 进度更新后的回调事件（可选）
     * @param setupCancelToken 设置取消请求的回调事件（可选）
     * @return 用户文件信息
     */
    singleFile(configCode: string, file: File, filename?: string, onProgress?: (progress: IProgress) => void, setupCancelToken?: (cancelToken: Canceler) => void): Promise<IUserFileInfo>;
    /**
     * 获取上传单个文件的请求参数
     * <p>通过ArrayBuffer的方式上传</p>
     *
     * @param configCode 上传配置编码
     * @param type       文件类型
     * @param extension  文件拓展名
     * @param filename   文件重命名（可选）
     * @return {urlWithParams: string, headers: Map<string, string>} urlWithParams: 完整的接口地址以及参数, headers: 请求头（Content-type默认会指定为applicatoin/octet-stream）
     */
    getSingleFileByArrayBufferRequestParams(configCode: string, type: string, extension: string, filename?: string): {
        urlWithParams: string;
        headers: Map<string, string>;
    };
    /**
     * 从上传单个文件的接口的响应数据中获取用户文件信息
     *
     * @param response 响应数据（JSON对象）
     * @return 用户文件信息
     * @throws 接口返回失败
     */
    getUserFileInfoFromSingleFileByArrayBufferResponse(response: any): IUserFileInfo;
    /**
     * 上传单个分片文件
     *
     * @param key  上传标识
     * @param md5  分片文件MD5值
     * @param file 分片文件
     * @param onProgress 进度更新后的回调事件（可选）
     * @param setupCancelToken 设置取消请求的回调事件（可选）
     */
    singleChunkFile(key: string, md5: string, file: Blob, onProgress?: (progress: IProgress) => void, setupCancelToken?: (cancelToken: Canceler) => void): Promise<void>;
    /**
     * 获取上传单个分片文件的请求参数
     * <p>通过ArrayBuffer的方式上传</p>
     *
     * @param key  上传标识
     * @param md5  分片文件MD5值
     * @return {urlWithParams: string, headers: Map<string, string>} urlWithParams: 完整的接口地址以及参数, headers: 请求头（Content-type默认会指定为applicatoin/octet-stream）
     */
    getSingleChunkFileByArrayBufferRequestParams(key: string, md5: string): {
        urlWithParams: string;
        headers: Map<string, string>;
    };
    /**
     * 从上传单个分片文件的接口的响应数据中获取用户文件信息
     *
     * @param response 响应数据（JSON对象）
     * @return 用户文件信息
     * @throws 接口返回失败
     */
    getUserFileInfoFromSingleChunkFileByArrayBufferResponse(response: any): IUserFileInfo;
    /**
     * 分片文件全部上传完毕
     *
     * @param configCode 文件上传配置
     * @param file_md5   文件MD5值
     * @param specs      分片文件规格
     * @param total      分片文件总数
     * @param type       文件类型（可选）
     * @param extension  文件拓展名（可选）
     * @param filename   文件重命名（可选）
     * @return 个人文件信息
     */
    uploadChunkFileFinished(configCode: string, file_md5: string, specs: number, total: number, type?: string, extension?: string, filename?: string): Promise<IUserFileInfo>;
}
