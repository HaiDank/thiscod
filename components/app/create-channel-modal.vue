<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

import { z } from "zod";

const open = ref(false);
function openModel() {
    open.value = true;
}

function close() {
    open.value = false;
}
defineExpose({ openModel });

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
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    name: ``,
    channelType: "TEXT",
});

async function onSubmit() {

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
                        icon="solar:hashtag-bold"
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
                        :disabled="!state.name "
                        class="text-foreground font-semibold "
                    >
                        <span>
                            Create Channel
                        </span>
                    </UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>
