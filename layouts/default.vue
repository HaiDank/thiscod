<script>
</script>

<template>
    <section class="w-screen h-screen flex flex-col relative">
        <header>
            <ModeToggle />
        </header>

        <div class="w-full h-full flex">
            <slot />
        </div>
    </section>
</template>
