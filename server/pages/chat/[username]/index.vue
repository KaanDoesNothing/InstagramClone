<template>
    <div class="p-5 overflow-y-scroll relative h-2/3">
        <div class="p-2 my-2 bg-base-300 rounded-lg" v-for="message in chatMessages">
            <div class="flex">
                <div class="flex flex-row">
                    <label class="label">
                        <img :src="message.from.avatar" class="rounded-full min-h-8 w-8 max-w-8 max-h-8">
                        <label class="mx-2">{{ message.from.username }}</label>
                    </label>
                </div>
                <label class="label">{{ message.content }}</label>
            </div>
        </div>
    </div>

    <div class="flex justify-center">
        <button>Send</button>
    </div>
</template>

<script lang="ts" setup>
    const state = useGlobalState();
    const route = useRoute();

    const chatMessages = ref(await state.fetchChat(route.params.username as string));

</script>