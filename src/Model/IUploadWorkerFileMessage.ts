/**
 * 文件上传WebWorker文件传输信息
 *
 * @author LCTR
 * @date 2022-09-27
 */
export interface IUploadWorkerFileMessage {
    /**
     * 接口地址
     */
    url: string;

    /**
     * 请求头设置
     */
    headers: Map<string, string>;

    /**
     * 数据
     */
    buffer: ArrayBuffer;
}