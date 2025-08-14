<script setup lang="ts">
import type { User } from "~/lib/db/schema";

defineProps<{
    onClick: () => void;
    user: User;
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
            <UserAvatar
                :avatar="user.image ?? undefined"
                :name="user.name"
                :status="user.status === 'Online' ? 'Online' : 'Offline'"
            />
            <div class="flex flex-col justify-baseline items-start grow w-full">
                <div class="flex gap-2 items-end">
                    <span class="grow font-semibold ">
                        {{ user.name }}
                    </span>
                    <span class="grow font-semibold text-sm hidden group-hover:flex ">
                        {{ user.email }}
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
