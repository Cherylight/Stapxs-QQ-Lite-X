<!--
 * @FileDescription: 群成员消息悬浮窗
 * @Author: Mr.Lee
 * @Date: 2025/09/01
 *        2026/01/01
 * @Version: 1.0
 *           2.0 重构为提示工具组件
-->
<template>
    <div v-if="user" class="member-info ss-card"
        :class="{
            leave: typeof user === 'number' || user instanceof Member && user.leave,
        }">
        <!-- 群成员 -->
        <template v-if="user instanceof Member">
            <div>
                <img :src="user.face" :alt="user.name">
                <div>
                    <span name="id">{{ user.user_id }}</span>
                    <div>
                        <a>{{ user.name }}</a>
                        <span v-user-role="user.role">
                            <template v-if="user.role === Role.Bot">
                                <font-awesome-icon :icon="['fas', 'robot']" />
                            </template>
                            <template v-if="user.level">
                                {{ 'Lv.' + user.level }}
                            </template>
                            <template v-if="user.title">
                                {{ user.title.replace(/[\u202A-\u202E\u2066-\u2069]/g, '') }}
                            </template>
                        </span>
                    </div>
                </div>
            </div>
            <div class="member">
                <div>
                    <template v-if="user.banTime">
                        <font-awesome-icon style="color: var(--color-red)" :icon="['fas', 'fa-volume-mute']" />
                        {{ $t('禁言中') }}
                    </template>
                </div>
                <span v-if="user.join_time">
                    {{
                        $t('{time} 加入群聊', {
                            time: user.join_time.format(
                                'year',
                                'day',
                            ),
                        })
                    }}
                </span>
            </div>
        </template>
        <!-- 已退群 -->
        <template v-else-if="typeof user === 'number'">
            <div>
                <img :src="'https://q1.qlogo.cn/g?b=qq&s=0&nk=' + user" :alt="String(user)">
                <div>
                    <span name="id">{{ user }}</span>
                    <div>
                        <a>{{ $t('已退群( {userId} )', { userId: user }) }}</a>
                    </div>
                </div>
            </div>
        </template>
        <!-- 好友 -->
        <template v-else-if="user instanceof User">
            <div>
                <img :src="user.face" :alt="user.name">
                <div>
                    <span name="id">{{ user.user_id }}</span>
                    <div>
                        <a>{{ user.name }}</a>
                        <div>
                            等级: <span>Lv {{ user.level }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="user.longNick" class="user">
                {{ user.longNick }}
            </div>
        </template>
        <!-- 保底的 -->
        <template v-else>
            <div>
                <img :src="user.face" :alt="user.name">
                <div>
                    <span name="id">{{ user.user_id }}</span>
                    <div>
                        <a>{{ user.name }}</a>
                        <div>
                            <span v-if="user.role === Role.Owner">
                                {{ $t('群主') }}
                            </span>
                            <span v-else-if="user.role === Role.Admin">
                                {{ $t('管理员') }}
                            </span>
                            <span v-else-if="user.role === Role.Bot">
                                {{ $t('机器人') }}
                            </span>
                            <span v-if="user.level">Lv {{ user.level }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Role } from '@renderer/function/adapter/enmu'
import { IUser, Member, User } from '@renderer/function/model/user'
import { vUserRole } from '@renderer/function/utils/vcmd'

const { user } = defineProps<{
    user: IUser | number
}>()
</script>

<style lang="css" scoped>
.tooltip-enter-active, .tooltip-leave-active {
    transition: opacity 0.2s, transform 0.2s;
    transform-origin: top;
}
.tooltip-enter-from, .tooltip-leave-to {
    opacity: 0;
    transform: scaleY(0) translate(-20px, calc(-100% - 0.8rem));
}
.tooltip-enter-to, .tooltip-leave-from {
    opacity: 1;
    transform: scaleY(1) translate(-20px, calc(-100% - 0.8rem));
}
</style>
