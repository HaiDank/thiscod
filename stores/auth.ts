import { createAuthClient } from "better-auth/vue";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
    const session = authClient.useSession();
    const user = computed(() => session.value.data?.user);
    const loading = computed(() => session.value.isPending || session.value.isRefetching);

    async function signInWithGithub() {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/app",
            errorCallbackURL: "/error",
        });
    }

    async function signInWithEmail(email: string, password: string) {
        return await authClient.signIn.email({
            email,
            password,
        });
    }

    async function signUp(email: string, password: string, name: string) {
        return await authClient.signUp.email({
            email,
            password,
            name,
        });
    }

    return {
        loading,
        signInWithGithub,
        signInWithEmail,
        signUp,
        user,
    };
});
