import {defineStore} from "pinia";

interface iGlobalState {
    token: string | undefined,
    user: any;
    isLoggedIn: boolean
}

export const useGlobalState = defineStore("globalState", {
    state: (): iGlobalState => {
        return {token: undefined, user: undefined, isLoggedIn: false}
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

            const res = await $fetch<any>(`/api/users/me`, {body: {token: this.token}, method: "POST"}).catch(err => console.log("Unable to fetch user data"));

            if(!res) return;

            if(res.data) {
                this.user = res.data;
                this.isLoggedIn = true;
            }
        }
    }
});