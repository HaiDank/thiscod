import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxtjs/color-mode",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/test-utils",
		"@pinia/nuxt",
		"@clerk/nuxt",
		"shadcn-nuxt",
	],
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	colorMode: {
		classSuffix: "",
	},
	runtimeConfig: {},
	compatibilityDate: "2025-05-15",
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	clerk: {
		skipServerMiddleware: true,
	},
	eslint: {
		config: {
			stylistic: {
				semi: true,
				quotes: "double",
				commaDangle: "always-multiline",
				indent: "tab",
			},
		},
	},
	shadcn: {
		/**
     * Prefix for all the imported component
     */
		prefix: "",
		/**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
		componentDir: "./components/ui",
	},
});
