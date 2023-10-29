<template>
    <Storybar></Storybar>
    <div class="flex mt-2 flex-col">
        <div v-for="post in state.posts" class="min-w-screen">
            <Post :post="post"></Post>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const state = useGlobalState();
    await state.fetchPosts();
</script>