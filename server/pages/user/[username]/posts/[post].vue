<template>
    <div>
        <div class="flex justify-center flex-col">
            <div class="bg-base-200 min-w-full min-h-full p-5 rounded flex justify-between flex-col">
                <div class="rounded flex flex-col">
                    <RouterLink :to="`/user/${user.username}`" class="card-title flex flex-row">
                        <img class="h-8 rounded-full" :src="user.avatar">
                        <label class="label">{{ user.username }}</label>
                    </RouterLink>

                    <label class="label text-xl font-bold">{{ post.description }}</label>
                    <template v-if="!post.source.endsWith('.mp4')">
                        <img :src="post.source">
                    </template>

                    <template v-if="post.source.endsWith('.mp4')">
                        <video :src="post.source" controls/>
                    </template>
                    
                    <!-- <div class="flex justify-center mt-5">
                        <div class="btn-group">
                            <button class="btn">Like</button>
                            <button class="btn">Save</button>
                        </div>
                    </div> -->
                </div>
            </div>

            <div class="bg-base-200 min-w-full min-h-full p-5 mt-5 rounded flex justify-between flex-col">
                <label class="text-xl">Comments</label>

                <div>
                    <div class="flex flex-row mt-2 mb-1" v-if="state.isLoggedIn">
                        <input class="input input-sm input-bordered w-full max-w-xs" v-model="content">
                        <button class="btn btn-sm mx-1" @click="handleComment">Send</button>
                    </div>


                    <div v-for="comment in comments">
                        <div class="flex flex-between">
                            <label class="label"><label class="font-bold">{{ comment.author.username }}:</label> <label class="mx-1">{{ comment.content }}</label></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const state = useGlobalState();

    const route = useRoute();
    const username = route.params.username as string;
    
    const user = ref(await fetchUser(username));
    const content = ref("");
    const comments = ref([]);

    const post = user.value.posts.filter((post: any) => post._id === route.params.post as string)[0];
    comments.value = (await $fetch<any>(`${config.public.API}/user/${username}/post/${post._id}/comments`)).data;

    const handleComment = async () => {
        const res = await $fetch<any>("/api/actions/post/comment/create", {body: {token: state.token, _id: post._id, content: content.value}, method: "POST"});

        if(res.data) window.location.reload();
    }
</script>