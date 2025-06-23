<script>

</script>

<template>
    <section class="w-screen h-screen flex flex-col relative">
        <header>
            <NuxtLink to="/sign-in">
                SIgn in
            </NuxtLink>
            <ModeToggle />
        </header>

        <div class="w-full h-full flex">
            <slot />
        </div>
    </section>
</template>
