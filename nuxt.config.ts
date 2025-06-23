import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
