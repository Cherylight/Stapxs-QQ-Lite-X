<template>
    <Teleport to="body">
        <TransitionGroup
            name="----not-use-this----"
            @before-enter="(el) => customAnimationName('before-enter')(el)"
            @enter="(el) => customAnimationName('enter')(el)"
            @after-enter="(el) => customAnimationName('after-enter')(el)"
            @enter-cancelled="(el) => customAnimationName('cancel-enter')(el)"
            @before-leave="(el) => customAnimationName('before-leave')(el)"
            @leave="(el) => customAnimationName('leave')(el)"
            @after-leave="(el) => customAnimationName('after-leave')(el)"
            @leave-cancelled="(el) => customAnimationName('cancel-leave')(el)"
        >
            <ContextMenu v-for="value in contextMenus" :key="value.id"
                :id="value.id"
                :x="value.x"
                :y="value.y"
                :template="value.template"
                :args="value.args"
                :controller="value.controller"
                :animationName="value.animationName"
            />
        </TransitionGroup>
    </Teleport>
</template>
<script setup lang="ts">
import { contextMenus } from '@renderer/function/utils/contextMenu'
import ContextMenu from './ContextMenu.vue';

function customAnimationName(state:
    | 'before-enter'
    | 'enter'
    | 'after-enter'
    | 'cancel-enter'
    | 'before-leave'
    | 'leave'
    | 'after-leave'
    | 'cancel-leave'
): (el: Element) => void {
    return (el: Element) => {
        const animationName = (el as any).dataset.animationName
        const getName = (name: string) => {
            return `${animationName}-${name}`
        }
        switch (state) {
            case 'before-enter':
                el.classList.add(getName('enter-from'))
                break
            case 'enter':
                el.classList.remove(getName('enter-from'))
                el.classList.add(getName('enter-to'))
                el.classList.add(getName('enter-active'))
                break
            case 'after-enter':
            case 'cancel-enter':
                el.classList.remove(getName('enter-from'))
                el.classList.remove(getName('enter-to'))
                el.classList.remove(getName('enter-active'))
                break
            case 'before-leave':
                el.classList.add(getName('leave-from'))
                break
            case 'leave':
                el.classList.remove(getName('leave-from'))
                el.classList.remove(getName('leave-to'))
                el.classList.add(getName('leave-active'))
                break
            case 'after-leave':
            case 'cancel-leave':
                el.classList.remove(getName('leave-from'))
                el.classList.remove(getName('leave-to'))
                el.classList.remove(getName('leave-active'))
                break
        }
    }
}
</script>
