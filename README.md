# 初级上传组件

### 支持大文件上传、多文件上传、文件秒传、断点续传，以及文件数量校验、文件大小校验、文件类型校验

**_LCTR 2022_**

***

## 使用示例：

1. 极简

   - 直接使用默认配置进行上传操作

````
<template>
    <naive-upload v-model="fileIds"
                  :api-service="apiService"/>
</template>

<script lang="ts" setup>  
import {reactive} from "vue";
import {NaiveUpload} from 'naive-upload';
import NaiveApiService from "@/api/service/common/NaiveApiService";

//已经上传好的文件id集合
const fileIds = reactive([] as string[]);
const apiService = new NaiveApiService();  
</script>
````

2. 极简（只读模式）

   - 直接使用默认配置进行上传操作
   - 只能查看不能操作，一般用于详情等信息展示页面

````
<template>
    <naive-upload v-model="fileIds"
                  :api-service="apiService"
                  :readonly="true"/>
</template>

<script lang="ts" setup>  
import {reactive} from "vue";
import NaiveUpload from 'naive-upload';
import NaiveApiService from "@/api/service/common/NaiveApiService";

//已经上传好的文件id集合
const fileIds = reactive(['fleId1', 'fleId2', 'fleId3'] as string[]);
const apiService = new NaiveApiService();  
</script>
````

3. 普通

   - 使用指定的上传配置

````
<template>
    <naive-upload v-model="fileIds"
                  :settings="settings"
                  :api-service="apiService"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {NaiveUpload, Settings} from 'naive-upload';
import NaiveApiService from "@/api/service/common/NaiveApiService";


//已经上传好的文件id集合
const fileIds = reactive([] as string[]);
//组件设置（ContentFile替换成要使用的上传配置的编码）
const settings = Settings.defaultWithConfigCode('ContentFile');
const apiService = new NaiveApiService();
</script>
````

1. 进阶（主动处理异常信息，手动控制）

   - 使用指定的上传配置
   - 主动处理异常信息
   - 手动控制上传操作

````
<template>
    <naive-upload v-model="fileIds"
                  :settings="settings"
                  :api-service="apiService"
                  @setOpenApi="setUploadApi"
                  @beforeCheck="handlerBeforeCheck"
                  @afterCheck="handlerAfterCheck"
                  @afterCheckAll="handlerAfterCheckAll"
                  @afterUpload="handlerAfterUpload"
                  @afterUploadAll="handlerAfterUploadAll"
                  @error="handlerError"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {NaiveUpload, Settings} from 'naive-upload';
import NaiveApiService from "@/api/service/common/NaiveApiService";


//已经上传好的文件id集合
const fileIds = reactive([] as string[]);
//组件设置（ContentFile替换成要使用的上传配置的编码）
const settings = Settings.defaultWithConfigCode('ContentFile');
const apiService = new NaiveApiService();

/**
 * 组件开放的接口
 */
let uploadOpenApi = null as IOpenApi;

/**
 * 获取组件开放的接口
 *
 * @param openApi 组件开放的接口
 */
const setUploadApi = (openApi: IOpenApi) => {
  uploadOpenApi = openApi;
}

/**
 * 文件校验前执行
 *
 * @param file 文件
 * @return 是否处理并上传该文件
 */
const handlerBeforeCheck = (file: File): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        console.info(`是否处理此文件：${file.name}`);
        //如果返回false则不会处理和上传此文件
        console.info('处理结果：true');
        resolve(true);
    }
}

/**
 * 文件校验结束后执行
 *
 * @param rawFile 文件
 */
const handlerAfterCheck = (rawFile: RawFile) => {
  // console.debug(rawFile);
}

/**
 * 文件校验全部校验结束后执行
 *
 * @param rawFiles 文件集合
 */
const handlerAfterCheckAll = (rawFiles: RawFile[]) => {
  // console.debug(rawFiles);
}

/**
 * 文件上传后执行
 *
 * @param rawFile 文件
 */
const handlerAfterUpload = (rawFile: RawFile) => {
  // console.debug(rawFile);
}

/**
 * 所有文件上传后执行
 * <p>此方法不会等待</p>
 *
 * @param rawFiles 文件集合
 */
const handlerAfterUploadAll = (rawFiles: RawFile[]) => {
  console.debug('已经上传好的文件id集合', Object.assign({}, fileIds));
}

/**
 * 组件异常
 *
 * @param e 异常
 */
const handlerError = (e: Error) => {
  UploadError.consoleWrite(e);
}
</script>
````
