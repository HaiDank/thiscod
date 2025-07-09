<script setup lang="ts">
// import type { FormSubmitEvent } from "@nuxt/ui";

import type { FormSubmitEvent } from "@nuxt/ui";

import { Icon } from "#components";
import * as z from "zod";

const authStore = useAuthStore();

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
const errorMsg = ref("");

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    const { email, password } = event.data;
    const { error } = await authStore.signInWithEmail(email!, password!);
    if (error && error.message) {
        toast.add({
            color: "error",
            title: error.message,
        });
        errorMsg.value = error.message;
    }
    else {
        navigateTo("/channels");
    }
}

async function signInOAuth() {
    const { error } = await authStore.signInWithGithub();
    if (error && error.message) {
        toast.add({
            color: "error",
            title: error.message,
        });
        errorMsg.value = error.message;
    }
}

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <UForm
        :schema="formSchema"
        :state="state"
        class="space-y-2 p-24 bg-card rounded-lg w-3xl box-border h-1/2 flex items-center justify-center flex-col shadow-2xl transition-all"
        @submit="onSubmit"
    >
        <h1 class="font-bold text-3xl text-accent-foreground">
            Welcome!
        </h1>
        <p class="text-accent-foreground ">
            We're excited to see you
        </p>
        <UFormField
            label="Email"
            name="email"
            size="xl"
            class="w-full transition-all duration-300 "
            :ui="{
                error: 'hidden',
            }"
        >
            <UInput
                v-model="state.email"
                class="w-full transition-all duration-300 "
                color="primary"
                variant="subtle"
            />
        </UFormField>

        <UFormField
            label="Password"
            name="password"
            size="xl"
            class="w-full transition-all duration-300"
            :error="errorMsg"
        >
            <UInput
                v-model="state.password"
                type="password"
                class="w-full transition-all duration-300"
                color="primary"
                variant="subtle"
            />
        </UFormField>
        <span class="text-text-disabled w-full">
            Need an account?
            <NuxtLink to="/sign-up" class="text-primary font-semibold hover:underline">Register</NuxtLink>
        </span>

        <UButton
            type="submit"
            class="w-full justify-center font-semibold text-accent-foreground"
            color="primary"
            size="xl"
            :loading="authStore.loading"
        >
            Log in
        </UButton>
        <p class="text-text-disabled">
            or
        </p>
        <UButton
            class="w-full justify-center font-semibold text-accent"
            color="secondary"
            size="xl"
            loading-auto
            :disabled="authStore.loading"
            @click="signInOAuth"
        >
            Log in with Github <Icon name="mdi:github" class="h-[1.2rem] w-[1.2rem]" />
        </UButton>
    </UForm>
</template>
