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
const errorMsg = ref("");

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    const { email, password, name } = event.data;
    const { error } = await authStore.signUp(email!, password!, name!);
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

definePageMeta({
    layout: "auth",
});
</script>

<template>
    <UForm
        :schema="formSchema"
        :state="state"
        class="gap-4 p-24 bg-card rounded-lg w-3xl box-border h-1/2 flex items-center justify-center flex-col shadow-2xl"
        @submit="onSubmit"
    >
        <h1 class="text-accent-foreground font-bold text-3xl">
            Create an account
        </h1>
        <UFormField
            label="Email"
            name="email"
            size="xl"
            class="w-full"
            color="primary"
            :error="errorMsg"
            required
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
            size="xl"
            class="w-full"
            required
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
            size="xl"
            class="w-full"
            required
        >
            <UInput
                v-model="state.name"
                class="w-full"
                color="primary"
                variant="subtle"
            />
        </UFormField>

        <NuxtLink to="/sign-in" class="text-primary font-semibold hover:underline w-full">
            Already have an account?
        </NuxtLink>

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
    </UForm>
</template>
