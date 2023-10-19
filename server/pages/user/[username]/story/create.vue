<template>
    <div>
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
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const state = useGlobalState();
    const router = useRouter();
    
    const isUpload = ref(false);
    const img = ref();
    const caption = ref("");

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

        router.back();
    }
</script>