<template>
    <div>
        <div class="p-0.5 bg-gray-50" :style="{width: `${((position + 1) / user.stories.length) * 100}%` }">

        </div>

        <div class="flex justify-between">
            <RouterLink :to="`/user/${user.username}`" class="flex flex-row">
                <label class="label font-bold text-sm"><img class="w-7 h-7 object-fill rounded-full mr-2" :src="user.avatar"> {{ user.username }}</label>
            </RouterLink>
            <div>
                <label class="label"><Icon name="ic:round-format-list-bulleted" size="24"></Icon></label>
            </div>
        </div>

        <div class="align-middle h-screen w-screen" @click="handlePosition">
            <img class=" min-w-full min-h-full object-contain" :src="user.stories[position].source" v-if="user.stories.length > 0">
        </div>
    </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();

    const route = useRoute();
    const router = useRouter();

    const user = state.user.friends.filter((friend: any) => friend.username === route.params.username)[0];
    const position = ref(0);

    definePageMeta({
        layout: "empty"
    })

    const handlePosition = async () => {
        if(position.value + 1 < user.stories.length) {
            position.value++;
        }else {
            await router.push("/");
        }
    }

    if(user.stories.length === 0) router.back();
</script>