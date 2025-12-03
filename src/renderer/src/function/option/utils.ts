
function spaceCfgs(): {_version: number} {
    const OPTION_VERSION = 2
    return { _version: OPTION_VERSION }
}

/**
 * 加载所有配置项
 */
export async function loadAllOptions(): Promise<Record<string, any>> {
    const backend = await import('@renderer/runtime/backend').then(mod => mod.backend)
    let json: string | null
    if ('electron' === backend.type) {
        json = backend.callSync('opt:get', 'options')
    } else {
        json = localStorage.getItem('options')
    }
    if (!json) return spaceCfgs()
    return JSON.parse(json)
}

/**
 * 保存所有配置项
 * @param data
 */
export async function saveAllOptions(data: Record<string, any>): Promise<void> {
    const backend = await import('@renderer/runtime/backend').then(mod => mod.backend)
    const json = JSON.stringify(data)
    if ('electron' === backend.type) {
        backend.callSync('opt:store', {options: json})
    } else {
        localStorage.setItem('options', json)
    }
}
