<script>

</script>

<template>
    <section class="w-screen h-screen overflow-hidden">
        <Header />
        <div class="w-full h-[calc(100vh-2rem)] flex relative">
            <SideBar />
            <div class="w-full h-full flex border border-background">
                <slot />
            </div>
        </div>
    </section>
</template>
