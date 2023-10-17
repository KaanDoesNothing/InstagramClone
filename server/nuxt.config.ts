// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    app: {
      env: process.env
    },
    public: {
      API: process.env.API
    }
  },
  nitro: {
    plugins: ["~/server/index.ts"]
  }
});
