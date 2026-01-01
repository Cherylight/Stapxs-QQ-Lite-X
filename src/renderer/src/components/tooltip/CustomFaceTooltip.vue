<template>
    <img :src="url" :alt="$t('预览图片加载失败')" class="custom-face-tooltip">
</template>

<script setup lang="ts">
const { url } = defineProps<{ url: string }>()
</script>

<style scoped lang="css">
.tooltip-enter-active, .tooltip-leave-active {
    transition: opacity 0.2s, transform 0.2s;
    transform-origin: top;
}
.tooltip-enter-from, .tooltip-leave-to {
    opacity: 0;
    transform: scaleY(0) translate(-50%, calc(-100% - 0.8rem));
}
.tooltip-enter-to, .tooltip-leave-from {
    opacity: 1;
    transform: scaleY(1) translate(-50%, calc(-100% - 0.8rem));
}
</style>
