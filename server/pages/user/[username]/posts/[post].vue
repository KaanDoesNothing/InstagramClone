<template>
    <Post :post="post"></Post>
    <div class="hidden">
        <div>
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