const path = require('path');
const { copyDir } = require('../scripts/copy');


// 复制图标文件到打包目录
const dir = path.resolve(__dirname, '..');
const srcDir = path.join(dir, 'src', 'assets', 'filetypes');
const destDir = path.join(dir, 'dist', 'filetypes');
copyDir(srcDir, destDir);