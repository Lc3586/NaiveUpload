import { HashWorkerMessageType } from "../Model/HashWorkerMessageType";
/**
 * 哈希值计算WebWorker传输信息
 *
 * @author LCTR
 * @date 2022-09-30
 */
export interface IHashWorkerMessage<T> {
    /**
     * 类型
     */
    type: HashWorkerMessageType;
    /**
     * 数据
     */
    data: T;
}
