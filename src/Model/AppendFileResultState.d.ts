/**
 * 追加文件返回信息状态
 *
 * @author LCTR
 * @date 2022-09-22
 */
export declare enum AppendFileResultState {
    成功 = 'SUCCESS',
    超出数量限制 = 'LIMIT',
    文件类型不合法 = 'UNVERIFIED_TYPE'
}