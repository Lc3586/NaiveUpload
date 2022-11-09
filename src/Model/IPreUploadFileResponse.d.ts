import { IUserFileInfo } from "../Model/IUserFileInfo";
/**
 * 预备上传文件输出信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export interface IPreUploadFileResponse {
    /**
     * 是否已上传过了
     * <p>如已上传,则返回个人文件信息</p>
     */
    uploaded: boolean;
    /**
     * 用户文件信息
     */
    userFileInfo: IUserFileInfo;
}
