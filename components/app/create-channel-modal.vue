<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";
import type { FetchError } from "ofetch";

import { z } from "zod";

const loading = ref(false);
const open = ref(false);
const toast = useToast();
const route = useRoute();
const { $csrfFetch } = useNuxtApp();
const serverStore = useServerStore();
const { refreshCurrentServer } = serverStore;

const { server } = route.params;

if (Number.isNaN(Number(server)) || !Number.isInteger(Number(server))) {
    navigateTo({ name: "channels-me" });
}

function openModal() {
    open.value = true;
}

function close() {
    open.value = false;
}
defineExpose({ openModal });

const items = ref<RadioGroupItem[]>([

    {
        label: "Text",
        description: "Send messages, emoji, opinions and puns.",
        id: "TEXT",
    },
    {
        label: "Voice",
        description: "Hang out together with voice and video.",
        id: "VOICE",
    },
]);

const schema = z.object({
    name: z.string().min(1, "Please enter your server's name").max(100, "Your server's name has exceed the maximum character count (100)"),
    channelType: z.enum(["TEXT", "VOICE"]),
    serverId: z.number(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    name: ``,
    channelType: "TEXT",
    serverId: Number(server),
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        loading.value = true;
        if (server) {
            await $csrfFetch(`/api/channels`, {
                method: "POST",
                body: event.data,
            });
            await refreshCurrentServer();
        }
    }
    catch (e) {
        const error = e as FetchError;
        toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
    }
    loading.value = false;
    close();
}
</script>

<template>
    <UModal v-model:open="open" title="Create Channel">
        <template #body>
            <UForm
                :schema="schema"
                :state="state"
                class="space-y-4 w-full"
                @submit="onSubmit"
            >
                <UFormField
                    label="CHANNEL TYPE"
                    name="channelType"
                    :ui="{
                        error: 'hidden',
                        label: 'font-bold text-xs',
                    }"
                >
                    <URadioGroup
                        v-model="state.channelType"
                        size="xl"
                        variant="card"
                        value-key="id"
                        :items="items"
                    />
                </UFormField>
                <UFormField
                    label="CHANNEL NAME"
                    name="name"
                    :ui="{
                        error: 'hidden',
                        label: 'font-bold text-xs',
                    }"
                >
                    <UInput
                        v-model="state.name"
                        :icon="state.channelType === 'TEXT' ? 'ic:round-numbers' : 'material-symbols:volume-up'"
                        type="text"
                        maxlength="100"
                        size="xl"
                        class="w-full"
                    />
                </UFormField>
                <div class="flex w-full justify-between items-center">
                    <UButton
                        label="Cancel"
                        color="neutral"
                        variant="ghost"
                        class="text-foreground font-semibold "
                        @click="close"
                    />
                    <UButton
                        type="submit"
                        color="primary"
                        :disabled="!state.name || loading"
                        :loading="loading"
                        class="text-foreground font-semibold "
                    >
                        <span v-if="!loading">
                            Create Channel
                        </span>
                    </UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>
