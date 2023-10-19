<template>
   <div>
        <div v-if="state.isLoggedIn" class="flex overflow-x-scroll">
            <div class="p-2 m-1 text-center">
                <RouterLink :to="`/user/${state.user.username}/story`"><img :src="state.user.avatar" class="rounded-full w-16 h-16 min-w-16 min-h-16 object-fill border-2"></RouterLink>
                <RouterLink :to="`/user/${state.user.username}/story/create`" class="label text-sm">Add Story</RouterLink>
            </div>

            <RouterLink :to="`/user/${friend.username}/story`" v-for="friend in state.user.friends" class="p-2 m-1 text-center">
                <img :src="friend.avatar" class="rounded-full w-16 h-16 min-w-16 min-h-16 object-fill border-2" :class="{'border-purple-800': friend.stories.length > 0}">
                <label class="label text-sm">{{ friend.username }}</label>
            </RouterLink>
        </div>
   </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();
</script>