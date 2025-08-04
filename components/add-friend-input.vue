<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

import type { StatusError } from "~/lib/types";

const { $csrfFetch } = useNuxtApp();

const schema = z.object({
    email: z.string().email("Please enter a valid email.").optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (event.data.email && event.data.email.trim().length > 0) {
        try {
            const res = await $csrfFetch(`/api/friends/${event.data.email}`, {
                method: "POST",
            });

            console.log(res);
            toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
        }
        catch (e) {
            const error = e as unknown as StatusError;
            toast.add({ title: "Friend request failed", description: error.statusMessage, color: "error" });
        }
    }
}
</script>

<template>
    <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
    >
        <UFormField name="email">
            <UInput
                v-model="state.email"
                :ui="{
                    base: 'relative shadow-sm bg-sidebar text-base p-4 ring-1 ring-border/75 focus-visible:ring-blue-500 focus-visible:ring',
                }"
                class="w-full"
                placeholder="Search"
                variant="subtle"
            >
                <template #trailing>
                    <UButton
                        type="submit"
                        variant="solid"
                        class="text-default"
                    >
                        Send Friend Request
                    </UButton>
                </template>
            </UInput>
        </UFormField>
    </UForm>
</template>
