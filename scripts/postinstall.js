const { copyToVersionDir, loadModule } = require('./vueModule');
const { copyIcon } = require('./copyIcon4Install');


const Vue = loadModule('vue');

if (!Vue || typeof Vue.version !== 'string') {
  console.warn(
    '[naive-upload] 未找到Vue. 请执行命令"npm install vue"安装Vue.'
  )
} else if (Vue.version.startsWith('2.')) {
  copyToVersionDir('vue2');
} else if (Vue.version.startsWith('3.')) {
  copyToVersionDir('vue3');
} else {
  console.warn(
    `[naive-upload] 不支持v${Vue.version}版本的Vue.`
  )
}

//复制图标文件
copyIcon();