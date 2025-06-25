<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

const authStore = useAuthStore();

const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    name: z.string(),
    image: z.string().url().optional(),
});

type Schema = z.output<typeof formSchema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    name: undefined,
    image: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    const { email, password, name } = event.data;
    try {
        await authStore.signUp(email!, password!, name!);
    }
    catch (error) {
        toast.add({
            title: "Error",
            description: "The email has already been registered",
            color: "error",
        });
        console.log("[SIGN_UP_ERROR]", error);
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
        class="space-y-2 p-24 bg-background rounded-lg w-3xl box-border h-1/2 flex items-center justify-center flex-col shadow-2xl"
        @submit="onSubmit"
    >
        <UFormField
            label="Email"
            name="email"
            size="lg"
            class="w-full"
            color="primary"
        >
            <UInput
                v-model="state.email"
                class="w-full"
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

        <UFormField
            label="Name"
            name="name"
            size="lg"
            class="w-full"
        >
            <UInput
                v-model="state.name"
                class="w-full"
                color="primary"
                variant="subtle"
            />
        </UFormField>

        <UButton
            type="submit"
            class="w-full justify-center"
            color="primary"
            size="xl"
            :loading="authStore.loading"
            :disabled="authStore.loading"
        >
            Sign up
        </UButton>

        <NuxtLink to="/sign-in" class="text-primary font-semibold hover:underline w-full">
            Already have an account?
        </NuxtLink>
    </UForm>
</template>
