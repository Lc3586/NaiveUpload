import { IConfig } from "../../src/export.vue2";


/**
 * 文件上传配置业务模型
 * <p>详情数据</p>
 *
 * @author LCTR
 * @date 2022-09-21
 */
export interface IDetail extends IConfig {
    /**
     * 主键
     */
    id: string;

    /**
     * 启用
     */
    enable: boolean;
}