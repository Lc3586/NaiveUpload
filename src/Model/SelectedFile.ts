import { FileType } from "../Model/FileType";
import FileTypeHelper from "../Extention/FileTypeHelper";

/**
 * 选定的文件
 *
 * @author LCTR
 * @date 2022-06-24
 */
export default class SelectedFile {
    /**
     *
     * @param file 文件
     */
    constructor(file: File) {
        const pointIndex = file.name.lastIndexOf('.');
        this.name = file.name.substring(0, pointIndex);
        this.extension = file.name.substring(pointIndex);
        this.extensionLower = this.extension?.toLowerCase();
        this.fileType = file.type ? FileTypeHelper.getByMIME(file.type) : FileTypeHelper.getByExtension(this.extension);
    }

    /**
     * 源文件索引
     */
    rawIndex?: number;

    /**
     * 文件名
     */
    name: string;

    /**
     * 重新命名的文件名
     */
    newName?: string;

    /**
     * 拓展名
     * 包括前缀(.)
     */
    extension: string;

    /**
     * 完整文件名
     */
    fullname = (): string => `${this.name ?? ''}${this.extension ?? ''}`;

    /**
     * 拓展名全小写
     * 包括前缀(.)
     */
    extensionLower: string;

    /**
     * 文件大小
     */
    size: string = '';

    /**
     * 文件类型
     *
     * @默认值 FileType.未知
     */
    fileType: FileType = FileType.未知;

    /**
     * 缩略图
     *
     * @默认值 /filetypes/empty.png
     */
    thumbnail: string = '/filetypes/empty.png';

    /**
     * 类名
     */
    class: string[] = [];

    /**
     * 正在校验MD5
     */
    checking: boolean = false;

    /**
     * 已校验MD5
     */
    checked: boolean = false;

    /**
     * 正在上传
     */
    uploading: boolean = false;

    /**
     * 已上传
     */
    uploaded: boolean = false;

    /**
     * 处理完毕
     */
    done: boolean = false;

    /**
     * 重试次数
     */
    reTry: number = 0;

    /**
     * 发生异常
     */
    error: boolean = false;

    /**
     * 异常信息
     */
    errorMessage?: string;

    /**
     * 真实进度（百分比）
     */
    percent: number = 0;

    /**
     * 虚拟进度（百分比）
     */
    virtualPercent: number = 0;

    /**
     * 暂停前的真实进度（百分比）
     */
    percentBeforPaused: number = 0;

    /**
     * 暂停前的虚拟进度（百分比）
     */
    virtualPercentBeforPaused: number = 0;

    /**
     * 已暂停
     */
    paused: boolean = false;

    /**
     * 已取消
     */
    canceled: boolean = false;

    /**
     * 文件令牌
     */
    token?: string;
}