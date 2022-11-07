/**
 * 哈希值计算WebWorker传输信息类型
 *
 * @author LCTR
 * @date 2022-09-30
 */
export const enum HashWorkerMessageType {
    下行_附加数据 = 'DOWN_APPEND_DATA',
    下行_获取结果 = 'DOWN_GET_RESULT',
    下行_重置 = 'DOWN_RESET',
    下行_关闭 = 'DOWN_CLOSE',
    上行_应答 = 'UP_ACK',
    上行_结果 = 'UP_RESULT'
}