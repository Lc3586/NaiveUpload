﻿import { RunMode } from "../Model/RunMode";
import { Layout } from "../Model/Layout";
import RGBAColor from "./RGBAColor";


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
     * 启用拖动排序功能
     *
     * @默认值 true
     */
    enableDrag: boolean = true;

    /**
     * 校验状态的颜色
     * 
     * @默认值 new RGBAColor(255, 235, 59, 0.5)
     */
    statusCheckingColor: RGBAColor = new RGBAColor(255, 235, 59, 0.5);

    /**
     * 上传状态的颜色
     * 
     * @默认值 new RGBAColor(144, 206, 255, 0.5)
     */
    statusUploadingColor: RGBAColor = new RGBAColor(144, 206, 255, 0.5);

    /**
     * 暂停状态的颜色
     * 
     * @默认值 new RGBAColor(158, 158, 158, 0.5)
     */
    statusPausedColor: RGBAColor = new RGBAColor(158, 158, 158, 0.5);

    /**
     * 暂停状态副标题的颜色
     * 
     * @默认值 new RGBAColor(244, 154, 3, 0.5)
     */
    statusPausedSubColor: RGBAColor = new RGBAColor(244, 154, 3, 0.5);

    /**
     * 完成状态的颜色
     * 
     * @默认值 new RGBAColor(76, 175, 80, 0.1)
     */
    statusDoneColor: RGBAColor = new RGBAColor(76, 175, 80, 0.1);

    /**
     * 完成状态副标题的颜色
     * 
     * @默认值 new RGBAColor(3, 169, 244, 0.5)
     */
    statusDoneSubColor: RGBAColor = new RGBAColor(3, 169, 244, 0.5);

    /**
     * 错误状态的颜色
     * 
     * @默认值 new RGBAColor(255, 0, 30, 0.35)
     */
    statusErrorColor: RGBAColor = new RGBAColor(255, 0, 30, 0.35);

    /**
     * 错误状态副标题的颜色
     * 
     * @默认值 new RGBAColor(232, 31, 31, 0.5)
     */
    statusErrorSubColor: RGBAColor = new RGBAColor(232, 31, 31, 0.5);

    /**
     * 准备拖动时的动画颜色
     * 
     * @默认值 new RGBAColor(255, 152, 0, 0.8)
     */
    dragReadyColor: RGBAColor = new RGBAColor(255, 152, 0, 0.8);

    /**
     * 拖动时的动画颜色
     * 
     * @默认值 new RGBAColor(255, 152, 0, 0.5)
     */
    dragMovingColor: RGBAColor = new RGBAColor(255, 152, 0, 0.5);

    /**
     * 结束拖动时的动画颜色
     * 
     * @默认值 new RGBAColor(255, 87, 34, 0.8)
     */
    dragOverColor: RGBAColor = new RGBAColor(255, 87, 34, 0.8);

    /**
     * 准备开始拖动的时间（单位ms）
     * 
     * @默认值 1500
     */
    dragPreparationTime: number = 800;

    /**
     * 拖动时变换位置的等待时间（单位ms）
     * 
     * @默认值 1300
     */
    dragChangePositionTime: number = 1000;

    /**
     * 是否为移动端
     * 
     * @默认值 自动根据浏览器信息判断
     */
    isMobile: boolean = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
        navigator.userAgent
    );
}