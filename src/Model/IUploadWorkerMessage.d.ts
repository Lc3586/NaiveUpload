import { UploadWorkerMessageType } from "../Model/UploadWorkerMessageType";
/**
 * 文件上传WebWorker传输信息
 *
 * @author LCTR
 * @date 2022-09-27
 */
export interface IUploadWorkerMessage<T> {
    /**
     * 类型
     */
    type: UploadWorkerMessageType;
    /**
     * 数据
     */
    data: T;
}
