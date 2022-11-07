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
    private containerEl?: HTMLElement;

    /**
     * 目标元素
     */
    private el?: HTMLElement;

    /**
     * 拖动标识
     */
    private flag: boolean = false;

    /**
     * X轴原坐标
     */
    private x: number = 0;

    /**
     * Y轴原坐标
     */
    private y: number = 0;

    /**
     * 当前X轴坐标
     */
    private currentX: number = 0;

    /**
     * 当前Y轴坐标
     */
    private currentY: number = 0;

    /**
     * 当前X轴偏移量
     */
    private offsetX: number = 0;

    /**
     * 当前Y轴偏移量
     */
    private offsetY: number = 0;

    /**
     * X轴滚动量
     */
    private scrollX: number = 0;

    /**
     * Y轴滚动量
     */
    private scrollY: number = 0;

    /**
     * X轴当前位移距离
     */
    private transX: number = 0;

    /**
     * Y轴当前位移距离
     */
    private transY: number = 0;

    /**
     * X轴上次位移距离
     */
    private lastTransX: number = 0;

    /**
     * Y轴上次位移时间
     */
    private lastTransY: number = 0;

    /**
     * 堆叠顺序
     */
    private zIndex: string = '';

    /**
     * 位置
     */
    private position: string = '';

    /**
     * 位移
     */
    private transform: string = '';

    /**
     * 更改位移属性的最小位移量
     */
    private transLate: number = 1;

    /**
     * 判断是否回归原位时的误差值
     */
    private readonly restoreError: number[] = [20, 10];

    /**
     * 移动鼠标
     *
     * @param event 事件
     */
    private mouseMove?: (event: MouseEvent) => void;

    /**
     * 移动鼠标
     *
     * @param event 事件
     */
    private scroll?: (event: Event) => void;

    /**
     * 改变位置
     *
     * @param clientX
     * @param clientY
     */
    private moving(this: DraggingHelper, clientX: number, clientY: number) {
        this.currentX = clientX;
        this.currentY = clientY;

        if (this.checkRestore()) {
            this.transX = 0;
            this.transY = 0;

            this.el!.style.transform = this.transform;
        } else {
            this.transX = this.currentX - this.x + this.scrollX + this.offsetX;
            this.transY = this.currentY - this.y + this.scrollY + this.offsetY;

            if (Math.abs(this.transX - this.lastTransX) >= this.transLate
                || Math.abs(this.transY - this.lastTransY) >= this.transLate) {
                this.el!.style.transform = `translate(${this.transX}px, ${this.transY}px)`;
            }
        }

        this.lastTransX = this.transX;
        this.lastTransY = this.transY;
    }

    /**
     * 检查是否拖动到了原本的位置
     */
    private checkRestore(): boolean {
        return DraggingHelper.equalError(this.x, this.currentX, this.restoreError[0])
            && DraggingHelper.equalError(this.y, this.currentY, this.restoreError[1]);
    }

    /**
     * 是否相等
     *
     * @param current 当前值
     * @param target 要比较的值
     * @param error 误差范围（如error=5，则为±5）
     */
    private static equalError(current: number, target: number, error: number): boolean {
        return target + error >= current && target - error <= current;
    }

    /**
     * 获取实例
     *
     * @param containerEl 容器元素
     * @param el 目标元素
     */
    public static getInstance(containerEl: HTMLElement, el: HTMLElement): DraggingHelper {
        let helper = new DraggingHelper();
        helper.el = el;
        helper.containerEl = containerEl;
        return helper;
    }

    /**
     * 开始拖动
     *
     * @param clientX X轴坐标
     * @param clientY Y轴坐标
     * @param handlerMoving 监听移动 event 鼠标移动事件对象
     */
    public start(this: DraggingHelper, clientX: number, clientY: number, handlerMoving?: ((event: MouseEvent) => void)) {
        this.flag = true;
        //开始拖动时记录原始属性
        this.currentX = clientX;
        this.currentY = clientY;
        this.save();

        // this.el.style.zIndex = '999';
        // this.el.style.position = 'relative';

        let handlerMovingFlag = false;

        this.mouseMove = (event: MouseEvent) => {
            if (!this.flag || handlerMovingFlag)
                return;

            event.preventDefault();

            handlerMovingFlag = true;

            this.moving(event.clientX, event.clientY);

            handlerMoving && handlerMoving(event);

            handlerMovingFlag = false;
        };

        this.containerEl!.addEventListener('mousemove', this.mouseMove);

        this.scroll = (event: Event) => {
            this.scrollX = this.containerEl!.scrollLeft;
            this.scrollY = this.containerEl!.scrollTop;
        };

        this.containerEl!.addEventListener('scroll', this.scroll);
    }

    /**
     * 设置偏移量
     *
     * @param x X轴偏移量
     * @param y Y轴偏移量
     */
    public offset(this: DraggingHelper, x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;
    }

    /**
     * 保存当前的位置
     */
    public save(this: DraggingHelper) {
        this.x = this.currentX;
        this.y = this.currentY;
        this.zIndex = this.el!.style.zIndex;
        this.position = this.el!.style.position;
        this.transform = this.el!.style.transform;
    }

    /**
     * 复原
     */
    public restore(this: DraggingHelper) {
        this.flag = false;
        this.x = this.currentX;
        this.y = this.currentY;
        this.el!.style.zIndex = this.zIndex;
        this.el!.style.position = this.position;
        this.el!.style.transform = this.transform;
    };

    /**
     * 结束拖动
     *
     * @param restore 是否还原
     */
    public end(this: DraggingHelper, restore: boolean) {
        if (restore)
            this.restore();
        this.containerEl!.removeEventListener('mousemove', this.mouseMove!);
        this.containerEl!.removeEventListener('scroll', this.scroll!);
    }
}