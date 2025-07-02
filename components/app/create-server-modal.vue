<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FetchError } from "ofetch";

import * as z from "zod";

const authStore = useAuthStore();
const serverStore = useServerStore();
const toast = useToast();

const { $csrfFetch } = useNuxtApp();
const { refreshServers } = serverStore;

const schema = z.object({
    name: z.string().min(1, "Please enter your server's name").max(100, "Your server's name has exceed the maximum character count (100)"),
    image: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    name: `${authStore.user?.name}'s server`,
    image: undefined,
});

const image = ref<File | null>(null);
const previewURL = ref<string | null>(null);
const open = ref(false);
const loading = ref(false);

function close() {
    open.value = false;
}

function selectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        image.value = file;
        previewURL.value = URL.createObjectURL(file);
    }
}

async function getChecksum(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // resize the image and reduce the quality to save space
    if (image.value && previewURL.value) {
        const previewImage = new Image();
        previewImage.addEventListener("load", async () => {
            const width = Math.min(1000, previewImage.width);
            const resized = await createImageBitmap(previewImage, {
                resizeWidth: width,
            });
            const canvas = new OffscreenCanvas(width, resized.height);
            canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
            const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });

            await getChecksum(blob);
        });
        previewImage.src = previewURL.value;
    }

    try {
        loading.value = true;
        await $csrfFetch("/api/servers", {
            method: "POST",
            body: event.data,
        });
    }
    catch (e) {
        const error = e as FetchError;
        toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
    }
    await refreshServers();
    loading.value = false;
    close();
};
</script>

<template>
    <UModal
        v-model:open="open"
        title="Create Your Server"
        description="Give you server a personality with a name and an icon. You can always change it later."
        :ui="{
            header: 'justify-center pb-2',
            title: 'text-2xl font-bold text-center',
            description: 'text-center text-foreground text-base',
            content: 'bg-card divide-none',
            overlay: 'bg-black/50',
            close: 'bg-card text-disabled hover:text-foreground',
            body: 'pb-2',
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
                    name="image"
                    :ui="{
                        error: 'hidden',
                    }"
                >
                    <div class="flex items-center justify-center w-full">
                        <div class="relative inline-flex items-center justify-center shrink-0">
                            <label for="imageUrl" class="flex items-center justify-center size-20 border-2 border-muted-foreground border-dashed rounded-full cursor-pointer">
                                <input
                                    id="imageUrl"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="selectImage"
                                >
                                <div v-if="!previewURL" class="flex flex-col items-center text-muted-foreground font-bold justify-center box-border ">
                                    <Icon name="material-symbols:android-camera" size="24" />
                                    <p class="text-xs">UPLOAD</p>
                                </div>
                                <UAvatar
                                    v-else
                                    :src="previewURL"
                                    :ui="{
                                        root: 'size-20',
                                    }"
                                />
                            </label>
                            <UAvatar
                                v-if="!previewURL"
                                icon="material-symbols:add"
                                size="xs"
                                class="absolute top-0 right-0 cursor-pointer"
                                :ui="{
                                    root: 'bg-primary',
                                    icon: 'size-5',
                                }"
                            />
                        </div>
                    </div>
                </UFormField>
                <UFormField
                    label="SERVER NAME"
                    name="name"
                    :ui="{
                        label: 'font-bold text-xs',
                    }"
                >
                    <UInput
                        v-model="state.name"
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
                            Submit
                        </span>
                    </UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>
