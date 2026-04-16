import imageCompression from "browser-image-compression";

export async function compressImage(
    file: File,
    options: {
        maxSizeMB?: number;
        maxWidthOrHeight?: number;
        initialQuality?: number;
        useWebWorker?: boolean;
        onProgress?: (progress: number) => void;
    }
) {
    return await imageCompression(file, {
        maxSizeMB: options.maxSizeMB ?? 10,
        maxWidthOrHeight: options.maxWidthOrHeight || 1920,
        initialQuality: options.initialQuality ?? 0.8,
        useWebWorker: true,
        onProgress: options.onProgress,
    });
}
