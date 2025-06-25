import { createAuthClient } from "better-auth/client";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
    const loading = ref(false);
    async function signInWithGithub() {
        loading.value = true;
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/app",
            errorCallbackURL: "/error",
        });
        loading.value = false;
    }

    async function signInWithEmail(email: string, password: string) {
        loading.value = true;
        await authClient.signIn.email({
            email,
            password,
        });
        loading.value = false;
        navigateTo("/app");
    }

    async function signUp(email: string, password: string, name: string) {
        loading.value = true;
        await authClient.signUp.email({
            email,
            password,
            name,
        });
        loading.value = false;
        navigateTo("/app");
    }

    return {
        loading,
        signInWithGithub,
        signInWithEmail,
        signUp,
    };
});
