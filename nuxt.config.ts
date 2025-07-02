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
        "@vee-validate/nuxt",
        "nuxt-csurf",
    ],
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        preference: "dark", // default value of $colorMode.preference
        fallback: "dark", // fallback value if not system preference found
        componentName: "ColorScheme",
        classPrefix: "",
        classSuffix: "",
        storage: "localStorage", // or 'sessionStorage' or 'cookie'
        storageKey: "nuxt-color-mode",
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
