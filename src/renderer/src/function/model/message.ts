/*
 * @FileDescription: Message 相关的模型
 * @Author: Mr.Lee
 * @Date: 2025/07/20
 * @Version: 1.0
 * @Description: 直接在消息栏上展示的模型
 */

import { v4 as uuid } from 'uuid'
import { Session } from './session'
import { Time } from './data'
import { shallowRef, ShallowRef } from 'vue'

export abstract class Message {
    /**
     * 消息ID
     * @description 项目内部使用唯一标识符时优先使用这个，不要用message_id
     */
    readonly abstract type: string
    readonly uuid: string = uuid()
    abstract session?: Session
    abstract toMe: boolean
    abstract fromMe: boolean
    time?: Time
    refreshFlag: ShallowRef<number> = shallowRef(0)
    constructor(data: {time?: number}) {
		if (data.time && !isNaN(data.time)) this.time = new Time(data.time)
    }

    abstract get preMsg(): string

    refreshSize() {
        this.refreshFlag.value += 1
    }
}
