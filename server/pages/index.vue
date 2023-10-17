<template>
    <div class="flex justify-center">
        <div class="bg-base-200 w-2/3">
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
                    <!-- <img class="h-64" :src="post.source"> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const posts = await $fetch<any>(`${config.public.API}/general/recent/posts`);
</script>