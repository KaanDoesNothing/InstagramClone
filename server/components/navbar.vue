<template>
    <div class="navbar bg-base-100">
        <div class="flex-1">
            <RouterLink to="/" class="btn btn-ghost normal-case text-xl italic">InstaPost</RouterLink>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1 btn-group">
                <template v-if="!state.isLoggedIn">
                    <li><RouterLink to="/auth/login">Login</RouterLink></li>
                    <li><RouterLink to="/auth/register">Register</RouterLink></li>
                </template>

                <template v-if="state.isLoggedIn">
                    <RouterLink :to="`/user/${state.user.username}`"><img :src="state.user.avatar" class="h-7 w-7 rounded-full"></RouterLink>
                    <RouterLink class="btn btn-sm btn-ghost" to="/notifications"><Icon name="ic:outline-favorite-border" size="24px"></Icon></RouterLink>
                    <RouterLink class="btn btn-sm btn-ghost" to="/chat"><Icon name="ic:baseline-send" size="24px"></Icon></RouterLink>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useGlobalState } from "@/stores/state";

    const state = useGlobalState();
</script>