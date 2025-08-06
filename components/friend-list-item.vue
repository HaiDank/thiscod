<script setup lang="ts">
defineProps<{
    onClick: () => void;
    avatar: string | null;
    name: string;
    email: string;
    subString: string;
}>();
</script>

<template>
    <ULink
        as="button"
        raw
        class="w-full rounded-md px-2 group cursor-pointer"
        active-class="text-default active bg-selected/75"
        inactive-class=" hover:bg-highlight"
        @click="onClick"
    >
        <div class="border-t border-border items-center flex w-full gap-2 py-2 ">
            <UAvatar :avatar="avatar" :alt="name" />
            <div class="flex flex-col justify-baseline items-start grow w-full">
                <div class="flex gap-2 items-end">
                    <span class="grow font-semibold ">
                        {{ name }}
                    </span>
                    <span class="grow font-semibold text-sm hidden group-hover:flex ">
                        {{ email }}
                    </span>
                </div>
                <span class="grow font-semibold text-dimmed text-sm">
                    {{ subString }}
                </span>
            </div>

            <slot name="trailing" class="flex items-center gap-2" />
        </div>
    </ULink>
</template>
