import SparkMD5 from "spark-md5";
import { HashWorkerScript } from "./HashWorkerScript";
import UploadError from "../Extention/UploadError";
import FileReadHelper from "../Extention/FileReadHelper";
import { IHashWorkerMessage } from "../Model/IHashWorkerMessage";
import { HashWorkerMessageType } from "../Model/HashWorkerMessageType";
import RawFile from "../Model/RawFile";
import { IProgress } from "../Model/IProgress";
import ChunkFile from "../Model/ChunkFile";


/**
 * 哈希值计算帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class HashHelper {
    constructor(enableWorker: boolean,
        debug: boolean) {
        this.debug = debug;
        this.enableWorker = enableWorker;
        this.workerSupported = 'undefined' !== typeof Worker;
        this.enableWorker && this.debug ? console.debug(`HashHelper > WebWoeker ${(this.workerSupported ? '已启用' : '未启用（当前浏览器不支持）')}`) : !1;
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
     * Spark计算单元
     */
    private sparkUnits: any[] = [];

    /**
     * 子线程计算单元
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
     * 直接校验分片文件
     *
     * @param file
     * @param handlerIndex 主索引
     * @param onProgress
     * @return md5 返回的是主索引对应的计算单元的计算结果
     */
    private async checkFile(
        this: HashHelper,
        file: RawFile | ChunkFile,
        handlerIndex: number,
        onProgress: (progress: IProgress) => void): Promise<string | void> {
        return new Promise<string | void>(async (resolve, reject) => {
            //文件
            const xFile = file as { checkPosition: number, size: number, blob: Blob, file?: File };
            if (file instanceof RawFile)
                xFile.blob = xFile.file!;

            //分片进度
            let progress: IProgress = { preLoaded: 0, loaded: 0, total: file.size };
            onProgress(progress);

            //校验完整的文件，每次计算1MB的数据
            const bufferSize = 1024 * 1024;
            while (xFile.checkPosition < xFile.size) {
                //取消校验则直接结束处理
                if (this.canceled) {
                    await this.reset();
                    resolve();
                    break;
                }

                //暂停则等待通知
                if (this.paused) {
                    const wait = async () => {
                        return new Promise<boolean>((resolve, reject) => {
                            this.waitToContinue[handlerIndex] = resolve;
                        });
                    }

                    this.debug ? console.debug('HashHelper > 已暂停', handlerIndex) : !1;

                    //等待继续
                    const flag = await wait();

                    this.waitToContinue[handlerIndex] = null;

                    this.debug ? console.debug('HashHelper > 已恢复', handlerIndex) : !1;

                    if (!flag) {
                        //返回false则表示停止执行
                        resolve();
                        return;
                    }
                }

                const blob = xFile.blob.slice(xFile.checkPosition, Math.min(xFile.checkPosition + bufferSize, xFile.size));
                xFile.checkPosition += blob.size;

                progress.preLoaded += blob.size;
                onProgress(progress);

                //追加数据
                await this.appendData(blob, handlerIndex);

                progress.loaded += blob.size;
                onProgress(progress);
            }

            //获取计算结果
            resolve(await this.getResult(handlerIndex));
        });
    }

    /**
     * 追加数据
     *
     * @param blob 数据
     * @param handlerIndex
     */
    private async appendData(this: HashHelper, blob: Blob, handlerIndex: number): Promise<void> {
        let buffer = await this.fileReaders[handlerIndex].readAsArrayBuffer(blob);

        const message = { type: HashWorkerMessageType.下行_附加数据, data: buffer } as IHashWorkerMessage<ArrayBuffer>;

        if (this.workerSupported) {
            await this.workerPostMessage(handlerIndex, message);
        } else {
            this.sparkUnits[handlerIndex].append(buffer);
        }
    }

    /**
     * 获取当前计算的结果
     *
     * @param handlerIndex
     */
    private async getResult(this: HashHelper, handlerIndex: number): Promise<string> {
        const message = { type: HashWorkerMessageType.下行_获取结果 } as IHashWorkerMessage<void>;

        if (this.workerSupported) {
            return await this.workerPostMessage(handlerIndex, message) as string;
        } else {
            return this.sparkUnits[handlerIndex].end();
        }
    }

    /**
     * 全部重置
     */
    private async reset(this: HashHelper) {
        if (this.enableWorker && this.workerSupported) {
            for (let i = 0; i < this.workerUnits.length; i++) {
                await this.resetByIndex(i);
            }
        } else {
            for (let i = 0; i < this.sparkUnits.length; i++) {
                await this.resetByIndex(i);
            }
        }
    }

    /**
     * 重置
     *
     * @param handlerIndex
     */
    private async resetByIndex(this: HashHelper, handlerIndex: number) {
        if (this.enableWorker && this.workerSupported) {
            if (!this.workerUnits[handlerIndex].used)
                return;
            await this.workerPostMessage(handlerIndex, { type: HashWorkerMessageType.下行_重置 } as IHashWorkerMessage<void>);
            this.debug ? console.debug('HashHelper > WebWoeker子线程计算单元 已重置', Object.assign({}, this.workerUnits[handlerIndex])) : !1;
        } else {
            this.sparkUnits[handlerIndex].reset();
            this.debug ? console.debug('HashHelper > Spark计算单元 已重置', Object.assign({}, this.sparkUnits[handlerIndex])) : !1;
        }
    }

    /**
     * 关闭
     *
     * @param handlerIndex 索引
     */
    private async closeByIndex(this: HashHelper, handlerIndex: number) {
        this.fileReaders[handlerIndex].close();
        this.debug ? console.debug('HashHelper > FileReadHelper 已关闭', Object.assign({}, this.fileReaders[handlerIndex])) : !1;

        if (this.enableWorker && this.workerSupported) {
            await this.workerPostMessage(handlerIndex, { type: HashWorkerMessageType.下行_关闭 } as IHashWorkerMessage<void>);
            this.debug ? console.debug('HashHelper > WebWoeker子线程计算单元 已关闭', Object.assign({}, this.workerUnits[handlerIndex])) : !1;
        } else {
            this.sparkUnits[handlerIndex].destroy();
            this.debug ? console.debug('HashHelper > Spark计算单元 已关闭', Object.assign({}, this.sparkUnits[handlerIndex])) : !1;
        }
    }

    /**
     * 发送数据给WebWorker
     *
     * @param handlerIndex
     * @param data
     */
    private async workerPostMessage(
        this: HashHelper,
        handlerIndex: number,
        data: IHashWorkerMessage<ArrayBuffer | void>): Promise<string | void> {

        let unit = this.workerUnits[handlerIndex];
        unit.used = true;

        return new Promise<string | void>((resolve, reject) => {
            //接收回调
            unit.worker.onmessage = (event: MessageEvent<IHashWorkerMessage<string | void>>) => {
                switch (event.data.type) {
                    case HashWorkerMessageType.上行_结果:
                        resolve(event.data.data as string);
                        break;
                    case HashWorkerMessageType.上行_应答:
                    default:
                        resolve();
                }
            }

            //监听异常
            unit.worker.onerror = event => {
                unit.used = false;
                reject(new UploadError('WebWorker异常', event.error));
            };
            unit.worker.onmessageerror = (event: MessageEvent) => {
                unit.used = false;
                reject(new UploadError(`WebWorker通讯错误，${event.data}`));
            };

            //发送数据
            if (data.type === HashWorkerMessageType.下行_附加数据)
                unit.worker.postMessage(data, [data.data as ArrayBuffer]);
            else
                unit.worker.postMessage(JSON.parse(JSON.stringify(data)));
        });
    }

    /**
     * 获取实例
     *
     * @param concurrent 并发数量
     * @param enableWorker 是否启用Worker
     * @param debug 调试模式
     */
    public static async getInstance(
        concurrent: number = 1,
        enableWorker: boolean = true,
        debug: boolean = false): Promise<HashHelper> {
        return new Promise<HashHelper>((resolve) => {
            let helper = new HashHelper(enableWorker, debug);

            //创建文件读取实例和分片处理方法的状态
            while (helper.fileReaders.length < concurrent) {
                helper.fileReaders.push(new FileReadHelper());
                helper.chunkHandler.push(false);
                helper.waitToContinue.push(null);
                helper.debug ? console.debug('HashHelper > FileReadHelper 已创建', Object.assign({}, helper.fileReaders[helper.fileReaders.length - 1])) : !1;
            }

            //如果支持并且启用WebWorker，则使用脚本创建虚拟文件后后再创建WebWorker
            if (helper.enableWorker && helper.workerSupported) {
                window.URL = window.URL || window.webkitURL;
                for (let i = 0; i < concurrent; i++) {
                    helper.workerUnits.push({
                        worker: new Worker(window.URL.createObjectURL(HashWorkerScript)),
                        used: false
                    });
                    helper.debug ? console.debug('HashHelper > WebWoeker子线程计算单元 已创建', Object.assign({}, helper.workerUnits[i].worker)) : !1;
                }
            } else {
                while (helper.sparkUnits.length < concurrent) {
                    helper.sparkUnits.push(new SparkMD5.ArrayBuffer());
                    helper.debug ? console.debug('HashHelper > Spark计算单元 已创建', Object.assign({}, helper.sparkUnits[helper.sparkUnits.length - 1])) : !1;
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
        this: HashHelper,
        file: RawFile,
        onProgress: (progress: IProgress) => void): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            this.debug ? console.debug('HashHelper 开始处理', Object.assign({}, file)) : !1;

            /**
             * 整体进度
             */
            let progress: IProgress = { preLoaded: 0, loaded: 0, total: file.size * 2 };

            /**
             * 处理进度
             *
             * @param current_progress 当前的进度
             * @param last_progress 上次的进度
             */
            const handlerProgress = (current_progress: IProgress, last_progress: IProgress) => {
                progress.preLoaded += (current_progress.preLoaded - last_progress.preLoaded);
                progress.loaded += (current_progress.loaded - last_progress.loaded);

                last_progress.preLoaded = current_progress.preLoaded;
                last_progress.loaded = current_progress.loaded;

                onProgress(progress);
            }

            /**
             * 计算整个文件的md5值
             */
            const calcFile = async () => {
                /**
                 * 上次的进度
                 */
                let last_progress: IProgress = { preLoaded: 0, loaded: 0, total: file.size };

                try {
                    file.md5 = await this.checkFile(
                        file,
                        0,
                        (current_progress: IProgress) => {
                            handlerProgress(current_progress, last_progress);
                        }) ?? null;
                } catch (e) {
                    reject(e);
                }
            }

            /**
             * 校验结束
             */
            const done = () => {
                this.finished = true;
                this.debug ? console.debug('HashHelper 处理结束', Object.assign({}, file)) : !1;
                resolve();
            }

            await calcFile();

            //无需分片处理则直接结束
            if (!file.needSection) {
                done();
                return;
            }

            /**
             * 计算分片文件
             */
            const calc = async () => {
                if (this.finished)
                    return;

                if (this.chunkHandlerQueue.length === 0) {
                    for (let i = 0; i < this.chunkHandler.length; i++) {
                        if (this.chunkHandler[i]) {
                            return;
                        }
                    }

                    //所有分片全部校验完毕
                    done();
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
                 * 校验下一个分片文件
                 */
                const next = () => {
                    onProgress(progress);

                    //取消上传则直接结束处理
                    if (this.canceled) {
                        this.reset().then(resolve).catch(resolve);
                        return;
                    }

                    this.chunkHandler[handlerIndex!] = false;

                    calc();
                };

                //当前处理中的分片文件
                const chunk = this.chunkHandlerQueue.shift()!;

                //如已校验过了则直接跳过
                if (chunk.checked) {
                    progress.preLoaded += chunk.size;
                    progress.loaded += chunk.size;
                    onProgress(progress);
                    next();
                    return;
                }

                /**
                 * 上次的进度
                 */
                let last_progress: IProgress = { preLoaded: 0, loaded: 0, total: chunk.size };

                onProgress(progress);

                //校验分片文件
                chunk.md5 = await this.checkFile(
                    chunk,
                    handlerIndex,
                    (current_progress: IProgress) => {
                        handlerProgress(current_progress, last_progress);
                    }) ?? null;

                next();
            }

            /**
             * 添加至队列
             */
            const push = (chunk: ChunkFile) => {
                this.chunkHandlerQueue.push(chunk);
                calc();
            }

            //校验所有分片文件
            for (const chunk of file.chunks) {
                push(chunk);
            }
        });
    }

    /**
     * 取消
     */
    public async cancel(this: HashHelper) {
        this.canceled = true;
        if (this.paused) {
            //如果已暂停，则先通知取消执行
            this.paused = false;
            for (const item of this.waitToContinue) {
                item && item(false);
            }
        }
        this.debug ? console.debug('HashHelper 已取消') : !1;
    }

    /**
     * 暂停
     */
    public async pause(this: HashHelper) {
        this.paused = true;
        this.debug ? console.debug('HashHelper 已暂停') : !1;
    }

    /**
     * 恢复
     */
    public async continue(this: HashHelper) {
        this.paused = false;
        for (const item of this.waitToContinue) {
            item && item(true);
        }
        this.debug ? console.debug('HashHelper 已恢复') : !1;
    }

    /**
     * 关闭
     */
    public async close(this: HashHelper) {
        if (this.enableWorker && this.workerSupported) {
            for (let i = 0; i < this.workerUnits.length; i++) {
                await this.closeByIndex(i);
            }
        } else {
            for (let i = 0; i < this.sparkUnits.length; i++) {
                await this.closeByIndex(i);
            }
        }
        this.debug ? console.debug('HashHelper 已关闭') : !1;
    }
}