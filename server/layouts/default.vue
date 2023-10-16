<template>
    <Html data-theme="black">
        <Head>
            <Title>InstaPost</Title>
        </Head>
    </Html>
    <slot></slot>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    await state.authenticate();
</script>