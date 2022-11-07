import { IUploadWorkerMessage } from "../Model/IUploadWorkerMessage";
import { IUploadWorkerFileMessage } from "../Model/IUploadWorkerFileMessage";
import { IProgress } from "../Model/IProgress";
import { IUserFileInfo } from "../Model/IUserFileInfo";


/**
 * 文件上传WebWorker脚本
 *
 * @author LCTR
 * @date 2022-09-27
 */
const worker = () => {
    let currentRequest: XMLHttpRequest;

    /**
     * 上传
     *
     * @param url 接口地址
     * @param headers 请求头
     * @param buffer 数据
     */
    const upload = (url: string, headers: Map<string, string>, buffer: ArrayBuffer) => {
        //创建请求实例
        const request = new XMLHttpRequest();
        //设置内容类型
        request.overrideMimeType('application/octet-stream');
        //设置请求头
        if (headers)
            for (const key of headers.keys()) {
                request.setRequestHeader(key, headers.get(key) ?? '');
            }
        //文件上传进度
        request.upload.onprogress = event => {
            postMessage({
                //UploadWorkerMessageType.上行_进度
                type: 'UP_PROGRESS',
                data: {
                    preLoaded: event.total,
                    total: event.total,
                    loaded: event.loaded
                } as IProgress
            } as IUploadWorkerMessage<IProgress>);
        };
        //取消上传
        request.onabort = event => {
            postMessage({
                //UploadWorkerMessageType.上行_取消
                type: 'UP_CANCEL',
                data: {
                    preLoaded: event.total,
                    total: event.total,
                    loaded: event.loaded
                } as IProgress
            } as IUploadWorkerMessage<IProgress>);
        };
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                //上传成功
                postMessage({
                    //UploadWorkerMessageType.上行_完成
                    type: 'UP_COMPLETED',
                    data: JSON.parse(request.response)
                } as IUploadWorkerMessage<IUserFileInfo | null>);
            }
        };
        //上传失败
        request.onerror = event => {
            postMessage({
                //UploadWorkerMessageType.上行_失败
                type: 'UP_FAILED',
                data: {
                    preLoaded: event.total,
                    total: event.total,
                    loaded: event.loaded
                } as IProgress
            } as IUploadWorkerMessage<IProgress>);
        };
        //上传超时
        request.ontimeout = event => {
            postMessage({
                //UploadWorkerMessageType.上行_超时
                type: 'UP_TIMEOUT',
                data: {
                    preLoaded: event.total,
                    total: event.total,
                    loaded: event.loaded
                } as IProgress
            } as IUploadWorkerMessage<IProgress>);
        };
        //请求接口地址
        request.open('POST', url, true);
        //发送数据
        request.send(buffer);
        currentRequest = request;
    }

    onmessage = (event: MessageEvent<IUploadWorkerMessage<IUploadWorkerFileMessage | void>>) => {
        // console.debug(event.data);
        switch (event.data.type) {
            //UploadWorkerMessageType.下行_上传:
            case 'DOWN_UPLOAD':
                const data_upload = event.data.data as IUploadWorkerFileMessage;
                upload(data_upload.url, data_upload.headers, data_upload.buffer);
                break;
            //UploadWorkerMessageType.下行_取消:
            case 'DOWN_CANCEL':
                currentRequest && currentRequest.readyState !== 4 && currentRequest.abort();
                break;
            //UploadWorkerMessageType.下行_关闭:
            case 'DOWN_CLOSE':
                close();
                break;
        }
    }
};
export const UploadWorkerScript = new Blob([`(${worker.toString()})()`]);