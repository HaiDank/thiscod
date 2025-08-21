<script setup lang="ts">
import type { FetchError } from "ofetch";

import * as z from "zod";

const open = ref(false);
const image = ref<File | null>(null);
const previewURL = ref<string | null>(null);
const loading = ref(false);
const { $csrfFetch } = useNuxtApp();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const toast = useToast();

const schema = z.object({
    image: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    image: undefined,
});

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

async function onSubmit() {
    try {
        loading.value = true;
        if (image.value && previewURL.value) {
        // resize the image and reduce the quality to save space
            const previewImage = new Image();
            previewImage.addEventListener("load", async () => {
                const width = Math.min(700, previewImage.width);
                const resized = await createImageBitmap(previewImage, {
                    resizeWidth: width,
                });
                const canvas = new OffscreenCanvas(width, resized.height);
                canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
                const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });

                const checksum = await getChecksum(blob);

                const { fields, key, url } = await $csrfFetch(`/api/sign-image`, {
                    method: "POST",
                    body: {
                        checksum,
                        contentLength: blob.size,
                    },
                });

                const formData = new FormData();

                Object.entries(fields).forEach(([key, value]) => {
                    formData.append(key, value as string);
                });
                formData.append("file", blob);

                await $fetch(url, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "x-amz-checksum-algorithm": "SHA256",
                    },
                });

                const img = `${config.public.s3BucketUrl}/${key}`;

                const { error } = await authStore.updateProfile({ image: img });
                if (error) {
                    toast.add({ title: error.message || "An unknown error occurred", color: "error" });
                }
            });
            previewImage.src = previewURL.value;
        }
    }
    catch (e) {
        const error = e as FetchError;
        toast.add({ title: getFetchErrorMessage(error) || "An unknown error occurred", color: "error" });
    }
    finally {
        loading.value = false;
        toast.add({ title: "Avatar updated successfully", color: "success" });
        await authStore.init();
        close();
    }
}
</script>

<template>
    <UModal
        v-model:open="open"
        title="Upload an image"
    >
        <template #body>
            <UForm
                :state="state"
                :schema="schema"
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
                            <label for="imageUrl" class="flex items-center justify-center size-40 border-2 border-muted-foreground border-dashed rounded-full cursor-pointer">
                                <input
                                    id="imageUrl"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="selectImage"
                                >
                                <div v-if="!previewURL" class="flex flex-col items-center text-muted-foreground font-bold justify-center box-border ">
                                    <Icon name="material-symbols:android-camera" size="48" />
                                    <p class="text-xs">UPLOAD</p>
                                </div>
                                <UAvatar
                                    v-else
                                    :src="previewURL"
                                    :ui="{
                                        root: 'size-40',
                                    }"
                                />
                            </label>
                            <UAvatar
                                v-if="!previewURL"
                                icon="material-symbols:add"
                                size="2xl"
                                class="absolute top-0 right-0 cursor-pointer"
                                :ui="{
                                    root: 'bg-primary ',
                                    icon: 'size-10 text-default',
                                }"
                            />
                        </div>
                    </div>
                </UFormField>
                <div class="flex w-full justify-end items-center">
                    <UButton
                        type="submit"
                        color="primary"
                        :disabled="!image || loading"
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
        <button class="size-16 aspect-square rounded-full  cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center flex bg-black/30 absolute z-5 inset-0">
            <UIcon name="material-symbols:edit-rounded" class="size-5" />
        </button>
    </UModal>
</template>
