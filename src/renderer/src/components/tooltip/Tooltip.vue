<template>
    <component :is="compData.comp"
        class="tooltip"
        ref="body"
        :style="{ position: 'absolute', left: posInfo.x + 'px', top: posInfo.y + 'px' }"
        v-bind="compData.props"
        v-model="compData.model"
        v-on="compData.emit || {}" />
</template>

<script setup lang="ts" generic="T extends Component">
import { TooltipInfo } from '@renderer/function/tooltip';
import { type Component, onMounted, shallowReactive, useTemplateRef } from 'vue';

const { compData, pos } = defineProps<TooltipInfo<T>>()

const body = useTemplateRef('body')

const posInfo = shallowReactive({
    x: 0,
    y: 0,
})

onMounted(async ()=>{
    if (!body.value) return
    posInfo.x = pos.x
    posInfo.y = pos.y
    // 高度
    const el = (body.value as any).$el as HTMLElement
    console.log(el)
    console.log('panHeight', el.clientHeight, 'panWidth', el.clientWidth)
    console.log('pos', pos)
    const panHeight = el.clientHeight
    if (pos.y < panHeight + 20) {
        console.log('强制处理上')
        posInfo.y = panHeight + 20
    }
    // 宽度
    const menuWidth = el.clientWidth
    const bodyWidth = document.body.clientWidth
    if (pos.x + menuWidth > bodyWidth - 20) {
        console.log('强制处理右')
        posInfo.x = bodyWidth - menuWidth - 10
    }
})
</script>

<style>
.tooltip {
    z-index: 50;
    transition: left 0s, top 0s;
}
</style>
