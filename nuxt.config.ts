import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        pageTransition: { name: "page", mode: "out-in" },
    },
    modules: [
        "@nuxt/ui",
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/test-utils",
        "@pinia/nuxt",
    ],
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        preference: "system",
        fallback: "dark",
        classPrefix: "",
        classSuffix: "",
    },
    devtools: { enabled: true },
    css: ["~/assets/css/tailwind.css"],
    runtimeConfig: {},
    compatibilityDate: "2025-05-15",
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
});
