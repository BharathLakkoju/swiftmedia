import React from "react";
import { ArrowRight, Box, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SizeComparisonProps {
  originalSize: number;
  compressedSize: number;
}

export function SizeComparison({
  originalSize,
  compressedSize,
}: SizeComparisonProps) {
  const formatSize = (bytes: number) => {
    if (bytes <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const saved = Math.max(0, originalSize - compressedSize);
  const reduction = originalSize > 0 ? (saved / originalSize) * 100 : 0;

  return (
    <div className="w-full card-premium bg-gradient-to-br from-card to-secondary/5 border-primary/20 p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-bold mb-2">
            Original
          </p>
          <p className="text-2xl font-bold">{formatSize(originalSize)}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-primary text-white p-3 rounded-full shadow-lg mb-2">
            <ArrowRight className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-primary">
            {reduction.toFixed(1)}% Smaller
          </p>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
            Compressed
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatSize(compressedSize)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-6 pt-6 border-t border-border/50">
        <div className="flex items-center space-x-2 text-sm text-foreground/60">
          <Box className="w-4 h-4" />
          <span>Storage saved: {formatSize(saved)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-500 font-medium">
          <TrendingDown className="w-4 h-4" />
          <span>Optimized</span>
        </div>
      </div>
    </div>
  );
}
