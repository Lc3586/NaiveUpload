/**
 * 异常信息
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class UploadError extends Error {
    /**
     *
     * @param message 异常消息
     * @param innerError 内部异常
     */
    constructor(message: string, innerError?: Error);
    private static consoleWriteWithIndex;
    /**
     * 内部异常
     */
    innerError?: Error;
    /**
     * 控制台输出
     *
     * @param e
     */
    static consoleWrite(e: Error): void;
}
