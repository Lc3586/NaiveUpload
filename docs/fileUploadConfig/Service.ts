import { IDetail } from "./IDetail";
import { ITreeList } from "./ITreeList";
import axios from "axios";
import { IConfig } from "../../src/export.vue3";


/**
 * 文件上传配置信息服务
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileUploadConfigService {
    private static readonly treeListData: ITreeList[] = [];
    private static readonly detailData: Map<string, IDetail> = new Map<string, IDetail>();
    private static readonly configData: Map<string, IConfig> = new Map<string, IConfig>();

    /**
     * 获取树状列表数据
     *
     * @return 树状列表数据
     */
    public static async getTreeList(): Promise<ITreeList[]> {
        return new Promise<ITreeList[]>((resolve, reject) => {
            if (FileUploadConfigService.detailData.size != 0) {
                resolve(FileUploadConfigService.treeListData);
                return;
            }

            axios.get('../data.json').then((response: { data: ITreeList[] }) => {
                const addData = (data: ITreeList[], deep: boolean = false) => {
                    data.forEach(item => {
                        !deep && FileUploadConfigService.treeListData.push(item);

                        FileUploadConfigService.detailData.set(item.id, item);

                        FileUploadConfigService.configData.set(item.code, item);

                        item.hasChildren && addData(item.children, true);
                    });
                }
                addData(response.data);
                resolve(Array.from(FileUploadConfigService.treeListData));
            }).catch(error => {
                console.error(error);
                reject(new Error('获取树状列表数据失败.'));
            });
        });
    }

    /**
     * 获取详情数据
     *
     * @param id 主键
     * @return 详情数据
     */
    public static async getDetail(id: string): Promise<IDetail> {
        if (FileUploadConfigService.detailData.size == 0)
            await this.getTreeList();

        return new Promise<IDetail>((resolve, reject) => {
            const data = FileUploadConfigService.detailData.get(id);

            if (data == null)
                reject(new Error('获取详情数据失败.'));
            else
                resolve(data);
        });
    }

    /**
     * 获取配置数据
     *
     * @param code 编码
     * @return 配置数据
     */
    public static async getConfig(code: string): Promise<IConfig> {
        if (FileUploadConfigService.configData.size == 0)
            await this.getTreeList();

        return new Promise<IConfig>((resolve, reject) => {
            const data = FileUploadConfigService.configData.get(code);

            if (data == null)
                reject(new Error('获取配置数据失败.'));
            else
                resolve(data);
        });
    }
}