<template>
    <Storybar></Storybar>
    <div class="flex mt-2 flex-col">
        <div v-for="post in posts.filter((post: any) => post.author)" class="min-w-screen">
            <div class="flex justify-between p-2">
                <RouterLink :to="`/user/${post.author.username}`" class="flex flex-row">
                    <label class="label font-bold text-sm"><img class="w-7 h-7 object-fill rounded-full mr-2" :src="post.author.avatar"> {{ post.author.username }}</label>
                </RouterLink>
                <div>
                    <label class="label"><Icon name="ic:round-format-list-bulleted" size="24"></Icon></label>
                </div>
            </div>
            <div>
                <img :src="post.source" class="object-contain w-screen">
            </div>
            <div class="flex justify-between p-2">
                <div>
                    <button class="btn btn-sm btn-ghost"><Icon name="ic:outline-favorite-border" size="24px"></Icon></button>
                    <button class="btn btn-sm btn-ghost"><Icon name="ic:baseline-chat-bubble-outline" size="24px"></Icon></button>
                    <button class="btn btn-sm btn-ghost"><Icon name="ic:baseline-send" size="24px"></Icon></button>
                </div>

                <div>
                    <button class="btn btn-sm btn-ghost"><Icon name="ic:outline-folder-open" size="24px"></Icon></button>
                </div>
            </div>
            <div class="btn btn-ghost btn-sm justify-normal">
                <label class="label text-sm">
                    <label class="text-sm">{{ post.author.username }}</label>
                    <label class="text-sm ml-1 font-medium">{{ post.description }}</label>
                </label>
            </div>
        </div>
        <!-- <div class="bg-base-200 w-2/3">
            <div class="grid justify-center md:grid-cols-4 md:gap-4 md:p-4">
                <div class="m-1 p-2 rounded-lg" v-for="post in posts.data">
                    <div class="card card-compact w-64 bg-base-100 shadow-xl p-4" v-if="post.author">
                        <RouterLink :to="`/user/${post.author.username}`" class="card-title flex flex-row">
                            <img class="h-8 rounded-full" :src="post.author.avatar">
                            <label class="label" to="/">{{ post.author.username }}</label>
                        </RouterLink>
                        <figure>
                            <template v-if="!post.source.endsWith('.mp4')">
                                <img :src="post.source"/>
                            </template>

                            <template v-if="post.source.endsWith('.mp4')">
                                <video :src="post.source" controls/>
                            </template>
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">{{ post.description || "" }}</h2>
                        </div>
                    </div>
                    <img class="h-64" :src="post.source"> -->
                <!-- </div>
            </div> -->
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const posts = (await $fetch<any>(`${config.public.API}/general/recent/posts`)).data;
</script>