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

    async function signUp(email: string, password: string, name: string) {
        loading.value = true;
        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/app",
            fetchOptions: {
                onError(context) {
                    console.log(context.error.message);
                },
                onSuccess() {
                    useRouter().push("/app");
                    console.log("success");
                },
            },
        });

        loading.value = false;
    }

    return {
        loading,
        signInWithGithub,
        signUp,
    };
});
