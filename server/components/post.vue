<template>
    <div class="flex justify-between p-2">
        <RouterLink :to="`/user/${post.author.username}`" class="flex flex-row">
            <label class="label font-bold text-sm"><img class="w-7 h-7 object-fill rounded-full mr-2" :src="post.author.avatar"> {{ post.author.username }}</label>
        </RouterLink>
        <div>
            <label class="label"><Icon name="ic:round-format-list-bulleted" size="24"></Icon></label>
        </div>
    </div>
    <div>
        <template v-if="!post.source.endsWith('.mp4')">
            <img class="object-contain w-screen" :src="post.source">
        </template>

        <template v-if="post.source.endsWith('.mp4')">
            <video class="object-contain w-screen" :src="post.source" controls/>
        </template>
    </div>
    <div class="flex justify-between p-2">
        <div>
            <button @click="state.likePost(post._id)" class="btn btn-sm btn-ghost"><Icon :name="state.getPostData(post._id)?.liked ? 'ic:outline-favorite' : 'ic:outline-favorite-border'" size="24px"></Icon></button>
            <button class="btn btn-sm btn-ghost"><Icon name="ic:baseline-chat-bubble-outline" size="24px"></Icon></button>
            <button class="btn btn-sm btn-ghost"><Icon name="ic:baseline-send" size="24px"></Icon></button>
        </div>

        <div>
            <button class="btn btn-sm btn-ghost" @click="state.savePost(post._id)"><Icon :name="state.getPostData(post._id)?.saved ? 'ic:outline-bookmark' : 'ic:outline-bookmark-add'" size="24px"></Icon></button>
        </div>
    </div>
    <div class="btn btn-ghost btn-sm justify-normal">
        <label class="label text-sm">
            <label class="text-sm">{{ post.author.username }}</label>
            <label class="text-sm ml-1 font-medium">{{ post.description }}</label>
        </label>
    </div>
</template>

<script setup lang="ts">
    const config = useRuntimeConfig();
    const state = useGlobalState();
    
    const props = defineProps<{
    post?: any
    }>()

    const post = props.post;
</script>