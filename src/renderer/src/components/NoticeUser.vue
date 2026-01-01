<template>
    <a v-if="user.user_id === runtimeData.loginInfo.uin" class="me">
        {{ $t('你') }}
    </a>
    <a v-else v-user-tooltip="user">
        {{ user.name }}
    </a>
</template>

<script setup lang="ts">
import { IUser } from '@renderer/function/model/user'
import { runtimeData } from '@renderer/function/msg'
import { vUserTooltip } from '@renderer/function/tooltip'

const { user } = defineProps<{
    user: IUser
}>()
</script>
