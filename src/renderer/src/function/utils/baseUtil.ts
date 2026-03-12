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

const queueWaitMap = new Map<string, Promise<any>>()
/**
 * 阻塞式处理相同id的异步请求，直到前一个完成
 * @param promise 当前异步请求
 * @param id id
 * @param timeout 超时
 * @returns
 */
export function queueWait<T>(
    promise: Promise<T>,
    id: string,
    timeout: number = 10_000,
): Promise<T> {
    const selfPromise = new Promise<T>((_resolve, _reject) => {
        // 结束处理
        const end = () => {
            clearTimeout(timeoutId)
        }

        const resolve = (value: T) => {
            _resolve(value)
            end()
        }
        const reject = (reason: any) => {
            _reject(reason)
            end()
        }

        // 创建超时处理
        const timeoutId = setTimeout(() => {
            reject(new Error('处理超时'))
        }, timeout)

        // 执行当前 promise 的函数
        const executePromise = async () => {
            try {
                resolve(await promise)
            } catch (error) {
                reject(error)
            }
        }

        // 执行
        const prePromise = queueWaitMap.get(id)
        if (prePromise) prePromise.finally(executePromise)
        else executePromise()
    })
    queueWaitMap.set(id, selfPromise)

    return selfPromise
}

export class TimeoutSet<T> {
    private readonly data: Map<T, number> = new Map()
    private readonly timeout: number

    constructor(timeout: number = 600) {
        this.timeout = timeout
    }

    add(item: T): void {
        if (this.data.has(item)) {
            throw new Error(`${item}重复存在`)
        }
        const rm = setTimeout(() => {
            this.data.delete(item)
        }, this.timeout)
        this.data.set(item, rm as unknown as number)
    }

    has(item: T): boolean {
        return this.data.has(item)
    }

    delete(item: T): boolean {
        if (!this.data.has(item)) return false
        clearTimeout(this.data.get(item) as unknown as number)
        return this.data.delete(item)
    }

    get length(): number {
        return this.data.size
    }
}

/**
 * 限制长度的通道
 */
export class Channel<T> {
    private data: T[] = []
    private readonly size: number
    constructor(size: number = 10) {
        this.size = size
    }
    push(item: T): void {
        this.data.push(item)
        if (this.data.length > this.size) this.data.shift()
    }
    async pop(timeout: number = 5): Promise<T | undefined> {
        let intervalId: ReturnType<typeof setInterval>
        let timeoutId: ReturnType<typeof setTimeout>
        return new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                clearInterval(intervalId)
                resolve(undefined)
            }, timeout * 1000)
            intervalId = setInterval(() => {
                if (this.data.length > 0) {
                    clearTimeout(timeoutId)
                    clearInterval(intervalId)
                    resolve(this.data.shift())
                }
            }, 100)
        })
    }
    clear(): void {
        this.data = []
    }
    get length(): number {
        return this.data.length
    }
    get maxLength(): number {
        return this.size
    }
}

export class URL {
    // SSL白名单,这些协议一定不是SSL协议,其他的看是不是s结尾,是的话就是采用ssl
    private static readonly SSL_WHITE_LIST = new Set<string>(['ws'])
    private _protocol: string = ''
    private _host: string = ''
    private _port: number | null = null
    private _path: string = ''
    private _query: Record<string, string> = {}
    private _hash: string = ''
    private _ssl: boolean = false

    constructor(url: string) {
        this.parse(url)
    }

    private parse(url: string): void {
        // 兼容所有环境的自定义 URL 解析
        // 正则解析协议
        const urlPattern =
            /^(\w+):\/\/([^/?#:]*)(?::(\d+))?([^?#]*)?(?:\?([^#]*))?(?:#(.*))?/
        const match = url.match(urlPattern)
        if (!match) {
            throw new Error(`无效的URL  ${url}`)
        }
        // match[1]: protocol, match[2]: host, match[3]: port, match[4]: path, match[5]: query, match[6]: hash
        this.parseProtocol(match[1] || '')
        this._host = match[2] || ''
        this._port = match[3] ? Number.parseInt(match[3]) : null
        this._path = match[4] || ''
        this._hash = match[6] || ''
        this._query = {}
        if (match[5]) {
            match[5].split('&').forEach((pair) => {
                const [key, value] = pair.split('=')
                if (key)
                    this._query[decodeURIComponent(key)] = value
                        ? decodeURIComponent(value)
                        : ''
            })
        }
    }

    private parseProtocol(originProtocol: string): void {
        const protocol = originProtocol.replace(':', '')
        if (URL.SSL_WHITE_LIST.has(protocol)) {
            this._ssl = false
            this._protocol = protocol
            return
        }

        if (protocol.endsWith('s')) {
            this._ssl = true
            this._protocol = protocol.slice(0, -1)
        } else {
            this._ssl = false
            this._protocol = protocol
        }
    }

    get protocol(): string {
        return this._protocol
    }

    get host(): string {
        return this._host
    }

    get port(): number | null {
        return this._port
    }

    get path(): string {
        return this._path
    }

    get hash(): string {
        return this._hash
    }

    get ssl(): boolean {
        return this._ssl
    }

    get fullUrl(): string {
        let url = `${this._host}`
        if (this._port) url += `:${this._port}`
        url += this._path
        return url
    }
}
