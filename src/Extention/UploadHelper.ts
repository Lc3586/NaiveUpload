import ChunkFile from "../Model/ChunkFile";
import UploadError from "../Extention/UploadError";
import RawFile from "../Model/RawFile";
import { IApiService } from "../Core/IApiService";
import { Canceler } from "axios";
import { IUserFileInfo } from "../Model/IUserFileInfo";
import { UploadWorkerMessageType } from "../Model/UploadWorkerMessageType";
import { IValidationMD5Response } from "../Model/IValidationMD5Response";
import { IProgress } from "../Model/IProgress";
import { PreUploadChunkFileState } from "../Model/PreUploadChunkFileState";
import { IPreUploadChunkFileResponse } from "../Model/IPreUploadChunkFileResponse";
import { UploadWorkerScript } from "../Extention/UploadWorkerScript.js";
import { IUploadWorkerMessage } from "../Model/IUploadWorkerMessage";
import { IUploadWorkerFileMessage } from "../Model/IUploadWorkerFileMessage";
import FileReadHelper from "../Extention/FileReadHelper";


/**
 * 文件上传帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class UploadHelper {
    constructor(enableWorker: boolean,
        apiService: IApiService,
        debug: boolean) {
        this.debug = debug;
        this.enableWorker = enableWorker;
        this.workerSupported = 'undefined' !== typeof Worker;
        this.apiService = apiService;
        this.enableWorker && this.debug ? console.debug(`UploadHelper > WebWoeker ${(this.workerSupported ? '已启用' : '未启用（当前浏览器不支持）')}`) : !1;
    }

    /**
     * 是否启用Worker
     * 默认启用（如果浏览器支持的话）
     */
    private readonly enableWorker: boolean;

    /**
     * 浏览器是否支持Web Worker
     */
    private readonly workerSupported: boolean;

    /**
     * 调试模式
     */
    private readonly debug: boolean;

    /**
     * 接口服务
     */
    private apiService: IApiService;

    /**
     * 取消令牌
     */
    private cancelTokenList: Map<String, Canceler> = new Map<String, Canceler>();

    /**
     * 子线程上传单元
     */
    private workerUnits: {
        worker: Worker, used: boolean
    }[] = [];

    /**
     * 分片文件处理队列
     * */
    private chunkHandlerQueue: ChunkFile[] = [];

    /**
     * 分片文件处理方法
     */
    private chunkHandler: boolean[] = [];

    /**
     * 推迟次数
     * <p>如果所有分片文件都需要推迟，则忽略推迟操作，直接首个分片文件</p>
     * <p>同时推迟次数清零</p>
     */
    private delayTimes: number = 0;

    /**
     * 已完成
     */
    private finished: boolean = false;

    /**
     * 已取消
     */
    private canceled: boolean = false;

    /**
     * 已暂停
     */
    private paused: boolean = false;

    /**
     * 等待继续的回调
     */
    private waitToContinue: (((value: boolean | PromiseLike<boolean>) => void) | null)[] = [];

    /**
     * 文件数据读取器
     */
    private fileReaders: FileReadHelper[] = [];

    /**
     * 直接上传文件
     *
     * @param file
     * @param onProgress
     * @return 用户文件信息
     */
    private async uploadFile(
        this: UploadHelper,
        file: RawFile,
        onProgress: (progress: IProgress) => void): Promise<IUserFileInfo> {
        const userFileInfo = await this.apiService.singleFile(file.configCode!, file.file!, file.name, onProgress, cancelToken => {
            this.cancelTokenList.set(file.md5!, cancelToken);
        });
        this.cancelTokenList.delete(file.md5!);
        return userFileInfo;
    }

    /**
     * 直接上传分片文件
     *
     * @param handlerIndex
     * @param validation
     * @param chunk
     * @param onProgress
     */
    private async uploadChunkFile(
        this: UploadHelper,
        handlerIndex: number,
        validation: IPreUploadChunkFileResponse,
        chunk: ChunkFile,
        onProgress: (progress: IProgress) => void): Promise<void> {
        await this.apiService.singleChunkFile(validation.key, chunk.md5!, chunk.blob, onProgress, cancelToken => {
            this.cancelTokenList.set(chunk.md5!, cancelToken);
        });
        this.cancelTokenList.delete(chunk.md5!);
    }

    /**
     * 使用WebWorker上传文件
     *
     * @param file
     * @param onProgress
     */
    private async useWorkerUploadFile(
        this: UploadHelper,
        file: RawFile,
        onProgress: (progress: IProgress) => void): Promise<IUserFileInfo> {
        return new Promise<IUserFileInfo>(async (resolve, reject) => {
            let buffer: ArrayBuffer;
            try {
                buffer = await this.fileReaders[0].readAsArrayBuffer(file.file!);
            } catch (e) {
                reject(e);
                return;
            }

            try {
                const requestParams = this.apiService.getSingleFileByArrayBufferRequestParams(file.configCode!, file.file!.type, file.extension!, file.name);

                const userFileInfo = await this.workerPostMessage(0, {
                    type: UploadWorkerMessageType.下行_上传,
                    data: {
                        url: requestParams.urlWithParams,
                        headers: requestParams.headers,
                        buffer: buffer
                    } as IUploadWorkerFileMessage
                } as IUploadWorkerMessage<IUploadWorkerFileMessage>, onProgress, false) as IUserFileInfo;

                resolve(userFileInfo);
                return
            } catch (e) {
                reject(e);
                return;
            }
        });
    }

    /**
     * 使用WebWorker分片文件
     *
     * @param handlerIndex
     * @param validation 预先上传的验证结果
     * @param chunk
     * @param onProgress
     */
    private async useWorkerUploadChunkFile(
        this: UploadHelper,
        handlerIndex: number,
        validation: IPreUploadChunkFileResponse,
        chunk: ChunkFile,
        onProgress: (progress: IProgress) => void) {
        return new Promise<void>(async (resolve, reject) => {
            let buffer: ArrayBuffer;
            try {
                buffer = await this.fileReaders[handlerIndex].readAsArrayBuffer(chunk.blob);
            } catch (e) {
                reject(e);
                return;
            }

            try {
                const requestParams = this.apiService.getSingleChunkFileByArrayBufferRequestParams(validation.key, chunk.md5!);
                await this.workerPostMessage(
                    handlerIndex,
                    {
                        type: UploadWorkerMessageType.下行_上传,
                        data: {
                            url: requestParams.urlWithParams,
                            headers: requestParams.headers,
                            buffer: buffer
                        } as IUploadWorkerFileMessage
                    } as IUploadWorkerMessage<IUploadWorkerFileMessage>, onProgress, true);
            } catch (e) {
                reject(e);
                return;
            }

            resolve();
        });
    }

    /**
     * 发送数据给WebWorker
     *
     * @param handlerIndex
     * @param data
     * @param onProgress
     * @param chunkFile 是否为分片文件
     */
    private async workerPostMessage(
        this: UploadHelper,
        handlerIndex: number,
        data: IUploadWorkerMessage<IUploadWorkerFileMessage | void>,
        onProgress?: (progress: IProgress) => void,
        chunkFile?: boolean): Promise<IUserFileInfo | void> {

        let unit = this.workerUnits[handlerIndex];
        unit.used = true;

        return new Promise<IUserFileInfo | void>((resolve, reject) => {
            //接收回调
            unit.worker.onmessage = (event: MessageEvent<IUploadWorkerMessage<IProgress | IUserFileInfo | void>>) => {
                switch (event.data.type) {
                    case UploadWorkerMessageType.上行_进度:
                        const data_progress1 = event.data.data as IProgress;
                        onProgress && onProgress({
                            preLoaded: data_progress1.preLoaded,
                            total: data_progress1.total,
                            loaded: data_progress1.loaded
                        } as IProgress);
                        break;
                    case UploadWorkerMessageType.上行_取消:
                        const data_progress2 = event.data.data as IProgress;
                        onProgress && onProgress({
                            preLoaded: data_progress2.preLoaded,
                            total: data_progress2.total,
                            loaded: data_progress2.loaded
                        } as IProgress);
                        unit.used = false;
                        reject(new UploadError('上传操作已取消'));
                        break;
                    case UploadWorkerMessageType.上行_完成:
                        unit.used = false;
                        try {
                            const data_userFileInfo = chunkFile ? this.apiService.getUserFileInfoFromSingleChunkFileByArrayBufferResponse(event.data.data) : this.apiService.getUserFileInfoFromSingleFileByArrayBufferResponse(event.data.data);
                            resolve(data_userFileInfo);
                        } catch (e: any) {
                            reject(new UploadError('上传失败', e));
                        }
                        break;
                    case UploadWorkerMessageType.上行_失败:
                        const data_progress3 = event.data.data as IProgress;
                        onProgress && onProgress({
                            preLoaded: data_progress3.preLoaded,
                            total: data_progress3.total,
                            loaded: data_progress3.loaded
                        } as IProgress);
                        unit.used = false;
                        reject(new UploadError('上传失败'));
                        break;
                    case UploadWorkerMessageType.上行_超时:
                        const data_progress4 = event.data.data as IProgress;
                        onProgress && onProgress({
                            preLoaded: data_progress4.preLoaded,
                            total: data_progress4.total,
                            loaded: data_progress4.loaded
                        } as IProgress);
                        unit.used = false;
                        reject(new UploadError('上传操作处理超时'));
                        break;
                    default:
                        reject(new UploadError(`未知的UploadWorkerMessageType: ${event.data.type}.`));
                }
            }

            //监听异常
            unit.worker.onerror = event => {
                unit.used = false;
                reject(new UploadError('WebWorker发生错误', event.error));
            };
            unit.worker.onmessageerror = (event: MessageEvent) => {
                unit.used = false;
                reject(new UploadError(`WebWorker通讯错误，${event.data}`));
                return;
            };

            //发送数据
            if (data.type === UploadWorkerMessageType.下行_上传)
                unit.worker.postMessage(data, [(data.data as IUploadWorkerFileMessage).buffer]);
            else
                unit.worker.postMessage(JSON.parse(JSON.stringify(data)));
        });
    }

    /**
     * 关闭
     *
     * @param handlerIndex 索引
     */
    private async closeByIndex(this: UploadHelper, handlerIndex: number) {
        this.fileReaders[handlerIndex].close();
        this.debug ? console.debug('UploadHelper > FileReadHelper 已关闭', Object.assign({}, this.fileReaders[handlerIndex])) : !1;

        if (this.enableWorker && this.workerSupported) {
            await this.workerPostMessage(handlerIndex, { type: UploadWorkerMessageType.下行_关闭 } as IUploadWorkerMessage<void>);
            this.debug ? console.debug('UploadHelper > WebWoeker子线程计算单元 已关闭', Object.assign({}, this.workerUnits[handlerIndex].worker)) : !1;
        }
    }

    /**
     * 获取实例
     *
     * @param concurrent 并发数量
     * @param enableWorker 是否启用Worker
     * @param apiService 接口服务
     * @param debug 调试模式
     */
    public static async getInstance(
        concurrent: number,
        enableWorker: boolean = true,
        apiService: IApiService,
        debug: boolean = false): Promise<UploadHelper> {
        return new Promise<UploadHelper>((resolve) => {
            let helper = new UploadHelper(enableWorker, apiService, debug);

            //创建文件读取实例
            while (helper.fileReaders.length < concurrent) {
                helper.fileReaders.push(new FileReadHelper());
                helper.chunkHandler.push(false);
                helper.waitToContinue.push(null);
                helper.debug ? console.debug('UploadHelper > FileReadHelper 已创建', Object.assign({}, helper.fileReaders[helper.fileReaders.length - 1])) : !1;
            }

            //如果支持并且启用WebWorker，则使用脚本创建虚拟文件后后再创建WebWorker
            if (helper.enableWorker && helper.workerSupported) {
                window.URL = window.URL || window.webkitURL;
                for (let i = 0; i < concurrent; i++) {
                    helper.workerUnits.push({
                        worker: new Worker(window.URL.createObjectURL(UploadWorkerScript)),
                        used: false
                    });
                    helper.debug ? console.debug('UploadHelper > WebWoeker子线程计算单元 已创建', Object.assign({}, helper.workerUnits[i].worker)) : !1;
                }
            }

            resolve(helper);
        });
    }

    /**
     * 处理文件
     *
     * @param file 文件
     * @param onProgress 监听进度
     */
    public async handler(
        this: UploadHelper,
        file: RawFile,
        onProgress: (progress: IProgress) => void): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            this.debug ? console.debug('UploadHelper 开始处理', Object.assign({}, file)) : !1;

            /**
             * 上传结束
             */
            const done = () => {
                this.finished = true;
                this.debug ? console.debug('UploadHelper 处理结束', Object.assign({}, file)) : !1;
                resolve();
            }

            //文件MD5校验
            let validation: IValidationMD5Response;
            try {
                if (file.needSection)
                    validation = await this.apiService.preUploadFile(
                        file.configCode!,
                        file.md5!,
                        file.file!.type,
                        file.extension!,
                        file.file!.size.toString(),
                        file.name,
                        true,
                        file.specs,
                        file.chunks.length);
                else
                    validation = await this.apiService.preUploadFile(
                        file.configCode!,
                        file.md5!,
                        file.file!.type,
                        file.extension!,
                        file.file!.size.toString(),
                        file.name,
                        false);
            } catch (e) {
                reject(e);
                return;
            }

            if (validation.uploaded) {
                this.debug ? console.debug('UploadHelper 忽略已上传过的文件', Object.assign({}, file)) : !1;
                file.userFileInfo = validation.userFileInfo;
                done();
                return;
            }

            if (file.needSection) {
                /**
                 * 整体进度
                 */
                let progress: IProgress = { preLoaded: 0, loaded: 0, total: file.size };

                /**
                 * 上传分片文件
                 */
                const upload = async () => {
                    if (this.finished)
                        return;

                    if (this.chunkHandlerQueue.length === 0) {
                        for (let i = 0; i < this.chunkHandler.length; i++) {
                            if (this.chunkHandler[i]) {
                                return;
                            }
                        }

                        //所有分片全部上传完毕
                        try {
                            file.userFileInfo = await this.apiService.uploadChunkFileFinished(
                                file.configCode!,
                                file.md5!,
                                file.specs!,
                                file.chunks.length,
                                file.file!.type,
                                file.extension,
                                file.name);

                            done();
                        } catch (e) {
                            reject(e);
                        }
                        return;
                    }

                    let handlerIndex: number | null = null;
                    for (let i = 0; i < this.chunkHandler.length; i++) {
                        if (!this.chunkHandler[i]) {
                            handlerIndex = i;
                            break;
                        }
                    }

                    if (handlerIndex == null) {
                        this.debug ? console.debug(`HashHelper 已达到最大并发数：${this.chunkHandler.length}，当前队列长度：${this.chunkHandlerQueue.length}`, Object.assign({}, file)) : !1;
                        return;
                    }

                    this.chunkHandler[handlerIndex] = true;

                    /**
                     * 上传下一个分片文件
                     */
                    const next = () => {
                        onProgress(progress);

                        //取消上传则直接结束处理
                        if (this.canceled) {
                            resolve();
                            return;
                        }

                        //暂停则等待通知
                        if (this.paused) {
                            const wait = async () => {
                                return new Promise<boolean>((resolve, reject) => {
                                    this.waitToContinue[handlerIndex!] = resolve;
                                });
                            }

                            this.debug ? console.debug('UploadHelper > 已暂停', handlerIndex) : !1;

                            //等待继续
                            wait().then((flag: boolean) => {
                                this.waitToContinue[handlerIndex!] = null;

                                this.debug ? console.debug('UploadHelper > 已恢复', handlerIndex) : !1;

                                if (!flag) {
                                    //返回false则表示停止执行
                                    resolve();
                                    return;
                                }

                                this.chunkHandler[handlerIndex!] = false;
                                upload();
                            });
                        } else {
                            this.chunkHandler[handlerIndex!] = false;
                            upload();
                        }
                    };

                    //当前处理中的分片文件
                    const chunk = this.chunkHandlerQueue.shift()!;

                    //如已上传过了则直接跳过
                    if (chunk.uploaded) {
                        progress.preLoaded += chunk.size;
                        progress.loaded += chunk.size;
                        onProgress(progress);
                        next();
                        return;
                    }

                    /**
                     * 分片进度
                     */
                    let chunk_progress: IProgress = { preLoaded: chunk.size, loaded: 0, total: chunk.size };

                    /**
                     * 处理分片进度
                     *
                     * @param _chunk_progress
                     */
                    const handlerProgress = (_chunk_progress: IProgress) => {
                        progress.loaded += (_chunk_progress.loaded - chunk_progress.loaded);

                        chunk_progress.loaded = _chunk_progress.loaded;

                        onProgress(progress);
                    }

                    let validation: IPreUploadChunkFileResponse;
                    try {
                        validation = await this.apiService.preUploadChunkFile(
                            file.md5!,
                            chunk.md5!,
                            chunk.index,
                            file.specs!,
                            chunk.forced);
                    } catch (e) {
                        reject(e);
                        return;
                    }

                    progress.preLoaded! += chunk_progress.preLoaded;
                    onProgress(progress);

                    /**
                     * 继续上传
                     * */
                    const proceed = async () => {
                        if (this.workerSupported) {
                            await this.useWorkerUploadChunkFile(handlerIndex!, validation, chunk, handlerProgress);
                        } else {
                            await this.uploadChunkFile(handlerIndex!, validation, chunk, handlerProgress);
                        }
                    };

                    switch (validation.state) {
                        case PreUploadChunkFileState.允许上传:
                            await proceed();
                            break;
                        case PreUploadChunkFileState.全部跳过:
                            this.chunkHandlerQueue.length = 0;
                            return;
                        case PreUploadChunkFileState.推迟上传:
                            this.chunkHandlerQueue.push(chunk);

                            this.delayTimes++;
                            if (this.delayTimes >= this.chunkHandlerQueue.length) {
                                this.delayTimes = 0;
                                chunk.forced = true;
                            }
                            break;
                        case PreUploadChunkFileState.跳过:
                            handlerProgress({ preLoaded: chunk.size, loaded: chunk.size, total: chunk.size });
                            break;
                    }

                    next();
                }

                /**
                 * 添加至队列
                 */
                const push = (chunk: ChunkFile) => {
                    this.chunkHandlerQueue.push(chunk);
                    upload();
                }

                for (let chunk of file.chunks) {
                    push(chunk);
                }
            } else {
                try {
                    if (this.workerSupported) {
                        file.userFileInfo = await this.useWorkerUploadFile(file, onProgress);
                    } else {
                        file.userFileInfo = await this.uploadFile(file, onProgress);
                    }

                    done();
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    /**
     * 取消
     */
    public async cancel(this: UploadHelper) {
        this.canceled = true;
        if (this.paused) {
            //如果已暂停，则先通知取消执行
            this.paused = false;
            for (const item of this.waitToContinue) {
                item && item(false);
            }
        }

        //取消当前所有进行中的请求
        if (this.enableWorker && this.workerSupported) {
            for (let i = 0; i < this.workerUnits.length; i++) {
                if (!this.workerUnits[i].used)
                    continue;
                await this.workerPostMessage(i, { type: UploadWorkerMessageType.下行_取消 } as IUploadWorkerMessage<void>);
                this.debug ? console.debug('UploadHelper > WebWoeker子线程计算单元 已取消', Object.assign({}, this.workerUnits[i].worker)) : !1;
            }
        } else {
            for (const cancelToken of this.cancelTokenList.values()) {
                cancelToken();
            }
        }

        this.debug ? console.debug('UploadHelper 已取消') : !1;
    }

    /**
     * 暂停
     */
    public async pause(this: UploadHelper) {
        this.paused = true;
        this.debug ? console.debug('UploadHelper 已暂停') : !1;
    }

    /**
     * 恢复
     */
    public async continue(this: UploadHelper) {
        this.paused = false;
        for (const item of this.waitToContinue) {
            item && item(true);
        }
        this.debug ? console.debug('UploadHelper 已恢复') : !1;
    }

    /**
     * 关闭
     */
    public async close(this: UploadHelper) {
        //关闭所有的文件数据读取器
        if (this.enableWorker && this.workerSupported) {
            for (let i = 0; i < this.workerUnits.length; i++) {
                await this.closeByIndex(i);
            }
        } else {
            for (let i = 0; i < this.fileReaders.length; i++) {
                await this.closeByIndex(i);
            }
        }

        this.debug ? console.debug('UploadHelper 已关闭') : !1;
    }
}