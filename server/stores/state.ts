import {defineStore} from "pinia";

interface iGlobalState {
    token: string | undefined,
    user: any;
    isLoggedIn: boolean;
    posts: any;
}

export const useGlobalState = defineStore("globalState", {
    state: (): iGlobalState => {
        return {token: undefined, user: undefined, isLoggedIn: false, posts: undefined}
    },
    actions: {
        async authenticate(token?: string): Promise<boolean> {
            const storedToken = useCookie("token").value;

            if(token) {
                useCookie("token").value = token;
                
                this.token = token;

                await this.fetchUser();

                return true;
            }else if(storedToken) {
                this.token = storedToken;

                await this.fetchUser();

                return true;
            }

            return false;
        },
        async fetchUser() {
            const config = useRuntimeConfig();

            const res = await $fetch<any>(`${config.public.API}/user/me`, {headers: {"Authorization": this.token as string}}).catch(err => console.log("Unable to fetch user data"));

            if(!res) return;

            if(res.data) {
                this.user = res.data;
                this.isLoggedIn = true;
            }
        },
        async fetchPosts() {
            const config = useRuntimeConfig();

            const res = await $fetch<any>(`${config.public.API}/general/recent/posts`)

            if(!res) return;

            if(res.data) {
                this.posts = res.data;
            }
        },
        getPostData(id: string) {
            return this.user.postUserData.filter((row: any) => row.post._id === id)[0];
        }
    }
});