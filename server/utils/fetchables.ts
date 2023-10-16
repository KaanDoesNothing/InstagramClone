export const fetchUser = async ({token, username}: {token?: string, username: string}) => {
    const res = await $fetch<any>(`/api/users/${encodeURIComponent(username)}`, {body: {token}, method: "POST"});

    return res.data;
}

export const isFollowing = async (from: string, to: string) => {
    
}