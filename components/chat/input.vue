<script setup lang="ts">
defineProps<{
    placeholder?: string;
}>();
</script>

<template>
    <div class="w-full px-1.5 py-6 flex items-center ">
        <UInput
            :ui="{
                base: 'p-4 pl-18 text-base gap-2 ring-1 bg-card ring-border focus-visible:ring-ring focus-visible:ring shadow-sm',
                leading: 'ps-0',
                trailing: 'pe-0',
                leadingIcon: 'size-6',
                leadingAvatarSize: 'xs',
                trailingIcon: 'size-6',
            }"
            class="w-full"
            :placeholder="placeholder"
            variant="subtle"
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
        </UInput>
    </div>
</template>
