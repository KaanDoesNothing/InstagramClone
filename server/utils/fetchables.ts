export const fetchUser = async (username: string) => {
    const config = useRuntimeConfig();
    const res = await $fetch<any>(`${config.public.API}/user/${username}`)

    return res.data;
}

export const isFollowing = async (from: string, to: string) => {
    
}