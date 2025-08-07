<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

defineProps<{
    placeholder?: string;
}>();

const emit = defineEmits(["sendMessage"]);

const form = useTemplateRef("form");

const schema = z.object({
    content: z.string().min(1).max(250).optional(),
    file: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    content: "",
    file: undefined,
});

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        form.value?.submit();
    }
}

function resetForm() {
    state.content = "";
    state.file = undefined;
}

defineExpose<{ resetForm: () => void }>({
    resetForm,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if ((event.data.content && event.data.content.trim().length > 0) || event.data.file) {
        emit("sendMessage", event.data);
    }
}
</script>

<template>
    <div class="w-full px-1.5 pb-6 pt-2 flex items-center grow ">
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
                    :placeholder="placeholder"
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
    </div>
</template>
