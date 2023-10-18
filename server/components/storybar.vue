<template>
   <div>
        <div v-if="state.isLoggedIn" class="flex overflow-x-scroll">
            <div v-for="following in state.user.following" class="p-2 m-1 text-center">
                <img :src="following.to.avatar" class="rounded-full w-16 h-16 min-w-16 min-h-16 object-fill">
                <label class="label text-sm">{{ following.to.username }}</label>
            </div>
        </div>
   </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();
</script>