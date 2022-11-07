/**
 * 文件上传WebWorker传输信息类型
 *
 * @author LCTR
 * @date 2022-09-27
 */
export const enum UploadWorkerMessageType {
    下行_上传 = 'DOWN_UPLOAD',
    下行_取消 = 'DOWN_CANCEL',
    下行_关闭 = 'DOWN_CLOSE',
    上行_进度 = 'UP_PROGRESS',
    上行_取消 = 'UP_CANCEL',
    上行_完成 = 'UP_COMPLETED',
    上行_失败 = 'UP_FAILED',
    上行_超时 = 'UP_TIMEOUT',
}