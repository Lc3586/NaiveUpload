import RawFile from "../Model/RawFile";
import { IProgress } from "../Model/IProgress";
/**
 * 哈希值计算帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class HashHelper {
    constructor(enableWorker: boolean, debug: boolean);
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
     * Spark计算单元
     */
    private sparkUnits;
    /**
     * 子线程计算单元
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
     * 直接校验分片文件
     *
     * @param file
     * @param handlerIndex 主索引
     * @param onProgress
     * @return md5 返回的是主索引对应的计算单元的计算结果
     */
    private checkFile;
    /**
     * 追加数据
     *
     * @param blob 数据
     * @param handlerIndex
     */
    private appendData;
    /**
     * 获取当前计算的结果
     *
     * @param handlerIndex
     */
    private getResult;
    /**
     * 全部重置
     */
    private reset;
    /**
     * 重置
     *
     * @param handlerIndex
     */
    private resetByIndex;
    /**
     * 关闭
     *
     * @param handlerIndex 索引
     */
    private closeByIndex;
    /**
     * 发送数据给WebWorker
     *
     * @param handlerIndex
     * @param data
     */
    private workerPostMessage;
    /**
     * 获取实例
     *
     * @param concurrent 并发数量
     * @param enableWorker 是否启用Worker
     * @param debug 调试模式
     */
    static getInstance(concurrent?: number, enableWorker?: boolean, debug?: boolean): Promise<HashHelper>;
    /**
     * 处理文件
     *
     * @param file 文件
     * @param onProgress 监听进度
     */
    handler(this: HashHelper, file: RawFile, onProgress: (progress: IProgress) => void): Promise<void>;
    /**
     * 取消
     */
    cancel(this: HashHelper): Promise<void>;
    /**
     * 暂停
     */
    pause(this: HashHelper): Promise<void>;
    /**
     * 恢复
     */
    continue(this: HashHelper): Promise<void>;
    /**
     * 关闭
     */
    close(this: HashHelper): Promise<void>;
}
