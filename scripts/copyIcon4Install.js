const path = require('path');
const { copyDir } = require('./copy');


/**
 * 复制图标文件到项目目录
 */
const copyIcon = () => {
    const dir = path.resolve(__dirname, '..');
    const srcDir = path.join(dir, 'dist', 'filetypes');
    const destDir = path.join(dir, 'public', 'filetypes');
    copyDir(srcDir, destDir);
};

module.exports.copyIcon = copyIcon;