/**
 * @description: 基础工具函数
 * 禁止导入内部模块
 */

let getCmCache: number | undefined
/**
 * 获得1cm的像素点数
 */
export function getCm(): number {
    if (getCmCache) return getCmCache
    const div = document.createElement('div')
    div.style.width = '1cm'
    div.style.visibility = 'hidden'
    document.body.appendChild(div)
    const dpi = div.offsetWidth
    div.remove()
    getCmCache = dpi
    return dpi
}
