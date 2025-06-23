<script setup lang="ts">
// import type { FormSubmitEvent } from "@nuxt/ui";

import { Icon } from "#components";
import * as z from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof formSchema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
});

const toast = useToast();
async function onSubmit() {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
}

const authStore = useAuthStore();

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <div class="w-full h-full relative flex items-center justify-center">
        <img
            src="/wallpaper.jpg"
            class="h-full w-auto object-cover blur-[4px] brightness-75 -z-10 absolute"
        >
        <UForm
            :schema="formSchema"
            :state="state"
            class="space-y-2 p-12 bg-background rounded-lg w-3xl h-1/2 flex items-center justify-center flex-col shadow-2xl"
            @submit="onSubmit"
        >
            <UFormField
                label="Email"
                name="email"
                size="lg"
                class="w-2/3"
            >
                <UInput v-model="state.email" class="w-full" />
            </UFormField>

            <UFormField
                label="Password"
                name="password"
                size="lg"
                class="w-2/3"
            >
                <UInput
                    v-model="state.password"
                    type="password"
                    class="w-full"
                />
            </UFormField>
            <span class="text-text-disabled">
                Need an account?
                <NuxtLink to="/sign-up" class="text-primary font-semibold">Register</NuxtLink>
            </span>

            <UButton
                type="submit"
                class="w-2/3 justify-center"
                color="primary"
                size="xl"
            >
                Log in
            </UButton>
            <p>
                or
            </p>
            <UButton
                class="w-2/3 justify-center"
                color="secondary"
                size="xl"
                loading-auto
                :disabled="authStore.loading"
                @click="authStore.signIn"
            >
                Log in with Github <Icon name="mdi:github" class="h-[1.2rem] w-[1.2rem]" />
            </UButton>
        </UForm>
    </div>
</template>
