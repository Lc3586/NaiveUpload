import { FileType } from "../Model/FileType";
/**
 * 用户文件信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export interface IUserFileInfo {
    /**
     * 标识
     */
    id: string;
    /**
     * 文件名
     */
    name: string;
    /**
     * 文件后缀名
     */
    extension: string;
    /**
     * 文件标识
     */
    fileId: string;
    /**
     * 文件类型
     */
    fileType: FileType;
    /**
     * 文件字节数
     */
    bytes: string;
    /**
     * 文件大小
     */
    size: string;
}
