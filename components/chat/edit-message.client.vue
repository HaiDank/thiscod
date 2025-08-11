<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

import type { ClientMessageType } from "~/lib/types";

const { message } = defineProps<{
    message: ClientMessageType;
}>();

const emit = defineEmits(["editMessage", "cancel"]);
const form = useTemplateRef("form");
const schema = z.object({
    content: z.string().min(1).max(250).optional(),
    file: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    content: message.content ?? undefined,
    file: message.file ?? undefined,
});

function resetState() {
    state.content = message.content ?? undefined;
    state.file = message.file ?? undefined;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        form.value?.submit();
    }
    else if (event.key === "Escape") {
        resetState();
        emit("cancel");
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if ((event.data.content && event.data.content.trim().length > 0) || event.data.file) {
        emit("editMessage", event.data);
        console.log(event.data);
    }
}
</script>

<template>
    <div class="w-full flex flex-col gap-1 mt-2">
        <UForm
            ref="form"
            :schema="schema"
            :state="state"
            class="w-full"
            @submit="onSubmit"
        >
            <UFormField name="content" :ui="{ error: 'hidden' }">
                <UTextarea
                    v-model="state.content"
                    :rows="1"
                    autoresize
                    :ui="{
                        base: 'p-4 pl-18 text-base gap-2 ring-1 bg-card ring-border/75 focus-visible:ring-ring focus-visible:ring shadow-sm',
                        leading: 'ps-0 py-0.5',
                        trailing: 'pe-0 py-0.5',
                        leadingIcon: 'size-6',
                        leadingAvatarSize: 'xs',
                        trailingIcon: 'size-6',
                    }"
                    class="w-full"
                    variant="subtle"
                    @keydown="handleKeydown"
                >
                    <template #leading>
                        <UButton
                            class="px-4"
                            variant="link"
                            color="neutral"
                            size="xl"
                            icon="material-symbols:add-circle"
                            aria-label="Chat upload"
                        />
                    </template>
                    <template #trailing>
                        <UButton
                            variant="link"
                            color="neutral"
                            class="hover:scale-110 transition-transform "
                            size="xl"
                            icon="material-symbols:sentiment-excited-rounded"
                            aria-label="Emoji"
                        />
                    </template>
                </UTextarea>
            </UFormField>
        </UForm>
        <div class="text-xs">
            escape to <span class="text-blue-500 hover:underline cursor-pointer" @click="emit('cancel')">
                cancel
            </span>
            • enter to
            <span class="text-blue-500 hover:underline cursor-pointer" @click="() => { if (form){ form?.submit() } }">
                save
            </span>
        </div>
    </div>
</template>

<style scoped>

</style>
