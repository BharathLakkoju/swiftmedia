"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SizeComparison } from "@/components/ui/SizeComparison";
import { compressImage } from "@/lib/compress-image";
import { ImageIcon, Download, Settings, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompressImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    blob: Blob | File;
    url: string;
    size: number;
  } | null>(null);

  const onFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const fileSizeMB = file.size / 1024 / 1024;
      // quality slider: 0.1 (best quality / least compression) → 0.9 (smallest / most compression)
      // initialQuality maps inversely: 0.1 slider → 0.9 JPEG quality, 0.9 slider → 0.1 JPEG quality
      const initialQuality = parseFloat((1 - quality).toFixed(2));
      // maxSizeMB: at min compression keep 90% of size; at max compression target 5% of size
      const targetRatio = 1 - quality * 0.95;
      const maxSizeMB = Math.max(0.02, fileSizeMB * targetRatio);

      const compressedFile = await compressImage(file, {
        maxSizeMB,
        maxWidthOrHeight: maxWidth,
        initialQuality,
        onProgress: (p) => setProgress(p),
      });

      const url = URL.createObjectURL(compressedFile);
      setResult({ blob: compressedFile, url, size: compressedFile.size });
    } catch (error) {
      console.error("Compression failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-full h-24 bg-card border border-border flex items-center justify-center text-foreground/20 italic rounded-xl">
        Advertisement Slot
      </div>

      <div className="card-premium">
        {!file ? (
          <FileUpload
            onFilesSelected={onFilesSelected}
            accept="image/jpeg,image/png,image/webp"
            multiple={false}
            label="Upload Image to Compress"
            description="JPG, PNG, WEBP support"
          />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* File Info */}
            <div className="flex items-center justify-between p-6 bg-secondary/5 rounded-2xl border border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-rose-500/10 p-3 rounded-xl text-rose-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-foreground/40">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Change Image
              </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center justify-between font-bold text-sm uppercase tracking-wider opacity-60">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4" />
                    <span>Compression Strength</span>
                  </div>
                  <span className="text-rose-500">
                    {Math.round(quality * 100)}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] uppercase font-bold text-foreground/30">
                  <span>Best Quality</span>
                  <span>Smallest Size</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 font-bold text-sm uppercase tracking-wider opacity-60">
                  <Settings className="w-4 h-4" />
                  <span>Max Resize Width</span>
                </label>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border-2 border-border focus:border-rose-500 bg-background outline-none font-semibold transition-all"
                >
                  <option value={3840}>4K (3840px)</option>
                  <option value={1920}>Full HD (1920px)</option>
                  <option value={1280}>720p (1280px)</option>
                  <option value={800}>Mobile (800px)</option>
                </select>
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-6 border-t border-border flex flex-col items-center space-y-6">
              {!isProcessing && !result && (
                <button
                  onClick={handleCompress}
                  className="btn-primary w-full py-4 text-lg bg-rose-600 hover:bg-rose-700"
                >
                  Compress Image Now
                </button>
              )}

              {isProcessing && (
                <ProgressBar
                  progress={progress}
                  label="Optimizing image pixels..."
                />
              )}

              {result && (
                <div className="w-full space-y-8 animate-in zoom-in duration-300">
                  <SizeComparison
                    originalSize={file.size}
                    compressedSize={result.size}
                  />

                  <a
                    href={result.url}
                    download={`compressed_${file.name}`}
                    className="flex items-center justify-center space-x-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg"
                  >
                    <Download className="w-6 h-6" />
                    <span>Download Compressed Image</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-24 bg-card border border-border flex items-center justify-center text-foreground/20 italic rounded-xl">
        Advertisement Slot
      </div>
    </div>
  );
}
