<template>
    <div class="flex justify-center">
        <div class="bg-base-200 p-5 w-1/3 rounded">
            <label>Create an account</label>
            
            <form class="form-control">
                <label class="label">
                    <span class="label-text">Enter your username</span>
                </label>
                <input class="input input-bordered" placeholder="Type here" type="text" v-model="username">

                <label class="label">
                    <span class="label-text">Enter your email</span>
                </label>
                <input class="input input-bordered" placeholder="Type here" type="email" v-model="email">

                <label class="label">
                    <span class="label-text">Enter your password</span>
                </label>
                <input class="input input-bordered" placeholder="Type here" type="password" v-model="password">
                <br>
                <button class="btn" type="submit" @click.prevent="handleRegister">Sign up</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";

    const username = ref("");
    const email = ref("");
    const password = ref("");

    const handleRegister = async () => {
        const res = await $fetch("/api/auth/register", {body: {username: username.value, email: email.value, password: password.value}, method: "POST"})
    }
</script>