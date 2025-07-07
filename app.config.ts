export default defineAppConfig({
    ui: {
        colors: {
            primary: "indigo",
        },
        tooltip: {
            slots: {
                text: "text-base",
                content: " bg-card border border-border/50 ring-0 h-auto",
            },

        },
        dropdownMenu: {
            slots: {
                content: "bg-card ring-0 border border-border/50",
                itemLeadingIcon: "text-dimmed/50",
            },
        },
        modal: {
            slots: {
                header: "justify-center pb-2",
                title: "text-2xl font-bold text-center",
                description: "text-center text-foreground text-base",
                content: "bg-card divide-none",
                overlay: "bg-black/50",
                close: "bg-card text-disabled hover:text-foreground",
                body: "pb-2",
            },
        },
        radioGroup: {
            slots: {
                item: "items-center",
            },
        },
    },
});
