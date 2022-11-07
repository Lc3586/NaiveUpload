/**
 * 配置信息
 *
 * @author LCTR
 * @date 2022-09-21
 */
export interface IConfig {
    /**
     * 编码
     */
    code: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 文件数量下限
     */
    lowerLimit: number;

    /**
     * 文件数量上限
     */
    upperLimit: number;

    /**
     * 单个文件大小下限（单位 KB）
     */
    lowerSingleSize: number;

    /**
     * 单个文件大小上限（单位 KB）
     */
    upperSingleSize: number;

    /**
     * 所有文件整体大小下限（单位 KB）
     */
    lowerTotalSize: number;

    /**
     * 所有文件整体大小上限（单位 KB）
     */
    upperTotalSize: number;

    /**
     * 说明
     */
    explain: string;

    /**
     * 允许的MIME类型
     * <p>此值为空时未禁止即允许</p>
     */
    allowedTypeList: string[];

    /**
     * 禁止的MIME类型
     * <p>此值为空时皆可允许</p>
     */
    prohibitedTypeList: string[];
}