<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <Html data-theme="black">
        <Head>
            <Title>InstaPost</Title>
        </Head>
    </Html>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>


<script lang="ts" setup>
    const state = useGlobalState();

    await state.authenticate();

    if(!state.isLoggedIn) {
        // await useRouter().push("/auth/login");
    }
</script>