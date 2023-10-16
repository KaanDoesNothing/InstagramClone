<template>
    <div>
        <div class="flex justify-center">
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between">
                <div class="flex flex-row">
                    <img class="rounded w-32 h-32" :src="user.avatar">
                    <div class="px-5">
                        <label class="text-2xl">@{{ user.username }}</label>
                        <button class="text-2xl px-2 font-bold" @click="handleFollow" v-if="state.user.username !== user.username">{{ user.isFollowing ? "-" : "+" }}</button>
                    </div>
                </div>
                <div>
                    <div class="stats stats-vertical shadow bg-base-200">
                        <div class="stat">
                            <div class="stat-title">Followers</div>
                            <div class="stat-value">{{ user.followers }}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">Following</div>
                            <div class="stat-value">{{ user.following }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-10">
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between flex flex-col">
                <label class="text-2xl">Posts</label>

                <div class="flex flex-row">
                    <div class="m-1 p-2 bg-base-300 rounded-lg" v-for="post in user.posts">
                        <img class="h-64" :src="post.source">
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
    
    const user = (await $fetch<any>(`/api/users/${encodeURIComponent(username)}`, {body: {token: state.token}, method: "POST"})).data;
    // const user = await fetchUser({token: state.token, username: route.params.username as string});

    const handleFollow = async () => {
        if(user.isFollowing) {
            const res = await $fetch("/api/actions/unfollow", {body: {token: state.token, target: user.username}, method: "POST"});
        }else {
            const res = await $fetch("/api/actions/follow", {body: {token: state.token, target: user.username}, method: "POST"});
        }

        reloadNuxtApp({ttl: 0})
    }
</script>