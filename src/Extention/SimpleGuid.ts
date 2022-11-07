/**
 * 唯一标识
 *
 * @author LCTR
 * @date 2022-09-22
 */
export default class SimpleGuid {
    private static s4(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    /**
     * 生成新的唯一标识
     */
    public static new(): string {
        return `${SimpleGuid.s4()}${SimpleGuid.s4()}-${SimpleGuid.s4()}-${SimpleGuid.s4()}-${SimpleGuid.s4()}-${SimpleGuid.s4()}${SimpleGuid.s4()}${SimpleGuid.s4()}`;
    }
}