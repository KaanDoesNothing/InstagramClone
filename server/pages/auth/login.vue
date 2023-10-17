<template>
    <div class="flex justify-center">
        <div class="bg-base-200 p-5 w-1/3 rounded">
            <label>Login</label>
            
            <form class="form-control">
                <label class="label">
                    <span class="label-text">Enter your email</span>
                </label>
                <input class="input input-bordered" placeholder="Type here" type="email" v-model="email">

                <label class="label">
                    <span class="label-text">Enter your password</span>
                </label>
                <input class="input input-bordered" placeholder="Type here" type="password" v-model="password">
                <br>
                <button class="btn" type="submit" @click.prevent="handleLogin">Sign in</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    
    const config = useRuntimeConfig();
    const state = useGlobalState();

    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
        const res = await $fetch<any>(`${config.public.API}/auth/login`, {body: {email: email.value, password: password.value}, method: "POST"});

        if(res.data) {
            await state.authenticate(res.data);

            useRouter().push("/");
        }
    }
</script>