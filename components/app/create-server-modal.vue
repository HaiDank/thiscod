<script setup lang="ts">
// import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

const schema = z.object({
    serverName: z.string().min(1),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    serverName: undefined,
});

const open = ref(false);

function close() {
    open.value = false;
}

async function onSubmit() {
}
</script>

<template>
    <UModal
        v-model:open="open"
        title="Create Your Server"
        description="Give you server a personality with a name and an icon. You can always change it later."
        :ui="{
            header: 'justify-center',
            title: 'text-xl font-bold text-center',
            description: 'text-center text-foreground',
            content: 'bg-card divide-none',
            overlay: 'bg-black/50',
            close: 'bg-card text-disabled hover:text-foreground',
            footer: 'justify-between',
        }"
    >
        <ServerButton icon="material-symbols:add-circle" />

        <template #body>
            <UForm
                :schema="schema"
                :state="state"
                class="space-y-4 w-full"
                @submit="onSubmit"
            >
                <UFormField
                    label="SERVER NAME"
                    name="serverName"
                    :ui="{
                        label: 'font-bold text-xs',
                        error: 'hidden',
                    }"
                >
                    <UInput
                        v-model="state.serverName"
                        type="text"
                        size="xl"
                        class="w-full"
                    />
                </UFormField>
            </UForm>
        </template>
        <template #footer>
            <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="close"
            />
            <UButton
                type="submit"
                :disabled="!state.serverName"
                color="primary"
                class="text-foreground font-semibold "
            >
                Submit
            </UButton>
        </template>
    </UModal>
</template>
