<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

const open = ref(false);
const loading = ref(false);
const authStore = useAuthStore();
const toast = useToast();

const schema = z.object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z.string().min(1, "Please enter your new password"),
    confirmNewPassword: z.string().min(1, "Please enter your current password"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
}); ;

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    currentPassword: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
});

function close() {
    open.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true;
    const { error } = await authStore.changePassword({
        newPassword: event.data.newPassword,
        currentPassword: event.data.currentPassword,
    });
    if (error) {
        toast.add({ title: error.message || "An unknown error occurred", color: "error" });
        loading.value = false;
    }
    else {
        toast.add({ title: "Password updated successfully", color: "success" });
        await authStore.init();
        loading.value = false;
        close();
    }
}
</script>

<template>
    <UModal
        v-model:open="open"
        title="Upload your password"
        description="Enter your current password and a new password"
    >
        <template #body>
            <UForm
                :state="state"
                :schema="schema"
                class="space-y-4 w-full"
                @submit="onSubmit"
            >
                <UFormField
                    required
                    label="Current Password"
                    name="currentPassword"
                >
                    <UInput
                        v-model="state.currentPassword"
                        type="password"
                        class="w-full"
                        size="xl"
                    />
                </UFormField>
                <UFormField
                    required
                    label="New Password"
                    name="newPassword"
                >
                    <UInput
                        v-model="state.newPassword"
                        type="password"
                        class="w-full"
                        size="xl"
                    />
                </UFormField>
                <UFormField
                    required
                    label="Confirm New Password"
                    name="confirmNewPassword"
                >
                    <UInput
                        v-model="state.confirmNewPassword"
                        type="password"
                        class="w-full"
                        size="xl"
                    />
                </UFormField>
                <div class="flex w-full justify-end items-center">
                    <UButton
                        type="submit"
                        color="primary"
                        size="xl"
                        :disabled="loading"
                        :loading="loading"
                        class="text-foreground font-semibold "
                    >
                        <span v-if="!loading">
                            Apply
                        </span>
                    </UButton>
                </div>
            </UForm>
        </template>
        <UButton color="primary" class="text-default">
            Change Password
        </UButton>
    </UModal>
</template>
