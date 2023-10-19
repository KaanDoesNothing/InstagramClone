<template>
    <div>
        <div class="p-5 flex justify-between">
            <div>
                <div class="label flex flex-col">
                    <img class="rounded-full w-24 h-24 align-middle" :src="user.avatar">
                    <label class="font-light mt-1 f">@{{ user.username }}</label>
                </div>
            </div>
            <div class="label flex flex-row">
                <div class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.posts.length }}</label>
                    <label>Posts</label>
                </div>
                <div class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.followers.length }}</label>
                    <label>Followers</label>
                </div>
                <div class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.following.length }}</label>
                    <label>Following</label>
                </div>
            </div>
        </div>

        <div>
            <div class="btn-group max-w-screen w-screen p-5">
                <template v-if="state.isLoggedIn">
                    <button class="btn btn-sm w-1/2 mx-1" @click="handleFollow" v-if="state.isLoggedIn && state.user.username !== user.username">{{ isFollowing ? "Unfollow" : "Follow" }}</button>
                    <button class="btn btn-sm w-1/2 mx-1">Message</button>
                </template>
            </div>
        </div>

        <div class="flex justify-center mt-10">
            <div class=" p-5 w-screen md:w-2/3 rounded flex justify-between flex-col">
                <div class="flex justify-between">
                    <label class="text-2xl">Posts</label>
                    <template v-if="state.isLoggedIn && state.user.username === user.username">
                        <button class="btn btn-ghost btn-sm rounded" v-if="viewType === 'posts'" @click="viewType = 'create'"><Icon name="ic:outline-add" size="24"></Icon></button>
                        <button class="btn btn-neutral btn-sm rounded" v-if="viewType === 'create'" @click="viewType = 'posts'">Go Back</button>
                    </template>
                </div>
                

                <div class="flex flex-row mt-5 md:mt-10 justify-center">
                    <div class="grid justify-center grid-cols-4 md:gap-0 md:p-4">
                        <div class="rounded-lg" v-for="post in user.posts" v-if="viewType === 'posts'">
                            <RouterLink :to="`/user/${user.username}/posts/${post._id}`">
                                <template v-if="!post.source.endsWith('.mp4')">
                                    <img class="md:h-60 md:w-60 object-cover" :src="post.source">
                                </template>

                                <template v-if="post.source.endsWith('.mp4')">
                                    <video class="md:h-60 md:w-60 object-cover" :src="post.source"/>
                                </template>
                            </RouterLink>
                        </div>
                    </div>

                    <div class="bg-base-300 w-2/3 flex justify-center" v-if="viewType === 'create'">
                        <form class="p-5" @submit.prevent="handlePost">
                            <img :src="img" v-if="img" class="mb-5 w-64">
                            <div class="form-control w-full">
                                <input type="file" class="file-input w-full max-w-xs" @change="handlePreview"/>
                            </div>

                            <div class="flex flex-col">
                                <label class="label">Caption</label>
                                <textarea class="textarea p-1 mt-2 w-full" style="resize: none;" v-model="caption"></textarea>
                            </div>

                            <button class="btn btn-sm w-full mt-2 btn-load" type="submit">
                                <span class="loading loading-spinner" v-if="isUpload"></span>
                                <template v-if="!isUpload">Post</template>
                            </button>
                        </form>
                    </div>
                </div>
            </div>      
        </div>
    </div>

    <div class="p-5 md:p-0 hidden">
        <div class="flex justify-center">
            <div class="bg-base-200 flex-col md:flex-row p-5 md:w-2/3 rounded flex justify-between">
                <div class="flex md:flex-row">
                    <img class="rounded-full w-32 h-32" :src="user.avatar">
                    <div class="px-5">
                        <div class="flex flex-col">
                            <div class="flex flex-row">
                                <label class="text-2xl">@{{ user.username }}</label>
                                <button class="mx-2 font-bold btn btn-neutral btn-sm rounded" @click="handleFollow" v-if="state.isLoggedIn && state.user.username !== user.username">{{ isFollowing ? "Unfollow" : "Follow" }}</button>
                            </div>

                            <label class="label">{{ user.description }}</label>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="stats sm:stats-vertical shadow bg-base-200">
                        <RouterLink class="stat" :to="`/user/${user.username}/followers`">
                            <div class="stat-title">Followers</div>
                            <div class="stat-value">{{ user.followers.length }}</div>
                        </RouterLink>
                        <RouterLink class="stat" :to="`/user/${user.username}/following`">
                            <div class="stat-title">Following</div>
                            <div class="stat-value">{{ user.following.length }}</div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-10">
            <div class="bg-base-200 p-5 w-screen md:w-2/3 rounded flex justify-between flex-col">
                <div class="flex justify-between">
                    <label class="text-2xl">Posts</label>
                    <template v-if="state.isLoggedIn && state.user.username === user.username">
                        <button class="btn btn-neutral btn-sm rounded" v-if="viewType === 'posts'" @click="viewType = 'create'">Create post</button>
                        <button class="btn btn-neutral btn-sm rounded" v-if="viewType === 'create'" @click="viewType = 'posts'">Go Back</button>
                    </template>
                </div>
                

                <div class="flex flex-row mt-5 md:mt-10 justify-center">
                    <div class="grid justify-center grid-cols-4 md:gap-0 md:p-4">
                        <div class="rounded-lg" v-for="post in user.posts" v-if="viewType === 'posts'">
                            <RouterLink :to="`/user/${user.username}/posts/${post._id}`">
                                <template v-if="!post.source.endsWith('.mp4')">
                                    <img class="md:h-60 md:w-60 object-cover" :src="post.source">
                                </template>

                                <template v-if="post.source.endsWith('.mp4')">
                                    <video class="md:h-60 md:w-60 object-cover" :src="post.source"/>
                                </template>
                            </RouterLink>
                        </div>
                    </div>

                    <div class="bg-base-300 w-2/3 flex justify-center" v-if="viewType === 'create'">
                        <form class="p-5" @submit.prevent="handlePost">
                            <img :src="img" v-if="img" class="mb-5 w-64">
                            <div class="form-control w-full">
                                <input type="file" class="file-input w-full max-w-xs" @change="handlePreview"/>
                            </div>

                            <div class="flex flex-col">
                                <label class="label">Caption</label>
                                <textarea class="textarea p-1 mt-2 w-full" style="resize: none;" v-model="caption"></textarea>
                            </div>

                            <button class="btn btn-sm w-full mt-2 btn-load" type="submit">
                                <span class="loading loading-spinner" v-if="isUpload"></span>
                                <template v-if="!isUpload">Post</template>
                            </button>
                        </form>
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
    
    const user = ref<any>();
    const isFollowing = ref(false);
    const viewType = ref<"posts" | "create">("posts");
    const img = ref();
    const caption = ref("");
    const isUpload = ref(false);

    const fetchInformation = async () => {
        user.value = await fetchUser(username);

        if(state.isLoggedIn) isFollowing.value = user.value.followers.filter((row: any) => row.from._id === state.user._id).length > 0;
    }

    const handleFollow = async () => {
        if(isFollowing.value) {
            const res = await $fetch(`${config.public.API}/user/${user.value.username}/follow`, {headers: {Authorization: state.token as string}, method: "DELETE"});
        }else {
            const res = await $fetch(`${config.public.API}/user/${user.value.username}/follow`, {headers: {Authorization: state.token as string}, method: "PUT"});
        }

        await state.fetchUser();
        await fetchInformation();
    }

    const handlePreview = async (e: any) => {
        console.log(e.target.files);
        const form = new FormData();
        form.append("upload", e.target.files[0]);

        isUpload.value = true;
        const res = await $fetch<any>("https://cdn.kaanlikescoding.me/api/upload/file", {method: "POST", body: form, params: {key: "instapost"}});

        if(res.file) img.value = res.file.url.replace("/view/", "/");

        isUpload.value = false;
    }

    const handlePost = async () => {
        if(!img.value || isUpload.value) return;

        const res = await $fetch<any>(`${config.public.API}/user/post`, {body: {source: img.value, content: caption.value}, headers: {Authorization: state.token as string}, method: "PUT"});
        if(res.data) viewType.value = "posts";
        await fetchInformation();
    }

    await fetchInformation();
</script>