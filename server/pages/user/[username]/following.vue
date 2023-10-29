<template>
    <div>
        <div class="flex justify-center">
            <div class="bg-base-200 p-5 w-2/3 rounded flex justify-between flex-col">
                <div class="bg-base-300 p-2 mt-2 rounded flex flex-row justify-between" v-for="follower in user.following">
                    <div class="flex flex-row">
                        <img class="h-8 rounded-full" :src="follower.target.avatar">
                        <RouterLink class="mx-5" :to="`/user/${follower.target.username}`">{{ follower.target.username }}</RouterLink>
                    </div>
                    <div>
                        <RouterLink class="mx-5 btn btn-sm" :to="`/user/${follower.target.username}`">Profile</RouterLink>
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
    
    const user = ref(await fetchUser(username));
</script>