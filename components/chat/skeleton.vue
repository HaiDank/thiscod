<script setup lang="ts">
const numText = ref<number>(7);
const numLine = ref<number>(4);

function getRandomHeadLength() {
    return Math.floor(Math.random() * 100 + 100);
}

function getRandomChatLength() {
    return Math.floor(Math.random() * 120 + 50);
}

function getRandomNumberOfText() {
    return Math.floor(Math.random() * 1 + 7);
}
function getRandomNumberOfLine() {
    return Math.floor(Math.random() * 5 + 1);
}

onMounted(() => {
    numText.value = getRandomNumberOfText();
    numLine.value = getRandomNumberOfLine();
});
</script>

<template>
    <div class="hover:bg-highlight group px-4 py-0.5 flex gap-4 items-start mt-4">
        <USkeleton class="size-10 rounded-full shrink-0" />

        <div class="grid gap-2">
            <USkeleton
                class="h-4 "
                :style="{
                    width: `${getRandomHeadLength()}px`,
                }"
            />
            <div
                v-for="msg in numLine"
                :key="msg"
                class="flex items-center gap-2 flex-wrap"
            >
                <USkeleton
                    v-for="text in numText"
                    :key="text"
                    class="h-4 w-[150px]"
                    :style="{
                        width: `${getRandomChatLength()}px`,
                    }"
                />
            </div>
        </div>
    </div>
</template>
