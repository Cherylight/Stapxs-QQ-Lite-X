<template>
    <Teleport to="body">
        <TransitionGroup name="tooltip">
            <Tooltip v-for="data in tooltipList" :key="data.id"
                v-bind="data" />
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
import { tooltipList } from '@renderer/function/tooltip'
import Tooltip from './Tooltip.vue'
</script>
