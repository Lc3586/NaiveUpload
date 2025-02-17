/**
 * 移动端帮助类
 *
 * @author LCTR
 * @date 2025-02-16
 */
export default class MobileHelper {
    /**
     * 检查当前是否为移动端
     * 
     * @returns true:移动端;false:pc端
     */
    public static isMobile(): boolean {
        return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
            navigator.userAgent
        );
    }
}