<template>
    <Html data-theme="black">
        <Head>
            <Title>InstaPost</Title>
        </Head>
    </Html>
    
    <div class="text-white">
        <slot></slot> 
    </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    await state.authenticate();
</script>