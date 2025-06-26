<script setup lang="ts">
const authStore = useAuthStore();

async function signOut() {
    await authStore.signOut();
}
</script>

<template>
    <UButton
        class="w-full"
        color="error"
        variant="ghost"
        trailing-icon="material-symbols:logout"
        @click="signOut"
    >
        Log out
    </UButton>
</template>
