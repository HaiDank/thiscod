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
    <UForm
        :schema="formSchema"
        :state="state"
        class="space-y-2 p-24 bg-background rounded-lg w-3xl box-border h-1/2 flex items-center justify-center flex-col shadow-2xl transition-all"
        @submit="onSubmit"
    >
        <UFormField
            label="Email"

            name="email"
            size="lg"
            class="w-full"
        >
            <UInput
                v-model="state.email"
                class="w-full"
                color="primary"
                variant="subtle"
            />
        </UFormField>

        <UFormField
            label="Password"
            name="password"
            size="lg"
            class="w-full"
        >
            <UInput
                v-model="state.password"
                type="password"
                class="w-full"
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
            class="w-full justify-center"
            color="primary"
            size="xl"
        >
            Log in
        </UButton>
        <p>
            or
        </p>
        <UButton
            class="w-full justify-center"
            color="secondary"
            size="xl"
            loading-auto
            :disabled="authStore.loading"
            @click="authStore.signInWithGithub"
        >
            Log in with Github <Icon name="mdi:github" class="h-[1.2rem] w-[1.2rem]" />
        </UButton>
    </UForm>
</template>
