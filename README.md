# 初级上传组件（NaiveUpload）

<p align="left">
  <a href="https://www.npmjs.org/package/naive-upload">
    <img src="https://img.shields.io/npm/v/naive-upload.svg">
  </a>
  <a href="https://bundlephobia.com/package/naive-upload@latest">
    <img src="https://img.shields.io/bundlephobia/minzip/naive-upload?style=flat-square">
  </a>
  <a href="https://npmcharts.com/compare/naive-upload?minimal=true">
    <img src="https://img.shields.io/npm/dm/naive-upload.svg">
  </a>
  <br>
  <a href="http://img.badgesize.io/https://unpkg.com/naive-upload/dist/naive-upload.min.js?compression=gzip&label=gzip%20size:%20JS">
    <img src="http://img.badgesize.io/https://unpkg.com/naive-upload/dist/naive-upload.min.js?compression=gzip&label=gzip%20size:%20JS">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/naive-upload/dist/style.css?compression=gzip&label=gzip%20size:%20CSS">
    <img src="http://img.badgesize.io/https://unpkg.com/naive-upload/dist/style.css?compression=gzip&label=gzip%20size:%20CSS">
  </a>
  <a href="https://github.com/Lc3586/NaiveUpload/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-Apache 2.0-green.svg">
  </a>
  <a href="https://996.icu/#/zh_CN">
    <img src="https://img.shields.io/badge/link-996.icu-red.svg">
  </a>
</p>

## 目录（Table of Contents）

- [初级上传组件（NaiveUpload）](#初级上传组件naiveupload)
  - [目录（Table of Contents）](#目录table-of-contents)
  - [概述 Features](#概述-features)
  - [兼容浏览器 Browser Support](#兼容浏览器-browser-support)
  - [安装 Installing](#安装-installing)
    - [包管理器 Package manager](#包管理器-package-manager)
    - [静态资源引入 CDN](#静态资源引入-cdn)
  - [使用示例 Example](#使用示例-example)
  - [贡献者 Contributors](#贡献者-contributors)
  - [开源协议 License](#开源协议-license)

## 概述 Features
  - 基于TS+Vue3.0开发，同时兼容Vue2.0、Vue3.0
  - 支持大文件上传、多文件上传、文件秒传、断点续传，以及文件数量校验、文件大小校验、文件类型校验。
  - <a href="http://www.lctr.online:7000" target="_blank">在线预览链接</a>


## 兼容浏览器 Browser Support

| ![Chrome](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/chrome/chrome_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/firefox/firefox_48x48.png) | ![Safari](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/safari/safari_48x48.png) | ![Opera](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/opera/opera_48x48.png) | ![Edge](https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/edge/edge_48x48.png) |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Chrome                                                                     | Firefox                                                                          | Safari                                          | Opera                                                                                                              | Edge                                                                 |
| Latest ✔                                                                   | Latest ❓                                                                         | Latest ❓                                        | Latest ❓                                                                                                           | Latest ❓                                                             |

## 安装 Installing

### 包管理器 Package manager

使用npm（Using npm）:

```bash
$ npm install naive-upload
```

使用bower（Using bower）:

```bash
$ bower install naive-upload
```

使用yarn（Using yarn）:

```bash
$ yarn add naive-upload
```

使用pnpm（Using pnpm）:

```bash
$ pnpm add naive-upload
```

安装之后导入组件（Once the package is installed, you can import the library using `import` or `require` approach）:

```js
import { NaiveUpload } from 'naive-upload';
import 'naive-upload/dist/style.css';
```

也可以使用默认导出全局安装插件（You can also use the default export, since the named export is just a re-export from the NaiveUploadPlugin factory）:

```js
import { createApp } from 'vue'
import App from './App.vue'
import NaiveUploadPlugin from 'naive-upload';
import 'naive-upload/dist/style.css';

createApp(App).use(NaiveUploadPlugin).mount('#app');
```

使用require导入（If you use `require` for importing）:

```js
const NaiveUploadPlugin = require('naive-upload');
```

在某些环境下也可直接导入commonJS模块包（For cases where something went wrong when trying to import a module into a custom or legacy environment,
you can try importing the module package directly）:

```js
// 如果是vue2环境，替换链接中的vue3为vue2即可
const NaiveUploadPlugin = require('naive-upload/dist/vue3/node/naive-upload.min.cjs'); // node commonJS bundle (ES2017)
```

### 静态资源引入 CDN

使用jsDelivr链接（支持ES5/UMD/浏览器模块）（Using jsDelivr CDN (ES5 UMD browser module)）:

```html
<!-- 如果是vue2环境，替换链接中的vue3为vue2即可 -->
<script src="https://cdn.jsdelivr.net/npm/naive-upload@latest/dist/vue3/naive-upload.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/naive-upload@latest/dist/vue3/style.css">
```

使用unpkg链接（Using unpkg CDN）:

```html
<!-- 如果是vue2环境，替换链接中的vue3为vue2即可 -->
<script src="https://unpkg.com/naive-upload@latest/dist/vue3/naive-upload.min.js"></script>
<link href="https://unpkg.com/naive-upload@latest/dist/vue3/style.css">
```

## 使用示例 Example

1. 极简

   - 直接使用默认配置进行上传操作

```html
<template>
    <naive-upload v-model="fileIds"
                  :api-service="apiService"/>
</template>

<script lang="ts" setup>  
import {reactive} from "vue";
import {NaiveUpload} from 'naive-upload';
import 'naive-upload/dist/style.css';
import NaiveApiService from "@/api/service/common/NaiveApiService";

//已经上传好的文件id集合
const fileIds = reactive([] as string[]);
const apiService = new NaiveApiService();  
</script>
```

1. 极简（只读模式）

   - 直接使用默认配置进行上传操作
   - 只能查看不能操作，一般用于详情等信息展示页面

```html
<template>
    <naive-upload v-model="fileIds"
                  :api-service="apiService"
                  :readonly="true"/>
</template>

<script lang="ts" setup>  
import {reactive} from "vue";
import NaiveUpload from 'naive-upload';
import 'naive-upload/dist/style.css';
import NaiveApiService from "@/api/service/common/NaiveApiService";

//已经上传好的文件id集合
const fileIds = reactive(['fleId1', 'fleId2', 'fleId3'] as string[]);
const apiService = new NaiveApiService();  
</script>
```

3. 普通

   - 使用指定的上传配置

```html
<template>
    <naive-upload v-model="fileIds"
                  :settings="settings"
                  :api-service="apiService"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {NaiveUpload, Settings} from 'naive-upload';
import 'naive-upload/dist/style.css';
import NaiveApiService from "@/api/service/common/NaiveApiService";


//已经上传好的文件id集合
const fileIds = reactive([] as string[]);
//组件设置（ContentFile替换成要使用的上传配置的编码）
const settings = Settings.defaultWithConfigCode('ContentFile');
const apiService = new NaiveApiService();
</script>
```

1. 进阶（主动处理异常信息，手动控制）

   - 使用指定的上传配置
   - 主动处理异常信息
   - 手动控制上传操作

```html
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
import 'naive-upload/dist/style.css';
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
```

## 贡献者 Contributors

<a href="https://github.com/Lc3586/NaiveUpload/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Lc3586/NaiveUpload" />
</a>

## 开源协议 License

[https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)


<p align="right">
  <span>—— LCTR 2022</span>
</p>