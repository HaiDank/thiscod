import { createAuthClient } from "better-auth/client";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
    const loading = ref(false);
    async function signIn() {
        loading.value = true;
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/app",
            errorCallbackURL: "/error",
        });
        loading.value = false;
    }

    return {
        loading,
        signIn,
    };
});
