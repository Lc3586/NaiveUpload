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
    public static getByExtension(extension: string): FileType {
        switch (extension) {
            case ".webp":
            case ".jpg":
            case ".png":
            case ".ioc":
            case ".bmp":
            case ".gif":
            case ".tif":
            case ".tga":
            case ".jpeg":
                return FileType.图片;
            case ".mp2":
            case ".ac3":
            case ".mp3":
            case ".m4a":
            case ".m4r":
            case ".mmf":
            case ".ogg":
            case ".amr":
            case ".aac":
            case ".vqf":
            case ".wma":
            case ".ape":
            case ".wav":
            case ".flac":
            case ".cda":
            case ".dts":
                return FileType.音频;
            case ".swf":
            case ".3gp":
            case ".3g2":
            case ".mp4":
            case ".mpeg":
            case ".mpg":
            case ".dat":
            case ".mov":
            case ".vob":
            case ".qt":
            case ".rm":
            case ".asf":
            case ".avi":
            case ".navi":
            case ".divx":
            case ".flv":
            case ".f4v":
            case ".qsv":
            case ".wmv":
            case ".mkv":
            case ".rmvb":
            case ".webm":
                return FileType.视频;
            case ".xls":
            case ".xlsx":
            case ".csv":
                return FileType.电子表格;
            case ".pdf":
            case ".doc":
            case ".docx":
                return FileType.电子文档;
            case ".txt":
            case ".js":
            case ".css":
            case ".cs":
            case ".html":
            case ".vue":
            case ".ts":
            case ".xml":
            case ".json":
                return FileType.文本文件;
            case ".zip":
            case ".rar":
            case ".7z":
                return FileType.压缩包;
            default:
                return FileType.未知;
        }
    }

    /**
     * 获取文件类型
     *
     * @param mimetype 内容类型
     * @return 文件类型
     */
    public static getByMIME(mimetype: string): FileType {
        const mimetypeLower = mimetype.toLocaleLowerCase();
        if (mimetypeLower.indexOf('image/', 0) != -1)
            return FileType.图片;
        else if (mimetypeLower.indexOf('audio/', 0) != -1)
            return FileType.音频;
        else if (mimetypeLower.indexOf('video/', 0) != -1)
            return FileType.视频;
        else if (mimetypeLower.indexOf('text/', 0) != -1)
            return FileType.文本文件;
        else {
            switch (mimetype) {
                case "application/ogg":
                    return FileType.音频;
                case "application/mp4":
                    return FileType.视频;
                case "application/vnd.ms-excel":
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return FileType.电子表格;
                case "application/pdf":
                case "application/msword":
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return FileType.电子文档;
                case "application/json":
                case "application/javascript":
                    return FileType.文本文件;
                case "application/x-tar":
                case "application/zip":
                case "application/x-compressed":
                case "application/x-zip-compressed":
                    return FileType.压缩包;
                default:
                    return FileType.未知;
            }
        }
    }
}