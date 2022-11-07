import ChunkFile from "../Model/ChunkFile";
import { IUserFileInfo } from "../Model/IUserFileInfo";

/**
 * 源文件
 *
 * @author LCTR
 * @date 2022-06-24
 */
export default class RawFile {
    /**
     *
     * @param file 源文件
     */
    constructor(file: File | null) {
        if (file == null)
            return;

        this.file = file;
        this.size = file.size;
        this.objectURL = URL.createObjectURL(file);
    }

    /**
     * 文件
     */
    file?: File;

    /***
     * 字节数
     */
    size: number = 0;

    /**
     * 文件校验时文件数据读取到的位置
     */
    checkPosition: number = 0;

    /**
     * 文件上传时文件数据读取到的位置
     */
    uploadPosition: number = 0;

    /**
     * 资源地址
     */
    objectURL?: string;

    /**
     * 哈希值
     */
    md5: string | null = null;

    /**
     * 文件拓展名
     */
    extension?: string;

    /**
     * 文件重命名
     */
    name?: string;

    /**
     * 需要切片处理
     *
     * @默认值 false
     */
    needSection: boolean = false;

    /**
     * 分片规格
     */
    specs?: number;

    /**
     * 分片文件上传标识
     */
    key?: string;

    /**
     * 切片集合
     */
    chunks: ChunkFile[] = [];

    /**
     * 切片索引队列
     */
    chunkIndexQueue: number[] = [];

    /**
     * 用户文件信息
     */
    userFileInfo?: IUserFileInfo;

    /**
     * 文件上传配置编码
     */
    configCode?: string;

    /**
     * 文件令牌
     */
    token?: string;

    /**
     * 回显的数据
     */
    echo: boolean = false;
}