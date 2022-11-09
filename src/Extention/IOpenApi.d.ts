import { IUserFileInfo } from "../Model/IUserFileInfo";
/**
 * 组件开放的接口
 *
 * @author LCTR
 * @date 2022-10-11
 */
export interface IOpenApi {
    /**
     * 立即开始校验队列中的文件
     */
    startCheck(): void;
    /**
     * 立即开始上传队列中的文件
     */
    startUpload(): void;
    /**
     * 暂停
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时暂停全部
     */
    pause(token?: string): void;
    /**
     * 恢复
     *
     * @param token 追加文件后返回的文件令牌，未设置此参数时恢复全部
     */
    continue(token?: string): void;
    /**
     * 删除
     *
     * @param token 追加文件后返回的文件令牌
     */
    remove(token: string): void;
    /**
     * 清空
     */
    clean(): void;
    /**
     * 是否所有文件已全部上传完毕
     *
     * @return true 所有文件已全部上传完毕
     */
    finished(): boolean;
    /**
     * 获取当前所有的用户文件信息集合
     *
     * @return 当前所有的用户文件信息集合
     */
    getUserFileInfoList(): IUserFileInfo[];
}
