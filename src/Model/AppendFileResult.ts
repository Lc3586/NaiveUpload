import { AppendFileResultState } from "../Model/AppendFileResultState";
import RawFile from "../Model/RawFile";


/**
 * 追加文件返回信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class AppendFileResult {
    constructor(state: AppendFileResultState, rawFile?: RawFile) {
        this.state = state;
        this.rawFile = rawFile;
    }


    /**
     * 文件
     */
    public rawFile?: RawFile;

    /**
     * 状态
     */
    public state: AppendFileResultState;
}