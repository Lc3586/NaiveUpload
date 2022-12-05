import { IDetail } from "./IDetail";
import { ITreeList } from "./ITreeList";
import { IConfig } from "../../src/export.vue3";
/**
 * 文件上传配置信息服务
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileUploadConfigService {
    private static readonly treeListData;
    private static readonly detailData;
    private static readonly configData;
    /**
     * 获取树状列表数据
     *
     * @return 树状列表数据
     */
    static getTreeList(): Promise<ITreeList[]>;
    /**
     * 获取详情数据
     *
     * @param id 主键
     * @return 详情数据
     */
    static getDetail(id: string): Promise<IDetail>;
    /**
     * 获取配置数据
     *
     * @param code 编码
     * @return 配置数据
     */
    static getConfig(code: string): Promise<IConfig>;
}
