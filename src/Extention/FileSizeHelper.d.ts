/**
 * 文件大小帮助类
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class FileSizeHelper {
    /**
     * 格式名
     */
    private static readonly formats;
    /**
     * 获取文件大小描述信息
     *
     * @param length 文件字节数
     * @param unit      单位
     * @param precision 精度
     * @return 文件大小描述信息
     */
    static getSize(length: number, unit?: number, precision?: number): string;
}
