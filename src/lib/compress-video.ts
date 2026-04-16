import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export async function createFFmpegInstance() {
    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    return ffmpeg;
}

export async function compressVideo(
    ffmpeg: FFmpeg,
    file: File,
    options: {
        quality: "720p" | "480p" | "custom";
        onProgress?: (progress: number) => void;
    }
) {
    const { name } = file;
    const inputName = "input_" + name;
    const outputName = "output_compressed.mp4";

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    ffmpeg.on("log", ({ message }) => {
        console.log("FFmpeg Log:", message);
    });

    ffmpeg.on("progress", ({ progress }) => {
        if (options.onProgress) options.onProgress(progress * 100);
    });

    // Basic compression strategies:
    // 480p: Scale to 480 width, crf 28 (higher = smaller)
    // 720p: Scale to 720 width, crf 24
    let args: string[] = [];

    if (options.quality === "480p") {
        args = ["-i", inputName, "-vf", "scale=-2:480", "-c:v", "libx264", "-crf", "30", "-preset", "ultrafast", "-movflags", "+faststart", outputName];
    } else if (options.quality === "720p") {
        args = ["-i", inputName, "-vf", "scale=-2:720", "-c:v", "libx264", "-crf", "26", "-preset", "ultrafast", "-movflags", "+faststart", outputName];
    } else {
        args = ["-i", inputName, "-c:v", "libx264", "-crf", "26", "-preset", "ultrafast", "-movflags", "+faststart", outputName];
    }

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    return new Blob([data as any], { type: "video/mp4" });
}
