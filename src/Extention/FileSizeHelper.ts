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
    private static readonly formats: string[] = [
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB"];

    /**
     * 获取文件大小描述信息
     *
     * @param length 文件字节数
     * @param unit      单位
     * @param precision 精度
     * @return 文件大小描述信息
     */
    public static getSize(length: number,
        unit: number = 1024,
        precision: number = 2): string {
        if (length <= 0) return "0 KB";

        for (let i: number = 0; i < FileSizeHelper.formats.length; i++) {
            let value = length / Math.pow(unit, i + 1);

            if (value < unit)
                return `${value.toFixed(precision)} ${FileSizeHelper.formats[i]}`;
        }

        return `${(length / Math.pow(unit, FileSizeHelper.formats.length)).toFixed(precision)} ${FileSizeHelper.formats[FileSizeHelper.formats.length - 1]}`;
    }
}