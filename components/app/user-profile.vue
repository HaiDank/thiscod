<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import * as z from "zod";

const dialogStore = useDialogStore();
const { openUserProfile } = storeToRefs(dialogStore);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const schema = z.object({
    name: z.string().min(1, "Please enter a name"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    name: user.value?.name,
});

const isDirty = computed(() => state.name !== user.value?.name);

const toast = useToast();
const rgbString = ref<string>("rgb(255,255,255)");
const { getAverageRGB } = useImageColor();
watchPostEffect(async () => {
    if (user.value && user.value.image) {
        const res = await getAverageRGB(`${user.value?.image}`);
        rgbString.value = `rgb(${res[0]},${res[1]},${res[2]})`;
    }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { error } = await authStore.updateProfile({ name: event.data.name });

    if (error) {
        toast.add({ title: "Fail to update user's information", description: error.message, color: "error" });
    }
    else {
        toast.add({ title: "Success", description: "The user has been updated.", color: "success" });
        openUserProfile.value = false;
    }
}
</script>

<template>
    <UModal
        v-model:open="openUserProfile"
        :close="false"
        :ui="{
            body: 'p-0 sm:p-0',
        }"
        size=""
    >
        <template #body>
            <div v-if="user" class="flex flex-col w-full rounded-lg overflow-hidden shadow-2xl bg-sidebar gap-4 grow">
                <div
                    class="h-25 max-h-1/2 relative mb-10"
                    :style="{
                        backgroundColor: rgbString,
                    }"
                >
                    <div class="absolute z-10 flex items-end gap-4 bottom-0 left-4 translate-y-3/4">
                        <div class="relative group rounded-full">
                            <UserAvatar
                                root-style="size-16 text-4xl ring-6 ring-sidebar "
                                chip-style="ring-6 ring-sidebar size-4 "
                                :avatar="user.image ?? undefined"
                                :name="user.name"
                            />
                            <AppUserAvatarEdit />
                        </div>
                        <div class="flex flex-col">
                            <h5 class="text-xl font-bold">
                                {{ state.name }}
                            </h5>
                            <h5 class="text-sm bont-semibold leading-none">
                                {{ user?.email }}
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="p-4 ">
                    <div class="flex flex-col p-4 gap-2 bg-card shadow-md rounded-lg">
                        <UForm
                            :schema="schema"
                            :state="state"
                            class="space-y-4 w-full"
                            @submit="onSubmit"
                        >
                            <UFormField label="Name" name="name">
                                <UInput
                                    v-model="state.name"
                                    class="w-full"
                                    size="xl"
                                >
                                    <template #trailing>
                                        <UButton
                                            class="text-default font-semibold"
                                            type="submit"
                                            color="primary"
                                            :disabled="!isDirty"
                                        >
                                            Apply
                                        </UButton>
                                    </template>
                                </UInput>
                            </UFormField>
                        </UForm>
                        <UFormField label="Password" name="Password">
                            <AppUserPasswordEdit />
                        </UFormField>
                    </div>
                </div>
            </div>
        </template>
    </UModal>
</template>
