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
    constructor(message: string, innerError?: Error) {
        super(message);
        this.innerError = innerError;
    }

    private static consoleWriteWithIndex(e: Error, index: number) {
        console.error(`第${index}层错误`, e);
        e instanceof UploadError && e.innerError && UploadError.consoleWriteWithIndex(e.innerError, ++index);
    }

    /**
     * 内部异常
     */
    public innerError?: Error;

    /**
     * 控制台输出
     *
     * @param e
     */
    public static consoleWrite(e: Error) {
        UploadError.consoleWriteWithIndex(e, 1);
    }
}