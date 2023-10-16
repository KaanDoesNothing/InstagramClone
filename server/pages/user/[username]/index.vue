<template>
    <div>
        <div class="flex justify-center">
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between">
                <div class="flex flex-row">
                    <img class="rounded w-32 h-32" :src="user.avatar">
                    <div class="px-5">
                        <label class="text-2xl">@{{ user.username }}</label>
                        <button class="mx-2 font-bold btn btn-neutral btn-sm" @click="handleFollow" v-if="state.isLoggedIn && state.user.username !== user.username">{{ isFollowing ? "Unfollow" : "Follow" }}</button>
                    </div>
                </div>
                <div>
                    <div class="stats stats-vertical shadow bg-base-200">
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
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between flex-col">
                <div class="flex justify-between">
                    <label class="text-2xl">Posts</label>
                    <button class="btn btn-neutral btn-sm" v-if="viewType === 'posts'" @click="viewType = 'create'">Create post</button>
                    <button class="btn btn-neutral btn-sm" v-if="viewType === 'create'" @click="viewType = 'posts'">Go Back</button>
                </div>
                

                <div class="flex flex-row mt-10 justify-center">
                    <div class="m-1 p-2 bg-base-300 rounded-lg" v-for="post in user.posts" v-if="viewType === 'posts'">
                        <div class="card card-compact w-64 bg-base-100 shadow-xl">
                            <figure><img :src="post.source"/></figure>
                            <div class="card-body">
                                <h2 class="card-title">{{ post.description || "" }}</h2>
                            </div>
                        </div>
                        <!-- <img class="h-64" :src="post.source"> -->
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

                            <button class="btn btn-sm w-full mt-2" type="submit">Post</button>
                            <!-- <textarea class="textarea textarea-bordered h-24" placeholder="Caption"></textarea> -->
                        </form>
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
    
    const user = ref<any>();
    const isFollowing = ref(false);
    const viewType = ref("posts");
    const img = ref();
    const caption = ref("");

    const fetchInformation = async () => {
        user.value = await fetchUser({username, token: state.token});

        if(state.isLoggedIn) isFollowing.value = user.value.followers.filter((row: any) => row.from._id === state.user._id).length > 0;
    }

    const handleFollow = async () => {
        if(isFollowing.value) {
            const res = await $fetch("/api/actions/unfollow", {body: {token: state.token, target: user.value.username}, method: "POST"});
        }else {
            const res = await $fetch("/api/actions/follow", {body: {token: state.token, target: user.value.username}, method: "POST"});
        }

        await fetchInformation();
    }

    const handlePreview = async (e: any) => {
        console.log(e.target.files);
        const form = new FormData();
        form.append("upload", e.target.files[0]);

        const res = await $fetch<any>("https://cdn.kaanlikescoding.me/api/upload/file", {method: "POST", body: form, params: {key: "instapost"}});

        if(res.file) img.value = res.file.url.replace("/view/", "/");
    }

    const handlePost = async () => {
        if(!img.value) return;

        const res = await $fetch<any>("/api/actions/post/create", {body: {token: state.token, source: img.value, description: caption.value}, method: "POST"});
    }

    await fetchInformation();
</script>