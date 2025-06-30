import { createAuthClient } from "better-auth/vue";
import { defineStore } from "pinia";

const authClient = createAuthClient();

export const useAuthStore = defineStore("auth", () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
    async function init() {
        const data = await authClient.useSession(useFetch);
        session.value = data;
    }

    const user = computed(() => session.value?.data?.user);
    const loading = computed(() => session.value?.isPending);

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

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo("/sign-in");
                },
            },
        });
    }

    return {
        init,
        loading,
        signInWithGithub,
        signInWithEmail,
        signUp,
        signOut,
        user,
    };
});
