<script setup lang="ts">
const conversationStore = useConversationStore();
await conversationStore.refreshConversations();

const sidebarStore = useSidebarStore();

const {
    sidebarConversationItems,
    conversationLoading,
} = storeToRefs(sidebarStore);
</script>

<template>
    <div class="grow border-t border-l rounded-tl-lg ">
        <div class="h-12 w-full border-b font-semibold flex items-center justify-between px-4">
            <UButton
                variant="soft"
                color="neutral"
                class="w-full flex justify-center font-semibold cursor-pointer"
            >
                Find or start a conversation
            </UButton>
        </div>

        <ul v-if="sidebarConversationItems && !conversationLoading" class="space-y-1 p-2">
            <ULink
                v-for="item in sidebarConversationItems"
                :key="`convo-${item.id}`"
                as="button"
                :to="item.to"
                raw
                class="w-full flex items-center group rounded-md py-1 px-2 gap-2 font-semibold transition-colors duration-150"
                active-class="text-default active bg-selected/70 hover:bg-selected/25"
                inactive-class="text-dimmed hover:text-default hover:bg-highlight"
            >
                <UserAvatar
                    :avatar="item.avatarUrl ?? undefined"
                    :name="item.alt"
                    size="md"
                    :status="item.status === 'Online' ? 'Online' : 'Offline'"
                />
                <span class="grow">

                    {{ item.alt }}
                </span>
            </ULink>
        </ul>
    </div>
</template>
