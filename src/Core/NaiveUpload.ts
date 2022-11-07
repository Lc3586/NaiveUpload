import { reactive, watch } from "vue";
import { IApiService } from "../Core/IApiService";
import { IConfig } from "../Model/IConfig";
import Settings from "../Model/Settings";
import UploadError from "../Extention/UploadError";
import RawFile from "../Model/RawFile";
import SelectedFile from "../Model/SelectedFile";
import SimpleGuid from "../Extention/SimpleGuid";
import { IUserFileInfo } from "../Model/IUserFileInfo";
import { FileType } from "../Model/FileType";
import FileSizeHelper from "../Extention/FileSizeHelper";
import ChunkFile from "../Model/ChunkFile";
import { RunMode } from "../Model/RunMode";
import HashHelper from "../Extention/HashHelper";
import UploadHelper from "../Extention/UploadHelper";
import { IProgress } from "../Model/IProgress";
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
    constructor(settings: Settings, apiService: IApiService) {
        this.settings = this.reactive(settings);
        this.apiService = apiService;
        this.rawFileList = this.reactive([] as RawFile[]);
        this.selectedFileList = this.reactive([] as SelectedFile[]);
        this.selectedFileSortMap = this.reactive(new Map<number, number>());
    }

    /**
     * 用于设置数据对象的双向绑定
     */
    private readonly reactive: any = reactive;

    /**
     * 设置
     */
    private readonly settings: Settings;

    /**
     * 接口服务
     */
    private readonly apiService: IApiService;

    /**
     * 文件上传配置
     */
    private config?: IConfig;

    /**
     * 源文件集合
     */
    private readonly rawFileList: RawFile[];

    /**
     * 选择的文件集合
     */
    private readonly selectedFileList: SelectedFile[];

    /**
     * 选择的文件排序值映射表
     *
     * <p>key：排序值，value：selectedFileList中的索引</p>
     */
    private readonly selectedFileSortMap: Map<number, number>;

    /**
     * 校验文件队列
     * 数据项为this.SelectedFileList的索引
     */
    private checkQueue: number[] = [];

    /**
     * 当前正在校验中的文件数量
     */
    private checkHandlerCount = 0;

    /**
     * 上传文件队列
     * 数据项为this.SelectedFileList的索引
     */
    private uploadQueue: number[] = [];

    /**
     * 暂停文件
     * key：数据项为this.SelectedFileList的索引，value：{step：0：校验步骤、1：上传步骤，helper：实例，continue：是否已恢复}
     */
    private pausedQueue: Map<number, { step: number, helper?: HashHelper | UploadHelper, continue?: boolean }> = new Map<number, { step: number, helper?: HashHelper | UploadHelper, continue?: boolean }>();

    /**
     * 当前正在上传中的文件数量
     */
    private uploadHandlerCount = 0;

    /**
     * 追加文件后返回的文件令牌和selectedFileList索引映射表
     */
    private tokenWithIndex: Map<String, number> = new Map<String, number>();

    /**
     * 布局变更后执行
     *
     * @param layout 布局
     */
    private layoutChanged: ((layout: Layout) => void)[] = [];

    /**
     * 配置变更后执行
     *
     * @param config 配置
     */
    private configChanged: ((config: IConfig) => void)[] = [];

    /**
     * 选择的文件集合变更后执行
     *
     * @param files 当前的文件集合（已排序）
     */
    private selectedFileListChanged: ((files: SelectedFile[]) => void)[] = [];

    /**
     * 提示异常
     *
     * @param error 异常
     */
    private alertError: ((error: Error) => void)[] = [];

    /**
     * 文件校验前执行
     *
     * @param file 文件
     * @returns 是否保留该文件
     */
    private beforeCheck?: (file: File) => Promise<boolean>;

    /**
     * 文件校验结束后执行
     *
     * @param rawFile 文件
     */
    private afterCheck?: (rawFile: RawFile) => Promise<void>;

    /**
     * 文件校验全部校验结束后执行
     *
     * @param rawFileList 文件集合
     */
    private afterCheckAll?: (rawFileList: RawFile[]) => Promise<void>;

    /**
     * 文件上传后执行
     *
     * @param rawFile 文件
     */
    private afterUpload?: (rawFile: RawFile) => Promise<void>;

    /**
     * 所有文件上传后执行
     * <p>此方法将会异步执行</p>
     *
     * @param rawFileList 文件集合
     */
    private afterUploadAll?: (rawFileList: RawFile[]) => Promise<void>;

    /**
     * 发生异常后执行
     * <p>此方法将会异步执行</p>
     *
     * @param error 异常
     */
    private handlerError?: (error: Error) => Promise<void>;

    /**
     * 更新文件上传配置
     */
    private updateConfig(this: NaiveUpload): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.apiService.config(this.settings.configCode).then(config => {
                this.config = this.reactive(config);
                this.settings.debug ? console.debug('配置已变更:', Object.assign({}, this.config)) : !1;
                resolve();
            }).catch(e => {
                reject(new UploadError('更新文件上传配置错误', e));
            });
        });
    }

    /**
     * 监听配置的变化
     */
    private watchSettings(this: NaiveUpload) {
        //文件上传配置变更
        watch(() => this.settings.configCode,
            async (current, last) => {
                if (current != last) {
                    await this.updateConfig();
                    this.configChanged?.forEach(x => x(this.config!));
                }
            });

        //布局变更
        watch(() => this.settings.layout,
            async (current, last) => {
                if (current != last)
                    this.layoutChanged?.forEach(x => x(current));
            });

        //文件变更
        watch(() => this.selectedFileList,
            async (current, last) => {
                this.selectedFileListChanged?.forEach(x => x(this.getSelectedFileList(true)));
            },
            { deep: true });
    }

    /**
     * 追加文件
     *
     * @param file
     */
    private appendFile(this: NaiveUpload, file: File) {
        //将文件推送至处理队列，并生成token
        let push = (file: File, newFile: SelectedFile) => {
            const token = SimpleGuid.new();
            let rawFile = new RawFile(file);
            rawFile.name = newFile.name;
            rawFile.extension = newFile.extension;
            rawFile.configCode = this.config!.code;
            rawFile.token = token;
            this.rawFileList.push(rawFile);

            newFile.rawIndex = this.rawFileList.length - 1;
            newFile.token = token;

            this.tokenWithIndex.set(token, this.selectedFileList.length);

            this.selectedFileList.push(newFile);

            this.selectedFileSortMap.set(this.selectedFileSortMap.size + 1, this.selectedFileList.length - 1);

            this.handleFile(this.selectedFileList.length - 1);

            this.settings.debug ? console.debug('已添加文件', Object.assign({}, rawFile)) : !1;
        };

        //是否已为重复的文件
        if (this.selectedFileList.filter(x =>
            !x.canceled
            && this.rawFileList[x.rawIndex!].file!.name == file.name)
            .length > 0) {
            this.settings.debug ? console.debug('重复的文件', file) : !1;
            return;
        }

        //判断文件数量是否已超过限制
        if (this.limited()) {
            this.throwError(new UploadError(`当前只允许上传${this.getConfig().upperLimit}个文件`));
            return;
        }

        //获取文件后缀名
        const extension = file.name.substring(file.name.lastIndexOf('.'));

        //判断文件类型是否合法
        if (this.config!.allowedTypeList.length !== 0) {
            let flag = false;
            for (const type of this.config!.allowedTypeList) {
                if (type != null && type.length > 0 && ((type[0] === '.' && type.toLowerCase() === extension.toLowerCase()) || new RegExp(type.replace('/*', '//*'), 'gi').test(file.type))) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                console.warn(extension, file.type);
                this.throwError(new UploadError('文件类型不合法'));
                return;
            }
        }

        if (this.config!.prohibitedTypeList.length !== 0) {
            for (const type of this.config!.prohibitedTypeList) {
                if (type != null && type.length > 0 && ((type[0] === '.' && type.toLowerCase() === extension.toLowerCase()) || new RegExp(type.replace('/*', '//*'), 'gi').test(file.type))) {
                    console.warn(type, extension, file.type);
                    this.throwError(new UploadError('文件类型不合法'));
                    return;
                }
            }
        }

        //判断文件大小是否合法
        if (this.config!.lowerSingleSize && this.config!.lowerSingleSize > file.size) {
            this.throwError(new UploadError(`文件不可小于${FileSizeHelper.getSize(this.config!.lowerSingleSize)}`));
            return;
        }

        if (this.config!.upperSingleSize && this.config!.upperSingleSize < file.size) {
            this.throwError(new UploadError(`文件不可大于${FileSizeHelper.getSize(this.config!.upperSingleSize)}`));
            return;
        }

        if (this.config!.upperTotalSize && this.config!.upperTotalSize < this.totalSize() + file.size) {
            this.throwError(new UploadError(`所有文件的总大小不可大于${FileSizeHelper.getSize(this.config!.upperTotalSize)}`));
            return;
        }

        let selectedFile = new SelectedFile(file);

        //触发文件校验前执行的回调事件
        if (this.beforeCheck) {
            const before = this.beforeCheck(file);
            if (before && before.then) {
                before.then(flag => {
                    if (flag)
                        push(file, selectedFile);
                });
            }
        } else
            push(file, selectedFile);
    }

    /**
     * 追加以前上传过的文件
     *
     * @param id
     */
    private appendUploadedFile(this: NaiveUpload, id: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let userFileInfo: IUserFileInfo;

            try {
                userFileInfo = await this.apiService.getUserFile(id);

                const token = SimpleGuid.new();
                let rawFile = new RawFile(null);
                rawFile.size = parseInt(userFileInfo.bytes);
                rawFile.name = userFileInfo.name;
                rawFile.extension = userFileInfo.extension;
                rawFile.configCode = this.config!.code;
                rawFile.echo = true;
                rawFile.token = token;
                this.rawFileList.push(rawFile);

                let file = <File>{ name: `${userFileInfo.name}${userFileInfo.extension}` };
                let selectedFile = new SelectedFile(file);
                selectedFile.rawIndex = this.rawFileList.length - 1;
                selectedFile.uploaded = true;
                selectedFile.done = true;
                selectedFile.canceled = false;
                selectedFile.rawIndex = -1;
                selectedFile.thumbnail = this.apiService.getUserFilePreviewUrl(userFileInfo.id, 100, 100);
                selectedFile.fileType = userFileInfo.fileType;
                selectedFile.size = userFileInfo.size;
                selectedFile.token = token;

                this.tokenWithIndex.set(token, this.selectedFileList.length);

                this.selectedFileList.push(selectedFile);

                this.selectedFileSortMap.set(this.selectedFileSortMap.size + 1, this.selectedFileList.length - 1);

                this.settings.debug ? console.debug('已添加历史文件', id, Object.assign({}, rawFile)) : !1;

                resolve();
            } catch (e: any) {
                reject(new UploadError('获取用户文件信息失败', e));
            }
        });
    }

    /**
     * 获取文件类型
     *
     * @param selectedFile
     */
    private getFileType(this: NaiveUpload, selectedFile: SelectedFile): Promise<void> {
        return new Promise<void>(async (resolve) => {
            let file: RawFile;
            if (selectedFile.rawIndex == -1) {
                file = <RawFile>{
                    file: <File><unknown>{ type: null }
                };
            } else
                file = this.getRawFile(selectedFile);

            try {
                selectedFile.fileType = file.file!.type === null
                    || file.file!.type === ''
                    || file.file!.type === 'application/octet-stream'
                    ? await this.apiService.getFileTypeByExtension(selectedFile.extensionLower)
                    : await this.apiService.getFileTypeByMIME(file.file!.type);
            } catch (e) {
                selectedFile.fileType = FileType.未知;
            }

            resolve();
        });
    }

    /**
     * 检查图像
     *
     * @param {any} selectedFile
     */
    private checkImage(this: NaiveUpload, selectedFile: SelectedFile) {
        if (selectedFile.fileType === FileType.未知) {
            selectedFile.thumbnail = this.apiService.getUnknowFileTypeImageUrl();
            return;
        }

        if (selectedFile.fileType !== FileType.图片)
            return;

        const objectURL = this.getRawFile(selectedFile).objectURL;
        if (objectURL)
            selectedFile.thumbnail = objectURL;
    }

    /**
     * 获取原始文件
     *
     * @param selectedFile
     */
    getRawFile(this: NaiveUpload, selectedFile: SelectedFile) {
        return this.rawFileList[selectedFile.rawIndex!];
    }

    /**
     * 文件切片
     *
     * @param selectedFile
     */
    private getChunks(this: NaiveUpload, selectedFile: SelectedFile) {
        let file = this.getRawFile(selectedFile);
        if (file.size > this.settings.chunkSize) {
            file.needSection = true;
            file.specs = this.settings.chunkSize;
        } else
            return;

        let count = 0;
        while (count < file.size) {
            //切片索引添加至队列
            file.chunkIndexQueue.push(file.chunks.length);

            file.chunks.push(new ChunkFile(file.chunks.length, file.file!.slice(count, count + this.settings.chunkSize)));

            count += this.settings.chunkSize;
        }

        this.settings.debug ? console.debug('文件已切片处理', Object.assign({}, file)) : !1;
    }

    /**
     * 处理文件
     *
     * @param selectedFileIndex 索引
     */
    private handleFile(this: NaiveUpload, selectedFileIndex: number) {
        const selectedFile = this.selectedFileList[selectedFileIndex];

        //获取文件类型对应的预览图地址
        selectedFile.thumbnail = this.apiService.getFileTypeImageUrl(selectedFile.extensionLower);

        //获取文件类型并更新预览地址为图片的预览地址
        this.getFileType(selectedFile).then(() => {
            this.checkImage(selectedFile);
        });

        //获取文件大小的描述信息
        selectedFile.size = FileSizeHelper.getSize(this.getRawFile(selectedFile).size);

        //如果启用分片上传，则先将文件进行切片处理
        if (this.settings.enableChunk)
            this.getChunks(selectedFile);

        //推送至md5校验队列
        this.pushToCheckQueue(selectedFileIndex);
    }

    /**
     * 推送至校验队列
     *
     * @param selectedFileIndex
     */
    private pushToCheckQueue(this: NaiveUpload, selectedFileIndex: number) {
        this.checkQueue.push(selectedFileIndex);

        if (this.settings.runMode === RunMode.全自动
            || this.settings.runMode === RunMode.半自动)
            this.checkMD5();
    }

    /**
     * 推送至上传队列
     *
     * @param selectedFileIndex
     */
    private pushToUploadQueue(this: NaiveUpload, selectedFileIndex: number) {
        this.uploadQueue.push(selectedFileIndex);

        if (this.settings.runMode == RunMode.全自动)
            this.upload();
    }

    /**
     * 开始校验MD5
     */
    private async checkMD5(this: NaiveUpload) {
        if (this.checkHandlerCount >= this.settings.concurrentFile || this.checkQueue.length === 0) {
            this.checkQueue.length != 0 && this.settings.debug ? console.debug(`NaiveUpload 文件校验 已达到最大并发数：${this.settings.concurrentFile}，当前队列长度：${this.checkQueue.length}`) : !1;

            //当前正在校验中的文件已达上限或全部文件都已校验结束，此方法将会直接结束
            if (this.checkHandlerCount == 0 && this.checkQueue.length === 0 && this.afterCheckAll) {
                //触发文件校验全部校验结束后执行的回调事件
                if (this.afterCheckAll)
                    await this.afterCheckAll(this.rawFileList);
            }
            return;
        }

        this.checkHandlerCount++;

        /**
         * 校验下一个文件
         */
        const next = () => {
            this.checkHandlerCount--;

            if (this.afterCheck) {
                //触发单个文件校验结束后执行的回调事件
                const after = this.afterCheck(rawFile);
                if (after && after.then) {
                    after.then(() => {
                        this.checkMD5();
                    });
                    return;
                }
            }

            this.settings.debug ? console.debug('校验下一个文件') : !1;

            this.checkMD5();
        };

        /**
         * 暂停
         *
         * @param helper 实例
         */
        const pause = (helper?: HashHelper) => {
            if (this.pausedQueue.has(selectedFileIndex!))
                this.pausedQueue.get(selectedFileIndex!)!.continue = false;
            else
                this.pausedQueue.set(selectedFileIndex!, { step: 0, helper: helper });
            helper && helper.pause();

            helper && this.settings.debug ? console.debug('HashHelper Instance 已暂停', Object.assign({}, hashHelper)) : !1;

            //保存暂停前的进度
            selectedFile.virtualPercentBeforPaused = selectedFile.virtualPercent;
            selectedFile.percentBeforPaused = selectedFile.percent;

            this.settings.debug ? console.debug('暂停校验文件', Object.assign({}, rawFile)) : !1;

            next();
        }

        /**
         * 恢复
         *
         * @param helper 实例
         */
        const continue_ = async (helper: HashHelper) => {
            await helper.continue();

            this.settings.debug ? console.debug('HashHelper Instance 已恢复', Object.assign({}, hashHelper)) : !1;

            this.settings.debug ? console.debug('恢复校验文件', Object.assign({}, rawFile)) : !1;
        }

        /**
         * 取消
         */
        const cancel = (helper?: HashHelper) => {
            helper && helper.cancel();

            helper && this.settings.debug ? console.debug('HashHelper Instance 已取消', Object.assign({}, hashHelper)) : !1;

            this.settings.debug ? console.debug('取消校验文件', Object.assign({}, rawFile)) : !1;

            next();
        }

        //获取并移除列首的文件索引
        const selectedFileIndex = this.checkQueue.shift();
        const selectedFile = this.selectedFileList[selectedFileIndex!];
        const rawFile = this.getRawFile(selectedFile);

        //如果文件已被删除则直接处理下一个
        if (selectedFile.canceled) {
            cancel();
            return;
        }

        //如果文件已被暂停则取消校验并推送至暂停队列
        if (selectedFile.paused) {
            pause();
            next();
            return;
        }

        selectedFile.checking = true;

        //获取md5校验帮助类实例
        let hashHelper: HashHelper | null = null;
        if (this.pausedQueue.has(selectedFileIndex!)) {
            //获取暂停前的实例
            hashHelper = this.pausedQueue.get(selectedFileIndex!)!.helper as HashHelper;
            //从暂停集合中删除
            this.pausedQueue.delete(selectedFileIndex!);

            if (hashHelper) {
                this.settings.debug ? console.debug('HashHelper Instance 已获取（暂停前的实例）', Object.assign({}, hashHelper)) : !1;

                //恢复
                await continue_(hashHelper);

                return;
            }
        }

        if (hashHelper == null) {
            hashHelper = await HashHelper.getInstance(this.settings.concurrentChunkFile, this.settings.enableWorker, this.settings.debug);
            this.settings.debug ? console.debug('HashHelper Instance 已创建', Object.assign({}, hashHelper)) : !1;
        }

        /**
         * 关闭
         */
        const close = () => {
            hashHelper!.close();

            this.settings.debug ? console.debug('HashHelper Instance 已关闭', Object.assign({}, hashHelper)) : !1;
        }

        try {
            this.settings.debug ? console.debug('开始校验文件', Object.assign({}, rawFile)) : !1;

            await hashHelper.handler(rawFile, (progress: IProgress) => {
                NaiveUpload.calcPercent(selectedFile, progress);

                //如果文件已被删除则取消校验
                if (selectedFile.canceled)
                    cancel();

                //如果文件已被暂停则挂起校验操作并推送至暂停队列等待恢复通知
                if (selectedFile.paused) {
                    pause(hashHelper!);
                }
            });

            if (selectedFile.canceled)
                return;

            selectedFile.virtualPercent = 100;
            selectedFile.percent = 100;
            selectedFile.checking = false;
            selectedFile.checked = true;

            this.settings.debug ? console.debug('文件校验结束', Object.assign({}, rawFile)) : !1;

            //推送至上传队列
            this.pushToUploadQueue(selectedFileIndex!);
        } catch (e: any) {
            const error = new UploadError('文件校验失败.', e);
            this.checkError(selectedFileIndex!, `${error.message} ${e.message}`, true, error);
        }

        close();

        next();
    }

    /**
     * 开始上传已经校验过了的文件
     */
    private async upload(this: NaiveUpload) {
        if (this.config!.lowerTotalSize && this.config!.lowerTotalSize > this.totalSize()) {
            this.throwError(new UploadError(`所有文件的总大小不可小于${FileSizeHelper.getSize(this.config!.lowerTotalSize)}`));
            return;
        }

        //如果当前正在上传中的文件已达上限，则此方法将会直接结束
        if (this.uploadHandlerCount >= this.settings.concurrentFile) {
            this.settings.debug ? console.debug(`NaiveUpload 文件上传 已达到最大并发数：${this.settings.concurrentFile}，当前队列长度：${this.uploadQueue.length}`) : !1;
            return;
        }

        if (this.uploadQueue.length === 0) {
            //触发文件上传全部结束后执行的回调事件
            if (this.checkHandlerCount === 0 && this.uploadHandlerCount === 0 && this.afterUploadAll)
                this.afterUploadAll(this.getRawFileList(true));
            return;
        }

        this.uploadHandlerCount++;

        /**
         * 上传下一个文件
         */
        const next = () => {
            this.uploadHandlerCount--;

            if (this.afterUpload) {
                //触发单个文件上传结束后执行的回调事件
                const after = this.afterUpload(rawFile);
                if (after && after.then) {
                    after.then(() => {
                        this.upload();
                        return;
                    });
                }
            }

            this.settings.debug ? console.debug('上传下一个文件') : !1;

            this.upload();
        };

        /**
         * 暂停
         *
         * @param helper 实例
         */
        const pause = (helper?: UploadHelper) => {
            if (this.pausedQueue.has(selectedFileIndex!))
                this.pausedQueue.get(selectedFileIndex!)!.continue = false;
            else
                this.pausedQueue.set(selectedFileIndex!, { step: 1, helper: helper });

            helper && helper.pause();

            helper && this.settings.debug ? console.debug('UploadHelper Instance 已暂停', Object.assign({}, uploadHelper)) : !1;

            //保存暂停前的进度
            selectedFile.virtualPercentBeforPaused = selectedFile.virtualPercent;
            selectedFile.percentBeforPaused = selectedFile.percent;

            this.settings.debug ? console.debug('暂停上传文件', Object.assign({}, rawFile)) : !1;

            next();
        }

        /**
         * 恢复
         *
         * @param helper 实例
         */
        const continue_ = async (helper: UploadHelper) => {
            await helper.continue();

            this.settings.debug ? console.debug('UploadHelper Instance 已恢复', Object.assign({}, uploadHelper)) : !1;

            this.settings.debug ? console.debug('恢复上传文件', Object.assign({}, rawFile)) : !1;
        }

        /**
         * 取消
         */
        const cancel = (helper?: UploadHelper) => {
            helper && helper.cancel();

            helper && this.settings.debug ? console.debug('UploadHelper Instance 已取消', Object.assign({}, uploadHelper)) : !1;

            this.settings.debug ? console.debug('取消上传文件', Object.assign({}, rawFile)) : !1;

            next();
        }

        //获取并移除列首的文件索引
        const selectedFileIndex = this.uploadQueue.shift();
        const selectedFile = this.selectedFileList[selectedFileIndex!];
        const rawFile = this.getRawFile(selectedFile);

        //如果文件已被删除则直接处理下一个
        if (selectedFile.canceled) {
            cancel();
            return;
        }

        //如果文件已被暂停则取消校验并推送至暂停队列
        if (selectedFile.paused) {
            pause();
            return;
        }

        selectedFile.uploading = true;
        selectedFile.virtualPercent = 0;
        selectedFile.percent = 0;

        //获取文件上传帮助类实例
        let uploadHelper: UploadHelper | null = null;
        if (this.pausedQueue.has(selectedFileIndex!)) {
            //获取暂停前的实例
            uploadHelper = this.pausedQueue.get(selectedFileIndex!)!.helper as UploadHelper;
            //从暂停集合中删除
            this.pausedQueue.delete(selectedFileIndex!);

            if (uploadHelper) {
                this.settings.debug ? console.debug('UploadHelper Instance 已获取（暂停前的实例）', Object.assign({}, uploadHelper)) : !1;

                //恢复
                await continue_(uploadHelper);

                return;
            }
        }

        if (uploadHelper == null) {
            uploadHelper = await UploadHelper.getInstance(this.settings.concurrentChunkFile, this.settings.enableWorker, this.apiService, this.settings.debug);
            this.settings.debug ? console.debug('UploadHelper Instance 已创建', Object.assign({}, uploadHelper)) : !1;
        }

        /**
         * 关闭
         */
        const close = () => {
            uploadHelper!.close();

            this.settings.debug ? console.debug('UploadHelper Instance 已关闭', Object.assign({}, uploadHelper)) : !1;
        }

        try {
            this.settings.debug ? console.debug('开始上传文件', Object.assign({}, rawFile)) : !1;

            await uploadHelper.handler(rawFile, (progress: IProgress) => {
                NaiveUpload.calcPercent(selectedFile, progress);

                //如果文件已被删除则取消上传
                if (selectedFile.canceled)
                    cancel();

                //如果文件已被暂停则挂起上传操作并推送至暂停队列等待恢复通知
                if (selectedFile.paused && this.rawFileList[selectedFile.rawIndex!].needSection) {
                    pause(uploadHelper!);
                }
            });

            if (selectedFile.canceled)
                return;

            selectedFile.name = rawFile.userFileInfo!.name;
            selectedFile.extension = rawFile.userFileInfo!.extension;
            selectedFile.extensionLower = rawFile.userFileInfo!.extension?.toLowerCase();
            selectedFile.size = rawFile.userFileInfo!.size;
            selectedFile.fileType = rawFile.userFileInfo!.fileType;
            selectedFile.virtualPercent = 100;
            selectedFile.percent = 100;
            selectedFile.uploading = false;
            selectedFile.uploaded = true;
            selectedFile.done = true;

            this.settings.debug ? console.debug('文件上传结束', Object.assign({}, rawFile)) : !1;

            this.checkImage(selectedFile);
        } catch (e: any) {
            const error = new UploadError('文件上传失败.', e);
            this.uploadError(selectedFileIndex!, `${error.message} ${e.message}`, true, error);
        }

        close();

        next();
    }

    /**
     * 计算进度
     *
     * @param selectedFile 文件
     * @param progress 进度
     */
    private static calcPercent(selectedFile: SelectedFile, progress: IProgress) {
        const virtualPercent = parseFloat((progress.preLoaded / progress.total * 100).toFixed(2));
        const percent = parseFloat((progress.loaded / progress.total * 100).toFixed(2));
        if (selectedFile.virtualPercentBeforPaused < virtualPercent)
            selectedFile.virtualPercent = virtualPercent;
        if (selectedFile.percentBeforPaused < percent)
            selectedFile.percent = percent;
    }

    /**
     * 抛出异常
     *
     * @param error
     */
    private throwError(this: NaiveUpload, error: Error) {
        this.settings.debug ? console.debug('发生异常', error) : !1;
        this.alertError.forEach(x => x(error));
        if (this.handlerError)
            this.handlerError(error);
    }

    /**
     * 异常
     *
     * @param selectedFileIndex
     * @param message 异常信息
     * @param retry 是否允许重试
     * @param done 回调
     */
    private error(this: NaiveUpload,
        selectedFileIndex: number,
        message: string,
        retry: boolean,
        done: (selectedFileIndex: number) => void | null) {
        const selectedFile = this.selectedFileList[selectedFileIndex];

        if (!retry || selectedFile.reTry - 1 >= this.settings.retry) {
            selectedFile.error = true;
            selectedFile.errorMessage = message;
            return;
        }

        //等待重试
        selectedFile.reTry++;

        setTimeout(() => {
            done && done(selectedFileIndex);
        }, 1500);
    }

    /**
     * 校验时异常
     *
     * @param selectedFileIndex
     * @param message 说明
     * @param retry 是否允许重试
     * @param e 异常
     */
    private checkError(this: NaiveUpload,
        selectedFileIndex: number,
        message: string,
        retry: boolean,
        e?: Error) {
        e && UploadError.consoleWrite(e);

        const selectedFile = this.selectedFileList[selectedFileIndex];
        selectedFile.checking = false;
        selectedFile.uploading = false;
        this.error(selectedFileIndex, message, retry, (_selectedFileIndex) => {
            this.pushToCheckQueue(_selectedFileIndex);
        });
    }

    /**
     * 上传时异常
     *
     * @param selectedFileIndex
     * @param message 说明
     * @param retry 是否允许重试
     * @param e 异常
     */
    private uploadError(this: NaiveUpload,
        selectedFileIndex: number,
        message: string,
        retry: boolean,
        e?: Error) {
        e && UploadError.consoleWrite(e);

        const selectedFile = this.selectedFileList[selectedFileIndex];
        selectedFile.uploading = false;
        this.error(selectedFileIndex, message, retry, (_selectedFileIndex) => {
            this.pushToUploadQueue(_selectedFileIndex);
        });
    }

    /**
     * 文件重命名
     *
     * @param selectedFile
     * @param rename 文件重命名
     */
    private async renameByIndex(this: NaiveUpload,
        selectedFile: SelectedFile,
        rename: string): Promise<void> {
        return new Promise<void>((resolve) => {
            let rawFile = this.getRawFile(selectedFile);

            const done = (success: boolean) => {
                if (success) {
                    selectedFile.name = rename;
                    rawFile.name = selectedFile.name;
                    if (selectedFile.uploaded)
                        rawFile.userFileInfo!.name = selectedFile.name;
                }

                resolve();
            }

            if (selectedFile.uploaded) {
                this.apiService.rename(rawFile.userFileInfo!.id, rename).then(() => {
                    done(true);
                }).catch(e => {
                    this.handlerError && this.handlerError(new UploadError(`文件重命名失败：${e.message}`, e));
                    done(false);
                });
            } else
                done(true);
        });
    }

    /**
     * 恢复处理
     *
     * @param index
     */
    private continueByIndex(this: NaiveUpload, index: number) {
        //取消暂停状态
        this.selectedFileList[index].paused = false;

        if (!this.pausedQueue.has(index) || this.pausedQueue.get(index)!.continue)
            return;

        //判断文件暂停时正处于哪一步，并重新添加至队列
        const data = this.pausedQueue.get(index)!;
        switch (data.step) {
            case 0:
                this.checkQueue.push(index);
                break;
            case 1:
                this.uploadQueue.push(index);
                break;
            default:
                return;
        }

        //已恢复
        data.continue = true;
    }

    /**
     * 获取实例
     *
     * @param settings 设置
     * @param apiService 接口服务
     */
    public static async getInstance(settings: Settings, apiService: IApiService): Promise<NaiveUpload> {
        return new Promise<NaiveUpload>(async (resolve, reject) => {
            try {
                let upload = new NaiveUpload(settings, apiService);
                upload.watchSettings();
                await upload.updateConfig();
                resolve(upload);
            } catch (e: any) {
                reject(new UploadError('获取上传工具实例时发生异常', e));
            }
        });
    }

    /**
     * 获取设置
     */
    public getSettings(this: NaiveUpload): Settings {
        return this.settings;
    }

    /**
     * 获取文件上传配置
     */
    public getConfig(this: NaiveUpload): IConfig {
        return this.config!;
    }

    /**
     * 校验队列中的文件
     */
    public checkNow(this: NaiveUpload): void {
        this.checkMD5();
    }

    /**
     * 上传队列中的文件
     */
    public uploadNow(this: NaiveUpload): void {
        this.upload();
    }

    /**
     * 暂停
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时暂停全部
     */
    public pause(this: NaiveUpload, token?: string): void {
        if (token) {
            const index = this.tokenWithIndex.get(token)!;
            if (index == -1)
                return;

            if (!this.selectedFileList[index].done)
                this.selectedFileList[index].paused = true;
        } else
            for (let file of this.selectedFileList) {
                if (!file.done)
                    file.paused = true;
            }
    }

    /**
     * 恢复
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时恢复全部
     */
    public continue(this: NaiveUpload, token?: string): void {
        if (token) {
            const index = this.tokenWithIndex.get(token)!;
            if (index == -1)
                return;

            this.continueByIndex(index);
        } else {
            for (let index = 0; index < this.selectedFileList.length; index++) {
                this.continueByIndex(index);
            }
        }

        //开始处理
        this.checkNow();
        this.uploadNow();
    }

    /**
     * 删除
     *
     * @param token 追加文件后返回的文件令牌
     */
    public remove(this: NaiveUpload, token: string) {
        const index = this.tokenWithIndex.get(token)!;
        if (index == -1)
            return;
        this.selectedFileList[index].canceled = true;
    }

    /**
     * 清空
     */
    public clean(this: NaiveUpload) {
        for (let file of this.selectedFileList) {
            file.canceled = true;
        }
    }

    /**
     * 重置
     */
    public reset(this: NaiveUpload) {
        this.checkQueue.length = 0;
        this.uploadQueue.length = 0;
        this.rawFileList.length = 0;
        this.selectedFileList.length = 0;
        this.tokenWithIndex.clear();
    }

    /**
     * 获取开发的接口
     */
    public getOpenApi(this: NaiveUpload): IOpenApi {
        return {
            startCheck: () => {
                this.checkNow();
            },

            startUpload: () => {
                this.uploadNow();
            },

            pause: (token?: string) => {
                this.pause(token);
            },

            continue: (token?: string) => {
                this.continue(token);
            },

            remove: (token: string) => {
                this.remove(token);
            },

            clean: () => {
                this.clean();
            },

            finished: (): boolean => {
                return this.checkQueue.length === 0 && this.uploadQueue.length === 0 && this.pausedQueue.size === 0;
            },

            getUserFileInfoList: (): IUserFileInfo[] => {
                return this.getUserFileInfoList(true);
            }
        } as IOpenApi;
    }

    /**
     * 文件重命名
     *
     * @param token  追加文件后返回的文件令牌
     * @param rename 文件重命名
     */
    public async rename(this: NaiveUpload,
        token: string,
        rename: string): Promise<void> {
        const index = this.tokenWithIndex.get(token)!;
        if (index == -1)
            throw new UploadError('文件已被移除');

        let selectedFile = this.selectedFileList[index];

        return this.renameByIndex(selectedFile, rename);
    }

    /**
     * 获取下载地址
     *
     * @param selectedFile 选择的文件
     * @return 下载地址
     */
    public getDownloadUrl(this: NaiveUpload, selectedFile: SelectedFile): string | null {
        const rawFile = this.rawFileList[selectedFile.rawIndex!];
        return rawFile.file ? rawFile.objectURL ?? null : this.apiService.getDownloadUrl(rawFile.userFileInfo!.id, selectedFile.name);
    }

    /**
     * 选择的文件列表是否有有效的数据
     */
    public anyFile(this: NaiveUpload): boolean {
        return this.selectedFileList.filter(data => !data.canceled).length !== 0;
    }

    /**
     * 获取选择文件时要显示的警告信息
     */
    public getSelectFileAlarmInfo(this: NaiveUpload): string {
        if (!this.config!.upperLimit)
            return '';

        return this.selectedFileList.length < this.config!.upperLimit ? `还可添加个${this.config!.upperLimit - this.selectedFileList.length}文件` : `文件数量已达上限`;
    }

    /**
     * 获取文件选择框类名
     */
    public getSelectCLass(this: NaiveUpload): string {
        return this.limited() ? 'item-limited' : '';
    }

    /**
     * 获取全部允许的类型
     */
    public getAllowedTypes(this: NaiveUpload): string {
        return this.config!.allowedTypeList.join(', ');
    }

    /**
     * 是否已达上限
     *
     * @return true: 已达上限
     */
    public limited(this: NaiveUpload): boolean {
        return !!this.config!.upperLimit && this.selectedFileList.filter(data => !data.canceled).length >= this.config!.upperLimit;
    }

    /**
     * 当前文件总大小
     *
     * @return size: 字节数
     */
    public totalSize(this: NaiveUpload): number {
        let size = 0;
        for (const selectedFile of this.selectedFileList) {
            if (!selectedFile.canceled)
                size += this.rawFileList[selectedFile.rawIndex!].size;
        }
        return size;
    }

    /**
     * 追加文件
     *
     * @param file 文件
     */
    public append(this: NaiveUpload, file: File) {
        this.appendFile(file);
    }

    /**
     * 追加以前上传过的文件
     *
     * @param id 标识
     */
    public async appendById(this: NaiveUpload, id: string): Promise<void> {
        return this.appendUploadedFile(id);
    }

    /**
     * 更改排序值
     *
     * @param currentIndex 当前排序值
     * @param targetIndex 目标排序值
     */
    public changeSort(this: NaiveUpload, currentIndex: number, targetIndex: number) {
        if (currentIndex == targetIndex)
            return;

        const current = this.selectedFileSortMap.get(currentIndex)!;

        if (currentIndex > targetIndex) {
            for (let i = currentIndex; i > targetIndex; i--) {
                setInterval(() => {

                }, 100);
                this.selectedFileSortMap.set(i, this.selectedFileSortMap.get(i - 1)!);
            }
        } else {
            for (let i = currentIndex; i < targetIndex; i++) {
                this.selectedFileSortMap.set(i, this.selectedFileSortMap.get(i + 1)!);
            }
        }

        this.selectedFileSortMap.set(targetIndex, current);
    }

    /**
     * 注册布局变更后执行的函数
     *
     * @param even
     */
    public registerLayoutChanged(this: NaiveUpload, even: (layout: Layout) => void) {
        this.layoutChanged.push(even);
    }

    /**
     * 注册配置变更后执行的函数
     *
     * @param even
     */
    public registerConfigChanged(this: NaiveUpload, even: (config: IConfig) => void) {
        this.configChanged.push(even);
    }

    /**
     * 注册选择的文件集合变更后执行的函数
     *
     * @param even
     */
    public registerSelectedFileListChanged(this: NaiveUpload, even: (files: SelectedFile[]) => void) {
        this.selectedFileListChanged.push(even);
    }

    /**
     * 注册提示异常的函数
     *
     * @param even
     */
    public registerAlertError(this: NaiveUpload, even: (error: Error) => void) {
        this.alertError.push(even);
    }

    /**
     * 设置文件校验前执行的函数
     *
     * @param even
     */
    public setupBeforeCheck(this: NaiveUpload, even: (file: File) => Promise<boolean>) {
        this.beforeCheck = even;
    }

    /**
     * 设置文件校验结束后执行的函数
     *
     * @param even
     */
    public setupAfterCheck(this: NaiveUpload, even: (rawFile: RawFile) => Promise<void>) {
        this.afterCheck = even;
    }

    /**
     * 设置文件校验全部校验结束后执行的函数
     *
     * @param even
     */
    public setupAfterCheckAll(this: NaiveUpload, even: (rawFileList: RawFile[]) => Promise<void>) {
        this.afterCheckAll = even;
    }

    /**
     * 设置文件上传后执行的函数
     *
     * @param even
     */
    public setupAfterUpload(this: NaiveUpload, even: (rawFile: RawFile) => Promise<void>) {
        this.afterUpload = even;
    }

    /**
     * 设置所有文件上传后执行的函数
     *
     * @param even
     */
    public setupAfterUploadAll(this: NaiveUpload, even: (rawFileList: RawFile[]) => Promise<void>) {
        this.afterUploadAll = even;
    }

    /**
     * 设置发生异常后执行的函数
     *
     * @param even
     */
    public setupHandlerError(this: NaiveUpload, even: (error: Error) => Promise<void>) {
        this.handlerError = even;
    }

    /**
     * 获取当前选择的文件数量
     */
    public getSelectedFileCount(this: NaiveUpload): number {
        return this.selectedFileList.filter(x => !x.canceled).length;
    }

    /**
     * 获取当前选择的文件排序值映射表
     */
    public getSelectedFileSortMap(this: NaiveUpload): Map<number, number> {
        return this.selectedFileSortMap;
    }

    /**
     * 获取当前所有选择的文件集合
     *
     * @param sort 是否需要排序
     */
    public getSelectedFileList(this: NaiveUpload, sort: boolean): SelectedFile[] {
        if (!sort)
            return this.selectedFileList.filter(x => !x.canceled);

        const result = [] as SelectedFile[];
        for (let i = 1; i <= this.selectedFileSortMap.size; i++) {
            const selectedFile = this.selectedFileList[this.selectedFileSortMap.get(i)!];

            if (!selectedFile.canceled)
                result.push(selectedFile);
        }
        return result;
    }

    /**
     * 获取当前所有文件集合
     *
     * @param sort 是否需要排序
     */
    public getRawFileList(this: NaiveUpload, sort: boolean): RawFile[] {
        return this.getSelectedFileList(sort).map(x => this.rawFileList[x.rawIndex!]);
    }

    /**
     * 获取当前所有的用户文件信息集合
     *
     * @param sort 是否需要排序
     */
    public getUserFileInfoList(this: NaiveUpload, sort: boolean): IUserFileInfo[] {
        return this.getRawFileList(sort).filter(item => item.userFileInfo).map(item => item.userFileInfo!);
    }

    /**
     * 获取选择的文件
     *
     * @param sortKey 排序值
     */
    public getSelectedFile(this: NaiveUpload, sortKey: number): SelectedFile {
        return this.selectedFileList[this.selectedFileSortMap.get(sortKey)!];
    }

    /**
     * 获取渐变色样式
     * @param {string} type 类型 conic锥形渐变,linear线性渐变
     * @param {string} color 颜色
     * @param {number} value1 值1
     * @param {number} value2 值2
     */
    public getGradientStyle(type: string, color: string, value1: number, value2: number): string {
        switch (type) {
            default:
            case 'conic':
                return `
background: conic-gradient(${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -moz-conic-gradient(${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -o-conic-gradient(${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -webkit-conic-gradient(${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;`;
            case 'linear':
                return `
background: linear-gradient(left, ${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -moz-linear-gradient(left, ${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -o-linear-gradient(left, ${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;
background: -webkit-linear-gradient(left, ${color} ${value1}%, transparent ${value2}%)  repeat scroll 0% 0%;`;
        }
    }
}
