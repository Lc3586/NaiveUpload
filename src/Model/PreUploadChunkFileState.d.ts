/**
 * 预备上传分片文件状态
 *
 * @author LCTR
 * @date 2022-09-22
 */
export declare const enum PreUploadChunkFileState {
    允许上传 = "\u5141\u8BB8\u4E0A\u4F20",
    推迟上传 = "\u63A8\u8FDF\u4E0A\u4F20",
    跳过 = "\u8DF3\u8FC7",
    全部跳过 = "\u5168\u90E8\u8DF3\u8FC7"
}
