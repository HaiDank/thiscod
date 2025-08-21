import { oneTimeTokenClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import { defineStore } from "pinia";

import type { User } from "~/lib/db/schema";

import { DEFAULT_PAGE_AFTER_AUTH } from "~/lib/constants";

const authClient = createAuthClient({ plugins: [
    oneTimeTokenClient(),
] });

export const useAuthStore = defineStore("auth", () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

    async function init() {
        const data = await authClient.useSession(useFetch);
        session.value = data;
    }

    async function getOneTimeToken() {
        const res = await authClient.oneTimeToken.generate();
        return res.data?.token;
    }

    const user = computed(() => {
        if (session.value && session.value.data && session.value.data.user) {
            return { ...session.value?.data?.user, id: Number(session.value?.data?.user.id) } as unknown as User;
        }
        else {
            return undefined;
        }
    });
    const loading = computed(() => session.value?.isPending);

    async function updateProfile(data: { image?: string; name?: string }) {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        const { image, name } = data;

        return await authClient.updateUser({
            image,
            name,
            fetchOptions: {
                headers,
            },
        });
    }

    async function changePassword(data: { newPassword: string; currentPassword: string }) {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        const { newPassword, currentPassword } = data;

        return await authClient.changePassword({
            newPassword,
            currentPassword,
            revokeOtherSessions: true,
            fetchOptions: {
                headers,
            },
        });
    }

    async function signInWithGithub() {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        return await authClient.signIn.social({
            provider: "github",
            callbackURL: DEFAULT_PAGE_AFTER_AUTH,
            errorCallbackURL: "/error",
            fetchOptions: {
                headers,
            },
        });
    }

    async function signInWithEmail(email: string, password: string) {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        return await authClient.signIn.email({
            email,
            password,
            fetchOptions: {
                headers,
            },
        });
    }

    async function signUp(email: string, password: string, name: string) {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        return await authClient.signUp.email({
            email,
            password,
            name,
            fetchOptions: {
                headers,
            },
        });
    }

    async function signOut() {
        const { csrf } = useCsrf();
        const headers = new Headers();
        headers.append("csrf-token", csrf);

        return await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo("/sign-in");
                },
                headers,
            },
        });
    }

    return {
        getOneTimeToken,
        init,
        loading,
        updateProfile,
        changePassword,
        signInWithGithub,
        signInWithEmail,
        signUp,
        signOut,
        user,
    };
});
