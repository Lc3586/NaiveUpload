import RawFile from "../Model/RawFile";
import { IApiService } from "../Core/IApiService";
import { IProgress } from "../Model/IProgress";
/**
 * 文件上传帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class UploadHelper {
    constructor(enableWorker: boolean, apiService: IApiService, debug: boolean);
    /**
     * 是否启用Worker
     * 默认启用（如果浏览器支持的话）
     */
    private readonly enableWorker;
    /**
     * 浏览器是否支持Web Worker
     */
    private readonly workerSupported;
    /**
     * 调试模式
     */
    private readonly debug;
    /**
     * 接口服务
     */
    private apiService;
    /**
     * 取消令牌
     */
    private cancelTokenList;
    /**
     * 子线程上传单元
     */
    private workerUnits;
    /**
     * 分片文件处理队列
     * */
    private chunkHandlerQueue;
    /**
     * 分片文件处理方法
     */
    private chunkHandler;
    /**
     * 推迟次数
     * <p>如果所有分片文件都需要推迟，则忽略推迟操作，直接首个分片文件</p>
     * <p>同时推迟次数清零</p>
     */
    private delayTimes;
    /**
     * 已完成
     */
    private finished;
    /**
     * 已取消
     */
    private canceled;
    /**
     * 已暂停
     */
    private paused;
    /**
     * 等待继续的回调
     */
    private waitToContinue;
    /**
     * 文件数据读取器
     */
    private fileReaders;
    /**
     * 直接上传文件
     *
     * @param file
     * @param onProgress
     * @return 用户文件信息
     */
    private uploadFile;
    /**
     * 直接上传分片文件
     *
     * @param handlerIndex
     * @param validation
     * @param chunk
     * @param onProgress
     */
    private uploadChunkFile;
    /**
     * 使用WebWorker上传文件
     *
     * @param file
     * @param onProgress
     */
    private useWorkerUploadFile;
    /**
     * 使用WebWorker分片文件
     *
     * @param handlerIndex
     * @param validation 预先上传的验证结果
     * @param chunk
     * @param onProgress
     */
    private useWorkerUploadChunkFile;
    /**
     * 发送数据给WebWorker
     *
     * @param handlerIndex
     * @param data
     * @param onProgress
     * @param chunkFile 是否为分片文件
     */
    private workerPostMessage;
    /**
     * 关闭
     *
     * @param handlerIndex 索引
     */
    private closeByIndex;
    /**
     * 获取实例
     *
     * @param concurrent 并发数量
     * @param enableWorker 是否启用Worker
     * @param apiService 接口服务
     * @param debug 调试模式
     */
    static getInstance(concurrent: number, enableWorker: boolean | undefined, apiService: IApiService, debug?: boolean): Promise<UploadHelper>;
    /**
     * 处理文件
     *
     * @param file 文件
     * @param onProgress 监听进度
     */
    handler(this: UploadHelper, file: RawFile, onProgress: (progress: IProgress) => void): Promise<void>;
    /**
     * 取消
     */
    cancel(this: UploadHelper): Promise<void>;
    /**
     * 暂停
     */
    pause(this: UploadHelper): Promise<void>;
    /**
     * 恢复
     */
    continue(this: UploadHelper): Promise<void>;
    /**
     * 关闭
     */
    close(this: UploadHelper): Promise<void>;
}
