/**
 * 预备上传分片文件状态
 *
 * @author LCTR
 * @date 2022-09-22
 */
export const enum PreUploadChunkFileState {
    允许上传 = "允许上传",
    推迟上传 = "推迟上传",
    跳过 = "跳过",
    全部跳过 = "全部跳过"
}