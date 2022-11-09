/**
 * 进度信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export interface IProgress {
    /**
     * 准备完成数
     */
    preLoaded: number;
    /**
     * 已完成数
     */
    loaded: number;
    /**
     * 总数
     */
    total: number;
}
