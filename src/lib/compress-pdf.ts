import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Point the worker to the CDN build so we don't need to copy the worker file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const qualityMap = {
    low:    { scale: 1.5, jpegQuality: 0.88 }, // Best quality, mild compression
    medium: { scale: 1.2, jpegQuality: 0.72 }, // Balanced
    high:   { scale: 1.0, jpegQuality: 0.50 }, // Smallest size
};

export async function compressPdf(
    file: File,
    level: "low" | "medium" | "high",
    onProgress?: (progress: number) => void
) {
    if (onProgress) onProgress(5);

    const arrayBuffer = await file.arrayBuffer();
    const { scale, jpegQuality } = qualityMap[level];

    // Load the PDF for rendering
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    if (onProgress) onProgress(10);

    // Create a fresh PDF to hold the re-encoded pages
    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d")!;

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert to JPEG at the target quality
        const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
        const base64  = dataUrl.split(",")[1];
        const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const jpegImage = await newPdf.embedJpg(jpegBytes);
        const newPage   = newPdf.addPage([canvas.width, canvas.height]);
        newPage.drawImage(jpegImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });

        if (onProgress) onProgress(10 + Math.round((i / numPages) * 85));
    }

    const compressedBytes = await newPdf.save({ useObjectStreams: true });
    if (onProgress) onProgress(100);

    return new Blob([compressedBytes], { type: "application/pdf" });
}

