<template>
    <slot></slot>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    await state.authenticate();
</script>