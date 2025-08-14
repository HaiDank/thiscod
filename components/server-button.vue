<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
    selected?: boolean;
    highlighted?: boolean;
    tooltip?: string;
    onClick?: () => void;
    icon?: string;
    alt?: string;
    avatarUrl?: string;
    sidebarItem?: SidebarItem;
}>();

const route = useRoute();
const router = useRouter();

const activeBg = ((props.sidebarItem && (props.sidebarItem.icon || !props.sidebarItem.avatarUrl)) || (props.icon || !props.avatarUrl)) ? "bg-primary/90 active" : "active";

async function handleOnClick() {
    if (props.onClick) {
        props.onClick();
    }
    // avoid routing back to the current server if already in the server
    if (!props.sidebarItem?.to || route.fullPath.includes(router.resolve(props.sidebarItem?.to).fullPath)) {
        return null;
    }
    else {
        await navigateTo(props.sidebarItem?.to);
    }
}
</script>

<template>
    <div :class="cn('relative w-full flex items-center')">
        <UTooltip
            :delay-duration="0"
            arrow
            :content="{
                side: 'right',
                sideOffset: 4,
            }"
            :ui="{
                content: !sidebarItem?.alt && !alt && `hidden`,
                text: 'font-semibold',
            }"
            :text="sidebarItem?.alt ?? alt"
        >
            <ULink
                as="button"
                :to="sidebarItem?.to"
                class="h-10 w-10 rounded-lg overflow-hidden text-default cursor-pointer flex items-center peer justify-center mx-auto hover:bg-primary/90"
                :active-class="activeBg"
                inactive-class="bg-background"
                @click.prevent="handleOnClick"
            >
                <UAvatar
                    :icon="sidebarItem?.icon ?? icon"
                    :alt="sidebarItem?.alt ?? alt"
                    :src="sidebarItem?.avatarUrl ?? avatarUrl"
                    :ui="{
                        root: 'rounded-none bg-inherit/0 h-full w-full',
                        icon: 'size-6 text-default',
                        fallback: 'font-semibold text-center text-default',
                    }"
                />
            </ULink>
            <div :class="cn('peer-[.active]:scale-100 peer-[.active]:opacity-100 peer-[.active]:h-full absolute left-0 bg-foreground opacity-90 transition-all duration-300 scale-0 peer-hover:h-2/4 peer-hover:scale-100 h-full rounded-r-full w-1', highlighted && 'scale-100 h-1/5')" />
        </UTooltip>
    </div>
</template>
