import { RunMode } from "../Model/RunMode";
import { Layout } from "../Model/Layout";


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
    public readonly build: (action: (model: Settings) => void) => Settings = (action) => {
        action(this);
        return this;
    };

    /**
     * 设置
     *
     * @param action 此方法的参数为当前示例
     */
    public readonly setup: (this: Settings, action: (model: Settings) => void) => Settings = (action) => {
        action(this);
        return this;
    };

    /**
     * 默认设置
     */
    public static default: () => Settings = () => new Settings();

    /**
     * 默认设置
     */
    public static defaultWithConfigCode: (configCode: string) => Settings = (configCode: string) => {
        return new Settings().setup(x => x.configCode = configCode);
    }

    /**
     * 文件上传配置编码
     *
     * @默认值 default
     */
    configCode: string = 'default';

    /**
     * 文件上传并发数
     *
     * @默认值 3
     */
    concurrentFile: number = 3;

    /**
     * 分片文件上传并发数
     *
     * @默认值 3
     */
    concurrentChunkFile: number = 3;

    /**
     * 小贴士
     *
     * @默认值 单击或拖动文件到此区域即可上传
     */
    tip: string = '单击或拖动文件到此区域即可上传';

    /**
     * 布局
     *
     * @默认值 Layout.卡片
     */
    layout: Layout = Layout.卡片;

    /**
     * 运行模式
     *
     * @默认值 RunMode.全自动
     */
    runMode: RunMode = RunMode.全自动;

    /**
     * 是否启用文件切片
     *
     * @默认值 true
     */
    enableChunk: boolean = true;

    /**
     * 切片规格（文件字节数）
     *
     * @默认值 2097152（即为2 * 1024 * 1024 = 2MB）
     */
    chunkSize: number = 2097152;

    /**
     * 发生错误时的重试次数
     *
     * @默认值 3
     */
    retry: number = 3;

    /**
     * 是否启用Web Worker
     * <p>在浏览器不支持时此设置不会生效</P>
     *
     * @默认值 true
     */
    enableWorker: boolean = true;

    /**
     * 只读模式
     *
     * @默认值 false
     */
    readonly: boolean = false;

    /**
     * 调试模式
     */
    debug: boolean = false;

    /**
     * 显示错误信息
     */
    alertErrorInfo: boolean = false;

    /**
     * 准备开始拖动的时间（单位ms）
     * 
     * @默认值 1500
     */
    dragPreparationTime: number = 1500;

    /**
     * 拖动时变换位置的等待时间（单位ms）
     * 
     * @默认值 1300
     */
    dragChangePositionTime: number = 1300;
}