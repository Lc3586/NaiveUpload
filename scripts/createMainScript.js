const fs = require('fs');
const path = require('path');


/**
 * 创建入口脚本
 * 
 * @param {string} Vue版本 
 */
const createMainScript = (version) => {
    const dir = path.resolve(__dirname, '..');
    const dest = path.join(dir, 'lib', 'export.js');

    //删除已存在的文件
    try {
        fs.unlink(dest);
    } catch (error) { }

    //创建并写入内容到文件
    fs.writeFile(dest, `export * from './${version}/export.${version}';`, 'utf8', error => {
        if (error)
            console.error(
                `[naive-upload] 创建${dest}失败.`,
                error);
        else
            console.log(`[naive-upload] 已创建${dest}.`);
    });
}

module.exports.createMainScript = createMainScript;