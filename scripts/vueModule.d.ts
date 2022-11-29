/**
 * 加载Vue模块
 *
 * @returns
 */
export function loadModule(): typeof import("vue") | undefined;
/**
 * 复制构建文件到指定版本的目录
 *
 * @param {string} Vue版本
 */
export function copyToVersionDir(version: any): void;
