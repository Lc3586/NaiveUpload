/**
 * 文件读取帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileReadHelper {
    constructor();
    /**
     * 读取器
     */
    private readonly Reader;
    /**
     * 读取数据
     *
     * @param blob
     */
    readAsArrayBuffer(this: FileReadHelper, blob: Blob): Promise<ArrayBuffer>;
    /**
     * 关闭
     */
    close(this: FileReadHelper): void;
}
