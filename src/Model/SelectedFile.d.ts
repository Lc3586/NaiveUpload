import { FileType } from "../Model/FileType";
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
    constructor(file: File);
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
    fullname: () => string;
    /**
     * 拓展名全小写
     * 包括前缀(.)
     */
    extensionLower: string;
    /**
     * 文件大小
     */
    size: string;
    /**
     * 文件类型
     *
     * @默认值 FileType.未知
     */
    fileType: FileType;
    /**
     * 缩略图
     *
     * @默认值 /filetypes/empty.png
     */
    thumbnail: string;
    /**
     * 类名
     */
    class: string[];
    /**
     * 正在校验MD5
     */
    checking: boolean;
    /**
     * 已校验MD5
     */
    checked: boolean;
    /**
     * 正在上传
     */
    uploading: boolean;
    /**
     * 已上传
     */
    uploaded: boolean;
    /**
     * 处理完毕
     */
    done: boolean;
    /**
     * 重试次数
     */
    reTry: number;
    /**
     * 发生异常
     */
    error: boolean;
    /**
     * 异常信息
     */
    errorMessage?: string;
    /**
     * 真实进度（百分比）
     */
    percent: number;
    /**
     * 虚拟进度（百分比）
     */
    virtualPercent: number;
    /**
     * 暂停前的真实进度（百分比）
     */
    percentBeforPaused: number;
    /**
     * 暂停前的虚拟进度（百分比）
     */
    virtualPercentBeforPaused: number;
    /**
     * 已暂停
     */
    paused: boolean;
    /**
     * 已取消
     */
    canceled: boolean;
    /**
     * 文件令牌
     */
    token?: string;
}
