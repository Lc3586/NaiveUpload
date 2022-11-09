import { FileType } from "../Model/FileType";
/**
 * 文件类型帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileTypeHelper {
    /**
     * 获取文件类型
     *
     * @param extension 文件扩展名(示例：.jpg)
     * @return 文件类型
     */
    static getByExtension(extension: string): FileType;
    /**
     * 获取文件类型
     *
     * @param mimetype 内容类型
     * @return 文件类型
     */
    static getByMIME(mimetype: string): FileType;
}
