/**
 * 有透明度的RGB颜色值
 *
 * @author LCTR
 * @date 2022-12-05
 */
export default class RGBAColor {
    /**
     * @param r 红色值
     * @param g 绿色值
     * @param b 蓝色值
     * @param a 色彩空间
     */
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
    * 红色值
    */
    r: number;

    /**
    * 绿色值
    */
    g: number;

    /**
    * 蓝色值
    */
    b: number;

    /**
    * 色彩空间
    */
    a: number;

    /**
     * 序列化
     */
    toString: (this: RGBAColor) => string = () => `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;

    /**
     * @param rgba {r 红色值, g 绿色值, b 蓝色值, a 色彩空间}
     */
    public static convertFrom(rgba: { r: number, g: number, b: number, a: number }): RGBAColor {
        return new RGBAColor(rgba.r, rgba.g, rgba.b, rgba.a);
    }
}