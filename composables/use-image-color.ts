export function useImageColor() {
    const getAverageRGB = (imageSrc: string | null): Promise<Uint8ClampedArray> => {
        return new Promise((resolve, reject) => {
            if (!imageSrc) {
                return [255, 255, 255];
            }
            const context = document.createElement("canvas").getContext("2d");
            context!.imageSmoothingEnabled = true;
            const img = new Image();
            img.src = imageSrc;
            img.crossOrigin = "anonymous";
            img.onload = () => {
                context!.drawImage(img, 0, 0, 1, 1);
                resolve(context!.getImageData(0, 0, 1, 1).data.slice(0, 3));
            };

            img.onerror = reject;

            img.src = imageSrc;
        });
    };

    return {
        getAverageRGB,
    };
}
