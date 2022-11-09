import { IApiService } from "../Core/IApiService";
import { IConfig } from "../Model/IConfig";
import Settings from "../Model/Settings";
import RawFile from "../Model/RawFile";
import SelectedFile from "../Model/SelectedFile";
import { IUserFileInfo } from "../Model/IUserFileInfo";
import { IOpenApi } from "../Extention/IOpenApi";
import { Layout } from "../Model/Layout";
/**
 * 初级上传工具
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class NaiveUpload {
    /**
     *
     * @param settings 设置
     * @param apiService 接口服务
     */
    constructor(settings: Settings, apiService: IApiService);
    /**
     * 用于设置数据对象的双向绑定
     */
    private readonly reactive;
    /**
     * 设置
     */
    private readonly settings;
    /**
     * 接口服务
     */
    private readonly apiService;
    /**
     * 文件上传配置
     */
    private config?;
    /**
     * 源文件集合
     */
    private readonly rawFileList;
    /**
     * 选择的文件集合
     */
    private readonly selectedFileList;
    /**
     * 选择的文件排序值映射表
     *
     * <p>key：排序值，value：selectedFileList中的索引</p>
     */
    private readonly selectedFileSortMap;
    /**
     * 校验文件队列
     * 数据项为this.SelectedFileList的索引
     */
    private checkQueue;
    /**
     * 当前正在校验中的文件数量
     */
    private checkHandlerCount;
    /**
     * 上传文件队列
     * 数据项为this.SelectedFileList的索引
     */
    private uploadQueue;
    /**
     * 暂停文件
     * key：数据项为this.SelectedFileList的索引，value：{step：0：校验步骤、1：上传步骤，helper：实例，continue：是否已恢复}
     */
    private pausedQueue;
    /**
     * 当前正在上传中的文件数量
     */
    private uploadHandlerCount;
    /**
     * 追加文件后返回的文件令牌和selectedFileList索引映射表
     */
    private tokenWithIndex;
    /**
     * 布局变更后执行
     *
     * @param layout 布局
     */
    private layoutChanged;
    /**
     * 配置变更后执行
     *
     * @param config 配置
     */
    private configChanged;
    /**
     * 选择的文件集合变更后执行
     *
     * @param files 当前的文件集合（已排序）
     */
    private selectedFileListChanged;
    /**
     * 提示异常
     *
     * @param error 异常
     */
    private alertError;
    /**
     * 文件校验前执行
     *
     * @param file 文件
     * @returns 是否保留该文件
     */
    private beforeCheck?;
    /**
     * 文件校验结束后执行
     *
     * @param rawFile 文件
     */
    private afterCheck?;
    /**
     * 文件校验全部校验结束后执行
     *
     * @param rawFileList 文件集合
     */
    private afterCheckAll?;
    /**
     * 文件上传后执行
     *
     * @param rawFile 文件
     */
    private afterUpload?;
    /**
     * 所有文件上传后执行
     * <p>此方法将会异步执行</p>
     *
     * @param rawFileList 文件集合
     */
    private afterUploadAll?;
    /**
     * 发生异常后执行
     * <p>此方法将会异步执行</p>
     *
     * @param error 异常
     */
    private handlerError?;
    /**
     * 更新文件上传配置
     */
    private updateConfig;
    /**
     * 监听配置的变化
     */
    private watchSettings;
    /**
     * 追加文件
     *
     * @param file
     */
    private appendFile;
    /**
     * 追加以前上传过的文件
     *
     * @param id
     */
    private appendUploadedFile;
    /**
     * 获取文件类型
     *
     * @param selectedFile
     */
    private getFileType;
    /**
     * 检查图像
     *
     * @param {any} selectedFile
     */
    private checkImage;
    /**
     * 获取原始文件
     *
     * @param selectedFile
     */
    getRawFile(this: NaiveUpload, selectedFile: SelectedFile): RawFile;
    /**
     * 文件切片
     *
     * @param selectedFile
     */
    private getChunks;
    /**
     * 处理文件
     *
     * @param selectedFileIndex 索引
     */
    private handleFile;
    /**
     * 推送至校验队列
     *
     * @param selectedFileIndex
     */
    private pushToCheckQueue;
    /**
     * 推送至上传队列
     *
     * @param selectedFileIndex
     */
    private pushToUploadQueue;
    /**
     * 开始校验MD5
     */
    private checkMD5;
    /**
     * 开始上传已经校验过了的文件
     */
    private upload;
    /**
     * 计算进度
     *
     * @param selectedFile 文件
     * @param progress 进度
     */
    private static calcPercent;
    /**
     * 抛出异常
     *
     * @param error
     */
    private throwError;
    /**
     * 异常
     *
     * @param selectedFileIndex
     * @param message 异常信息
     * @param retry 是否允许重试
     * @param done 回调
     */
    private error;
    /**
     * 校验时异常
     *
     * @param selectedFileIndex
     * @param message 说明
     * @param retry 是否允许重试
     * @param e 异常
     */
    private checkError;
    /**
     * 上传时异常
     *
     * @param selectedFileIndex
     * @param message 说明
     * @param retry 是否允许重试
     * @param e 异常
     */
    private uploadError;
    /**
     * 文件重命名
     *
     * @param selectedFile
     * @param rename 文件重命名
     */
    private renameByIndex;
    /**
     * 恢复处理
     *
     * @param index
     */
    private continueByIndex;
    /**
     * 获取实例
     *
     * @param settings 设置
     * @param apiService 接口服务
     */
    static getInstance(settings: Settings, apiService: IApiService): Promise<NaiveUpload>;
    /**
     * 获取设置
     */
    getSettings(this: NaiveUpload): Settings;
    /**
     * 获取文件上传配置
     */
    getConfig(this: NaiveUpload): IConfig;
    /**
     * 校验队列中的文件
     */
    checkNow(this: NaiveUpload): void;
    /**
     * 上传队列中的文件
     */
    uploadNow(this: NaiveUpload): void;
    /**
     * 暂停
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时暂停全部
     */
    pause(this: NaiveUpload, token?: string): void;
    /**
     * 恢复
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时恢复全部
     */
    continue(this: NaiveUpload, token?: string): void;
    /**
     * 删除
     *
     * @param token 追加文件后返回的文件令牌
     */
    remove(this: NaiveUpload, token: string): void;
    /**
     * 清空
     */
    clean(this: NaiveUpload): void;
    /**
     * 重置
     */
    reset(this: NaiveUpload): void;
    /**
     * 获取开发的接口
     */
    getOpenApi(this: NaiveUpload): IOpenApi;
    /**
     * 文件重命名
     *
     * @param token  追加文件后返回的文件令牌
     * @param rename 文件重命名
     */
    rename(this: NaiveUpload, token: string, rename: string): Promise<void>;
    /**
     * 获取下载地址
     *
     * @param selectedFile 选择的文件
     * @return 下载地址
     */
    getDownloadUrl(this: NaiveUpload, selectedFile: SelectedFile): string | null;
    /**
     * 选择的文件列表是否有有效的数据
     */
    anyFile(this: NaiveUpload): boolean;
    /**
     * 获取选择文件时要显示的警告信息
     */
    getSelectFileAlarmInfo(this: NaiveUpload): string;
    /**
     * 获取文件选择框类名
     */
    getSelectCLass(this: NaiveUpload): string;
    /**
     * 获取全部允许的类型
     */
    getAllowedTypes(this: NaiveUpload): string;
    /**
     * 是否已达上限
     *
     * @return true: 已达上限
     */
    limited(this: NaiveUpload): boolean;
    /**
     * 当前文件总大小
     *
     * @return size: 字节数
     */
    totalSize(this: NaiveUpload): number;
    /**
     * 追加文件
     *
     * @param file 文件
     */
    append(this: NaiveUpload, file: File): void;
    /**
     * 追加以前上传过的文件
     *
     * @param id 标识
     */
    appendById(this: NaiveUpload, id: string): Promise<void>;
    /**
     * 更改排序值
     *
     * @param currentIndex 当前排序值
     * @param targetIndex 目标排序值
     */
    changeSort(this: NaiveUpload, currentIndex: number, targetIndex: number): void;
    /**
     * 注册布局变更后执行的函数
     *
     * @param even
     */
    registerLayoutChanged(this: NaiveUpload, even: (layout: Layout) => void): void;
    /**
     * 注册配置变更后执行的函数
     *
     * @param even
     */
    registerConfigChanged(this: NaiveUpload, even: (config: IConfig) => void): void;
    /**
     * 注册选择的文件集合变更后执行的函数
     *
     * @param even
     */
    registerSelectedFileListChanged(this: NaiveUpload, even: (files: SelectedFile[]) => void): void;
    /**
     * 注册提示异常的函数
     *
     * @param even
     */
    registerAlertError(this: NaiveUpload, even: (error: Error) => void): void;
    /**
     * 设置文件校验前执行的函数
     *
     * @param even
     */
    setupBeforeCheck(this: NaiveUpload, even: (file: File) => Promise<boolean>): void;
    /**
     * 设置文件校验结束后执行的函数
     *
     * @param even
     */
    setupAfterCheck(this: NaiveUpload, even: (rawFile: RawFile) => Promise<void>): void;
    /**
     * 设置文件校验全部校验结束后执行的函数
     *
     * @param even
     */
    setupAfterCheckAll(this: NaiveUpload, even: (rawFileList: RawFile[]) => Promise<void>): void;
    /**
     * 设置文件上传后执行的函数
     *
     * @param even
     */
    setupAfterUpload(this: NaiveUpload, even: (rawFile: RawFile) => Promise<void>): void;
    /**
     * 设置所有文件上传后执行的函数
     *
     * @param even
     */
    setupAfterUploadAll(this: NaiveUpload, even: (rawFileList: RawFile[]) => Promise<void>): void;
    /**
     * 设置发生异常后执行的函数
     *
     * @param even
     */
    setupHandlerError(this: NaiveUpload, even: (error: Error) => Promise<void>): void;
    /**
     * 获取当前选择的文件数量
     */
    getSelectedFileCount(this: NaiveUpload): number;
    /**
     * 获取当前选择的文件排序值映射表
     */
    getSelectedFileSortMap(this: NaiveUpload): Map<number, number>;
    /**
     * 获取当前所有选择的文件集合
     *
     * @param sort 是否需要排序
     */
    getSelectedFileList(this: NaiveUpload, sort: boolean): SelectedFile[];
    /**
     * 获取当前所有文件集合
     *
     * @param sort 是否需要排序
     */
    getRawFileList(this: NaiveUpload, sort: boolean): RawFile[];
    /**
     * 获取当前所有的用户文件信息集合
     *
     * @param sort 是否需要排序
     */
    getUserFileInfoList(this: NaiveUpload, sort: boolean): IUserFileInfo[];
    /**
     * 获取选择的文件
     *
     * @param sortKey 排序值
     */
    getSelectedFile(this: NaiveUpload, sortKey: number): SelectedFile;
    /**
     * 获取渐变色样式
     * @param {string} type 类型 conic锥形渐变,linear线性渐变
     * @param {string} color 颜色
     * @param {number} value1 值1
     * @param {number} value2 值2
     */
    getGradientStyle(type: string, color: string, value1: number, value2: number): string;
}
