import {IUserFileInfo} from "../Model/IUserFileInfo";

/**
 * MD5校验输出信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export interface IValidationMD5Response {
    /**
     * 是否已上传过了
     * <p>如已上传，则返回用户文件信息</p>
     */
    uploaded: boolean;

    /**
     * 用户文件信息
     */
    userFileInfo: IUserFileInfo;
}