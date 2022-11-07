/**
 * 切片文件
 *
 * @author LCTR
 * @date 2022-06-24
 */
export default class ChunkFile {
    /**
     *
     * @param index 索引
     * @param blob 二进制数据
     */
    constructor(index: number, blob: Blob) {
        this.index = index;
        this.blob = blob;
        this.size = blob.size;
    }

    /***
     * 索引
     */
    index: number;

    /***
     * 二进制数据
     */
    blob: Blob;

    /***
     * 字节数
     */
    size: number;

    /**
     * 文件校验时文件数据读取到的位置
     */
    checkPosition: number = 0;

    /***
     * 哈希值
     */
    md5: string | null = null;

    /**
     * 强制上传
     */
    forced: boolean = false;

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

    /***
     * 处理完毕
     */
    done: boolean = false;

    /**
     * 发生异常
     */
    error: boolean = false;

    /**
     * 异常信息
     */
    errorMessage?: string;
}