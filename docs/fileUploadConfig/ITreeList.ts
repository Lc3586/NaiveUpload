import { IConfig } from "../../src/export.vue3";


/**
 * 文件上传配置业务模型
 * <p>树状列表数据</p>
 *
 * @author LCTR
 * @date 2022-09-21
 */
export interface ITreeList extends IConfig {
    /**
     * 主键
     */
    id: string;

    /**
     * 启用
     */
    enable: boolean;

    /**
     * 是否拥有子级
     */
    hasChildren: boolean;

    /**
     * 子级数量
     */
    childrenCount: number;

    /**
     * 子级
     */
    children: ITreeList[];
}