/**
 * 拖动！
 *
 * @author LCTR
 * @date 2022-10-14
 */
export default class DraggingHelper {
    /**
     * 容器元素
     */
    private containerEl?;
    /**
     * 目标元素
     */
    private el?;
    /**
     * 拖动标识
     */
    private flag;
    /**
     * X轴原坐标
     */
    private x;
    /**
     * Y轴原坐标
     */
    private y;
    /**
     * 当前X轴坐标
     */
    private currentX;
    /**
     * 当前Y轴坐标
     */
    private currentY;
    /**
     * 当前X轴偏移量
     */
    private offsetX;
    /**
     * 当前Y轴偏移量
     */
    private offsetY;
    /**
     * X轴滚动量
     */
    private scrollX;
    /**
     * Y轴滚动量
     */
    private scrollY;
    /**
     * X轴当前位移距离
     */
    private transX;
    /**
     * Y轴当前位移距离
     */
    private transY;
    /**
     * X轴上次位移距离
     */
    private lastTransX;
    /**
     * Y轴上次位移时间
     */
    private lastTransY;
    /**
     * 堆叠顺序
     */
    private zIndex;
    /**
     * 位置
     */
    private position;
    /**
     * 位移
     */
    private transform;
    /**
     * 更改位移属性的最小位移量
     */
    private transLate;
    /**
     * 判断是否回归原位时的误差值
     */
    private readonly restoreError;
    /**
     * 移动鼠标
     *
     * @param event 事件
     */
    private mouseMove?;
    /**
     * 移动鼠标
     *
     * @param event 事件
     */
    private scroll?;
    /**
     * 改变位置
     *
     * @param clientX
     * @param clientY
     */
    private moving;
    /**
     * 检查是否拖动到了原本的位置
     */
    private checkRestore;
    /**
     * 是否相等
     *
     * @param current 当前值
     * @param target 要比较的值
     * @param error 误差范围（如error=5，则为±5）
     */
    private static equalError;
    /**
     * 获取实例
     *
     * @param containerEl 容器元素
     * @param el 目标元素
     */
    static getInstance(containerEl: HTMLElement, el: HTMLElement): DraggingHelper;
    /**
     * 开始拖动
     *
     * @param clientX X轴坐标
     * @param clientY Y轴坐标
     * @param handlerMoving 监听移动 event 鼠标移动事件对象
     */
    start(this: DraggingHelper, clientX: number, clientY: number, handlerMoving?: ((event: MouseEvent) => void)): void;
    /**
     * 设置偏移量
     *
     * @param x X轴偏移量
     * @param y Y轴偏移量
     */
    offset(this: DraggingHelper, x: number, y: number): void;
    /**
     * 保存当前的位置
     */
    save(this: DraggingHelper): void;
    /**
     * 复原
     */
    restore(this: DraggingHelper): void;
    /**
     * 结束拖动
     *
     * @param restore 是否还原
     */
    end(this: DraggingHelper, restore: boolean): void;
}
