<template>
    <div>
        <div class="flex justify-center">
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between">
                <div class="flex flex-row">
                    <img class="rounded w-32 h-32" :src="user.avatar">
                    <div class="px-5">
                        <label class="text-2xl">@{{ user.username }}</label>
                        <button class="text-2xl px-2 font-bold" @click="handleFollow" v-if="state.user.username !== user.username">{{ isFollowing ? "-" : "+" }}</button>
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
    
    const user = ref<any>();
    const isFollowing = ref(false);
    const viewType = ref("main");

    const fetchInformation = async () => {
        user.value = await fetchUser({username, token: state.token});

        isFollowing.value = user.value.followers.filter((row: any) => row.from._id === state.user._id).length > 0;
    }

    const handleFollow = async () => {
        if(isFollowing.value) {
            const res = await $fetch("/api/actions/unfollow", {body: {token: state.token, target: user.value.username}, method: "POST"});
        }else {
            const res = await $fetch("/api/actions/follow", {body: {token: state.token, target: user.value.username}, method: "POST"});
        }

        await fetchInformation();
    }

    await fetchInformation();
</script>