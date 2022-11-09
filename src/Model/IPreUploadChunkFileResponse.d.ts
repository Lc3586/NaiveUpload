import { PreUploadChunkFileState } from "../Model/PreUploadChunkFileState";
/**
 * 文件上传业务模型
 * <p>预备上传分片文件输出信息</p>
 *
 * @author LCTR
 * @date 2022-09-22
 */
export interface IPreUploadChunkFileResponse {
    /**
     * 状态
     */
    state: PreUploadChunkFileState;
    /**
     * 上传标识
     */
    key: string;
}
