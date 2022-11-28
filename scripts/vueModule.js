const path = require('path');
const { copyDir } = require('./copy');


/**
 * 加载Vue模块
 * 
 * @returns 
 */
const loadModule = () => {
  try {
    return require("vue");
  } catch (error) {
    console.error(
      `[naive-upload] 加载vue失败.`,
      error
    )
    return undefined;
  }
};

/**
 * 复制构建文件到指定版本的目录
 * 
 * @param {string} Vue版本 
 */
const copyToVersionDir = (version) => {
  //根目录
  const dir = path.resolve(__dirname, '..');
  const distDir = path.join(dir, 'dist');
  const libDir = path.join(dir, 'lib');

  const distVDir = path.join(distDir, version);
  const libVDir = path.join(libDir, version);

  copyDir(distVDir, distDir);
  copyDir(libVDir, libDir);
};

module.exports.loadModule = loadModule;
module.exports.copyToVersionDir = copyToVersionDir;
