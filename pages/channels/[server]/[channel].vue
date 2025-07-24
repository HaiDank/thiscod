<script setup lang="ts">
import * as z from "zod";

const route = useRoute();
const { $csrfFetch } = useNuxtApp();

if (!z.coerce.number().safeParse(route.params.channel).success) {
    await navigateTo({ name: "channels-server", params: {
        server: route.params.server,
    } });
}

const sidebarStore = useSidebarStore();
const {
    chosenChannels,
} = storeToRefs(sidebarStore);
const channel = ref<SidebarChannelItem | undefined>(undefined);

onMounted(async () => {
    try {
        const res = await $csrfFetch(`/api/channels/${route.params.server}/${route.params.channel}`);
        console.log(res);
        channel.value = res;
    }
    catch (error) {
        await navigateTo({ name: "channels-server", params: {
            server: route.params.server,
        } });
        console.log(error);
    }
});

watchEffect(() => {
    channel.value = chosenChannels.value.get(`${route.params.server}`);
});
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="channel" class="w-full h-full bg-background flex flex-col gap-2">
            <ChatHeader :channel-name="channel.name" :type="channel.channelType" />
            <div class="w-full h-full flex flex-col grow overflow-hidden">
                <div class="flex w-full h-1/2 flex-col items-center justify-center text-3xl font-semibold">
                    <h4>
                        Welcome to
                    </h4>
                    <h4>
                        the server
                    </h4>
                </div>
                <ChatMessage />
            </div>
            <ChatInput :placeholder="channel.name" />
        </section>
        <div v-else>
            Chat not found
        </div>
    </div>
</template>
