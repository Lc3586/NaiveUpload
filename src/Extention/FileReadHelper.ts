/**
 * 文件读取帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileReadHelper {
    constructor() {
        if ('undefined' === typeof FileReader) {
            throw new Error('当前浏览器不支持FileReader.');
        }
        this.Reader = new FileReader();
    }

    /**
     * 读取器
     */
    private readonly Reader: FileReader;

    /**
     * 读取数据
     *
     * @param blob
     */
    public async readAsArrayBuffer(this: FileReadHelper, blob: Blob): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            this.Reader.onload = event => {
                const buffer = event.target!.result as ArrayBuffer;
                resolve(buffer);
            }

            this.Reader.onerror = event => {
                reject(event);
            }

            this.Reader.readAsArrayBuffer(blob);
        });
    }

    /**
     * 关闭
     */
    public close(this: FileReadHelper) {
        this.Reader.abort();
    }
}