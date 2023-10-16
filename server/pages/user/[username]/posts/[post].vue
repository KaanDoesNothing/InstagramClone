<template>
    <div>
        <div class="flex justify-center">
            <div class="bg-base-200 p-5 rounded flex justify-between flex-col">
                <div class="rounded flex flex-col">
                    <RouterLink :to="`/user/${post.author.username}`" class="card-title flex flex-row">
                        <img class="h-8 rounded-full" :src="post.author.avatar">
                        <label class="label" to="/">{{ post.author.username }}</label>
                    </RouterLink>

                    <label class="label">{{  }}</label>
                    <template v-if="!post.source.endsWith('.mp4')">
                        <img :src="post.source">
                    </template>

                    <template v-if="post.source.endsWith('.mp4')">
                        <video :src="post.source" controls/>
                    </template>

                    <div class="flex justify-center">
                        <label class="label">{{ post.description }}</label>
                    </div>
                    
                    <div class="flex justify-center mt-5 hidden">
                        <div class="btn-group">
                            <button class="btn">Like</button>
                            <!-- <button class="btn">Comment</button> -->
                            <button class="btn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    const route = useRoute();
    const username = route.params.username as string;
    
    const user = ref(await fetchUser({username, token: state.token}));

    const post = user.value.posts.filter((post: any) => post._id === route.params.post as string)[0];
</script>