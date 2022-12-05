import { RunMode } from "../Model/RunMode";
import { Layout } from "../Model/Layout";
import RGBAColor from "../Model/RGBAColor";
/**
 * 文件上传组件设置
 *
 * @author LCTR
 * @date 2022-06-24
 */
export default class Settings {
    /**
     * 设置
     *
     * @param action 此方法的参数为当前示例
     */
    readonly setup: (action: (model: Settings) => void) => Settings;
    /**
     * 默认设置
     */
    static default: () => Settings;
    /**
     * 默认设置
     */
    static defaultWithConfigCode: (configCode: string) => Settings;
    /**
     * 文件上传配置编码
     *
     * @默认值 default
     */
    configCode: string;
    /**
     * 文件上传并发数
     *
     * @默认值 3
     */
    concurrentFile: number;
    /**
     * 分片文件上传并发数
     *
     * @默认值 3
     */
    concurrentChunkFile: number;
    /**
     * 小贴士
     *
     * @默认值 单击或拖动文件到此区域即可上传
     */
    tip: string;
    /**
     * 布局
     *
     * @默认值 Layout.卡片
     */
    layout: Layout;
    /**
     * 运行模式
     *
     * @默认值 RunMode.全自动
     */
    runMode: RunMode;
    /**
     * 是否启用文件切片
     *
     * @默认值 true
     */
    enableChunk: boolean;
    /**
     * 切片规格（文件字节数）
     *
     * @默认值 2097152（即为2 * 1024 * 1024 = 2MB）
     */
    chunkSize: number;
    /**
     * 发生错误时的重试次数
     *
     * @默认值 3
     */
    retry: number;
    /**
     * 是否启用Web Worker
     * <p>在浏览器不支持时此设置不会生效</P>
     *
     * @默认值 true
     */
    enableWorker: boolean;
    /**
     * 只读模式
     *
     * @默认值 false
     */
    readonly: boolean;
    /**
     * 调试模式
     */
    debug: boolean;
    /**
     * 显示错误信息
     */
    alertErrorInfo: boolean;
    /**
    * 启用拖动排序功能
    *
    * @默认值 true
    */
    enableDrag: boolean;
    /**
     * 校验中状态的颜色
     * 
     * @默认值 new RGBAColor(255, 235, 59, 0.5)
     */
    statusCheckingColor: RGBAColor;
    /**
     * 上传中状态的颜色
     * 
     * @默认值 new RGBAColor(144, 206, 255, 0.5)
     */
    statusUploadingColor: RGBAColor;
    /**
     * 上传完成状态的颜色
     * 
     * @默认值 new RGBAColor(76, 175, 80, 0.1)
     */
    statusDoneColor: RGBAColor;
    /**
     * 完成状态副标题的颜色
     * 
     * @默认值 new RGBAColor(3, 169, 244, 0.5)
     */
    statusDoneSubColor: RGBAColor;
    /**
     * 暂停状态的颜色
     * 
     * @默认值 new RGBAColor(158, 158, 158, 0.5)
     */
    statusPausedColor: RGBAColor;
    /**
     * 暂停状态副标题的颜色
     * 
     * @默认值 new RGBAColor(244, 154, 3, 0.5)
     */
    statusPausedSubColor: RGBAColor;
    /**
     * 错误状态的颜色
     * 
     * @默认值 new RGBAColor(255, 0, 30, 0.35)
     */
    statusErrorColor: RGBAColor;
    /**
     * 错误状态副标题的颜色
     * 
     * @默认值 new RGBAColor(232, 31, 31, 0.5)
     */
    statusErrorSubColor: RGBAColor;
    /**
     * 准备拖动时的动画颜色
     * 
     * @默认值 { r: 255, g: 152, b: 0, a: 0.8 }
     */
    dragReadyColor: RGBAColor;
    /**
     * 拖动时的动画颜色
     * 
     * @默认值 { r: 255, g: 152, b: 0, a: 0.5 }
     */
    dragMovingColor: RGBAColor;
    /**
     * 结束拖动时的动画颜色
     * 
     * @默认值 { r: 255, g: 87, b: 34, a: 0.8 }
     */
    dragOverColor: RGBAColor;
    /**
     * 准备开始拖动的时间（单位ms）
     * 
     * @默认值 1500
     */
    dragPreparationTime: number;
    /**
     * 拖动时变换位置的等待时间（单位ms）
     * 
     * @默认值 1300
     */
    dragChangePositionTime: number;
}
