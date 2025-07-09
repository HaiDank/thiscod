<script setup lang="ts">
import type { FetchError } from "ofetch";

import { useClipboard } from "@vueuse/core";

const { $csrfFetch } = useNuxtApp();
const { copy, copied } = useClipboard();
const serverStore = useServerStore();

const {
    currentServer,
} = storeToRefs(serverStore);
const toast = useToast();
const inviteCode = ref("");
const open = ref(false);
const openConfirmDialog = ref(false);
const loading = ref(false);
const origin = useOrigin();

function openModal() {
    open.value = true;
}

async function generateCode() {
    if (!currentServer.value) {
        return;
    }
    loading.value = true;
    try {
        const code = await $csrfFetch(`/api/servers/${currentServer.value.id}/generate-invite-code`, {
            method: "PATCH",
        });
        inviteCode.value = `${origin}/invite/${code}`;
    }
    catch (e) {
        const error = e as FetchError;
        toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
    }
    finally {
        loading.value = false;
        openConfirmDialog.value = false;
    }
}

function handleGenerateCode() {
    if (!currentServer.value) {
        return;
    }
    if (currentServer.value.inviteCodeExpiresAt && isInThePast(currentServer.value.inviteCodeExpiresAt)) {
        generateCode();
    }
    else {
        openConfirmDialog.value = true;
    }
}

function getCode() {
    if (!currentServer.value) {
        return;
    }
    if (!currentServer.value.inviteCode || (currentServer.value.inviteCode && isInThePast(currentServer.value.inviteCodeExpiresAt!))) {
        generateCode();
    }
    else {
        inviteCode.value = `${origin}/invite/${currentServer.value.inviteCode}`;
    }
}

defineExpose({ openModal });
</script>

<template>
    <LazyAppDialog
        confirm-color="primary"
        confirm-label="Generate new code"
        description="Your existing code will be disabled after you generate a new invite code."
        title="Are you sure?"
        :open="openConfirmDialog"
        @on-closed="() => openConfirmDialog = false"
        @on-confirmed="generateCode"
    />
    <UModal
        v-model:open="open"
        :title="`Invite friends to ${currentServer?.name}`"
        @after:enter="getCode"
    >
        <template #body>
            <div class="flex flex-col gap-1">
                <label class="text-xs font-bold">
                    SERVER INVITE CODE
                </label>
                <UInput
                    :value="inviteCode"
                    size="md"
                    :disabled="loading"

                    variant="subtle"
                    readonly
                >
                    <UButton
                        :color="copied ? 'success' : 'neutral'"
                        variant="link"
                        :disabled="loading"
                        size="sm"
                        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                        aria-label="Copy to clipboard"
                        @click="copy(inviteCode)"
                    />
                </UInput>
            </div>
            <div v-if="currentServer?.inviteCodeExpiresAt" class="text-xs">
                Your invite code will be expired in
                <span class="text-yellow-500 font-semibold">
                    {{ getTimeUntilX(currentServer.inviteCodeExpiresAt) }}
                </span>
            </div>
            <UButton
                class="text-dimmed font-semibold"
                variant="link"
                color="neutral"
                :disabled="loading"
                trailing-icon="material-symbols:sync"
                :ui="{
                    trailingIcon: loading ? 'animate-spin-invert' : '',
                }"
                @click="handleGenerateCode"
            >
                Generate a new code
            </UButton>
        </template>
    </UModal>
</template>
