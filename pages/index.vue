<script setup lang="ts">
import { DEFAULT_PAGE_AFTER_AUTH } from "~/lib/constants";

await navigateTo(DEFAULT_PAGE_AFTER_AUTH);

definePageMeta({
    layout: false,
});
</script>

<template>
    <div>
        Rerouting...
    </div>
</template>
