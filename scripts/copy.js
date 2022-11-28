const fs = require('fs');
const path = require('path');


const version = process.version;
let matchs = version.match(/v(.*?)\.(.*?)\.(.*?)/);
// nodejs为v16.7.0及以上版本才有cp方法
let hasCpMethod = matchs && matchs.groups && matchs.groups.length > 2 && matchs.groups[1] >= 16 && matchs.groups[2] >= 7;
// nodejs为v8.5.0及以上版本才有copyFile方法
let hasCpFileMethod = matchs && matchs.groups && matchs.groups.length > 2 && matchs.groups[1] >= 8 && matchs.groups[2] >= 5;

/**
 * 复制文件夹
 * 
 * @param {string} src 原目录
 * @param {string} dest 目标目录
 */
const copyDir = (src, dest) => {
    if (hasCpMethod) {
        // v16.7.0版本开始新增fs.cp()方法
        fs.cp(src, dest, { recursive: true }, error => {
            if (error)
                console.error(
                    `[naive-upload] 复制${src}到${dest}失败.`,
                    error);
            else
                console.log(`[naive-upload] 已复制${src}到${dest}.`);
        });
        return;
    }

    fs.access(dest, (errorAccess) => {
        if (errorAccess)
            // 创建不存在的目录
            fs.mkdir(dest, { recursive: true }, errorMkDir => {
                if (errorMkDir)
                    console.error(
                        `[naive-upload] 创建${dest}失败.`,
                        errorMkDir);
            });

        fs.readdir(src, (errorReadDir, list) => {
            if (errorReadDir) {
                console.error(
                    `[naive-upload] 读取${src}失败.`,
                    errorReadDir);
                return;
            }

            list.forEach((item) => {
                const srcItem = path.resolve(src, item);

                fs.stat(srcItem, (errorStat, stat) => {
                    if (errorStat) {
                        console.error(
                            `[naive-upload] 检查${srcItem}失败.`,
                            errorStat);
                    } else {
                        const destItem = path.resolve(dest, item);

                        if (stat.isFile()) {
                            // 如果是文件，则直接复制
                            copyFile(srcItem, destItem);
                        } else if (stat.isDirectory()) {
                            // 如果是目录，则进行递归处理
                            copyDir(srcItem, destItem);
                        }
                    }
                });
            });
        });
    });
};

/**
 * 复制文件
 * 
 * @param {string} src 原文件
 * @param {string} dest 目标文件
 */
const copyFile = (src, dest) => {
    //删除已存在的文件
    try {
        fs.unlink(dest);
    } catch (error) { }

    const callback = (error) => {
        if (error)
            console.error(
                `[naive-upload] 复制${src}到${dest}失败.`,
                error);
        else
            console.log(`[naive-upload] 已复制${src}到${dest}.`);
    };

    if (hasCpMethod) {
        // v16.7.0版本开始新增fs.cp()方法
        fs.cp(src, dest, callback);
        return;
    } else if (hasCpFileMethod) {
        fs.copyFile(src, dest, callback);
        return;
    }

    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
    callback();
};

module.exports.copyDir = copyDir;
module.exports.copyFile = copyFile;