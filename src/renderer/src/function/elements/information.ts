import { AdapterInterface, LoginInfo } from '../adapter/interface'
import { SessionBox } from '../model/box'
import { ForwardSeg } from '../model/seg'
import { Session } from '../model/session'
import { User } from '../model/user'
import { AppConfig } from '../option/option'

export interface RunTimeDataElem {
    sysConfig: AppConfig
    connectInfo: {address: string | undefined, token: string | undefined}
    loginInfo: LoginInfo,
    selfInfo?: User
    systemNoticesList?: { [key: string]: any }
    tags: {
        firstLoad: boolean
        canCors: boolean
        sw?: boolean
        darkMode: boolean
        vibrancy: boolean
        noLogin: boolean    // 一次都没有登陆
        dev: boolean
    }
    cm: number
    watch: {
        // PS: 一些给监听器捕捉用的数据
        backTimes: number
    }
    mergeMsgStack: ForwardSeg[]
    stickerCache?: any[]
    nowChat?: Session
    nowBox?: SessionBox  // 当前的会话盒子
    nowAdapter?: AdapterInterface // 当前适配器
    defaultColorMode: 'light' | 'dark',
    repoName: string
}

export interface MenuEventData {
    x: number
    y: number
    target: HTMLElement
}

export interface MenuEventData {
    x: number
    y: number
    target: HTMLElement
}

export interface DnsElem {
    value: string
    type: 'A' | 'AAAA' | 'CNAME' | 'SRV' | 'TXT' | 'OTHER'
}
