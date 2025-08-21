export const useDialogStore = defineStore("useDialogStore", () => {
    const openUserProfile = ref(false);

    return {
        openUserProfile,
    };
});
