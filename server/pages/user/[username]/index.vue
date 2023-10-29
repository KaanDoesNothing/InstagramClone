<template>
    <div v-if="user">
        <div class="p-5 flex justify-between">
            <div>
                <div class="label flex flex-col">
                    <img class="rounded-full object-cover w-24 h-24 min-w-24 min-h-24 align-middle" :src="user.avatar">
                    <label class="font-light mt-1 f">@{{ user.username }}</label>
                </div>
            </div>
            <div class="label flex flex-row">
                <div class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.posts.length }}</label>
                    <label>Posts</label>
                </div>
                <RouterLink :to="`/user/${user.username}/followers`" class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.followers.length }}</label>
                    <label>Followers</label>
                </RouterLink>
                <RouterLink :to="`/user/${user.username}/following`" class="flex flex-col px-4 text-center">
                    <label class="font-bold">{{ user.following.length }}</label>
                    <label>Following</label>
                </RouterLink>
            </div>
        </div>
        <div class="flex justify-center">
            <label class="label font-bold">{{ user.description }}</label>
        </div>

        <div>
            <div class="btn-group max-w-screen w-screen p-5" v-if="state.isLoggedIn && state.user.username !== user.username">
                <button class="btn btn-sm w-1/2 mx-1" @click="handleFollow" v-if="state.isLoggedIn && state.user.username !== user.username">{{ isFollowing ? "Unfollow" : "Follow" }}</button>
                    <button class="btn btn-sm w-1/2 mx-1">Message</button>
            </div>
        </div>

        <div class="flex justify-center mt-10">
            <div class=" p-5 w-screen md:w-2/3 rounded flex justify-between flex-col">
                <div class="flex justify-between">
                    <label class="text-2xl">Posts</label>
                    <template v-if="state.isLoggedIn && state.user.username === user.username">
                        <RouterLink to="/user/me/posts/create" class="btn btn-ghost btn-sm rounded"><Icon name="ic:outline-add" size="24"></Icon></RouterLink>
                    </template>
                </div>
                

                <div class="flex flex-row mt-5 md:mt-10 justify-center">
                    <div class="grid justify-center grid-cols-4 md:gap-0 md:p-4">
                        <div class="rounded-lg" v-for="post in user.posts">
                            <RouterLink :to="`/user/${user.username}/posts/${post.id}`">
                                <template v-if="!post.source.endsWith('.mp4')">
                                    <img class="md:h-60 md:w-60 object-cover" :src="post.source">
                                </template>

                                <template v-if="post.source.endsWith('.mp4')">
                                    <video class="md:h-60 md:w-60 object-cover" :src="post.source"/>
                                </template>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    </div>

    <Error v-if="!user"></Error>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    const route = useRoute();
    const username = route.params.username as string;
    
    const user = ref();

    user.value = await fetchUser(username);

    const isFollowing = computed(() => {
        if(state.isLoggedIn) {
            // console.log(state.user);
            // return false
            return user.value.followers.filter((row: any) => row.author.id === state.user.id).length > 0;
        }
    })

    const handleFollow = async () => {
        if(isFollowing.value) {
            await state.unfollowUser(user.value.username);
        }else if(!isFollowing.value) {
            await state.followUser(user.value.username);
        }

        user.value = await fetchUser(username);
    }
</script>