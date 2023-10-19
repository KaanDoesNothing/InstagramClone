<template>
   <div>
        <div v-if="state.isLoggedIn" class="flex overflow-x-scroll">
            <div class="p-2 m-1 text-center">
                <img :src="state.user.avatar" class="rounded-full w-16 h-16 min-w-16 min-h-16 object-fill border-2">
                <button class="label text-sm" @click="isCreate = true;">Add Story</button>
            </div>

            <RouterLink :to="`/user/${friend.username}/story`" v-for="friend in state.user.friends" class="p-2 m-1 text-center">
                <img :src="friend.avatar" class="rounded-full w-16 h-16 min-w-16 min-h-16 object-fill border-2" :class="{'border-purple-800': friend.stories.length > 0}">
                <label class="label text-sm">{{ friend.username }}</label>
            </RouterLink>
        </div>

        <dialog id="showStory" class="modal" :class="{'modal-open': isViewing}">
            <div class="modal-box bg-base-300 rounded-lg flex justify-center flex-col">
                <img class=" min-w-full min-h-full" :src="userStories[viewingPosition].source" v-if="userStories.length > 0">
                <div class="btn-group flex justify-center mt-5">
                    {{ viewingPosition }}
                    <button class="btn btn-sm" @click="viewingPosition--">Previous</button>
                    <button class="btn btn-sm" @click="viewingPosition++">Next</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="isViewing = false;">close</button>
            </form>
        </dialog>

        <dialog id="createStory" class="modal" :class="{'modal-open': isCreate}">
            <div class="modal-box bg-base-300 rounded-lg flex justify-center">
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
                    <!-- <textarea class="textarea textarea-bordered h-24" placeholder="Caption"></textarea> -->
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="isCreate = false;">close</button>
            </form>
        </dialog>
   </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const state = useGlobalState();

    const img = ref();
    const caption = ref("");
    const isUpload = ref(false);
    const viewingUser = ref("");
    const viewingPosition = ref(0);
    const isViewing = ref(false);
    const isCreate = ref(false);
    const userStories = ref<any>([]);

    const handleView = (username: string) => {
        isViewing.value = true;
        viewingUser.value = username;
        viewingPosition.value = 0;

        userStories.value = state.user.friends.filter((friend: any) => friend.username === username)[0].stories;
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

        const res = await $fetch<any>(`${config.public.API}/user/story`, {body: {source: img.value, content: caption.value}, headers: {Authorization: state.token as string}, method: "PUT"});
        await state.fetchUser();

        isCreate.value = false;
    }
</script>