# SwiftMedia

> Browser-based media toolkit — compress images, videos, and PDFs, merge PDFs, and convert images to PDF, all without uploading to a server.

**Live site:** [swiftmedia.cc](https://swiftmedia.cc)

---

## About

SwiftMedia is a privacy-first media processing suite that runs entirely in the browser. Files are processed locally using WebAssembly (FFmpeg) and browser APIs — nothing is ever uploaded to a remote server.

## Features

- **Image Compression** — Reduce image file sizes while preserving quality (JPEG, PNG, WebP)
- **Video Compression** — Compress MP4 and other video formats in-browser via FFmpeg WebAssembly
- **PDF Compression** — Shrink PDF file sizes for easier sharing
- **Merge PDFs** — Combine multiple PDF files into a single document
- **Image to PDF** — Convert one or more images into a PDF file
- Animated, accessible UI powered by Framer Motion
- Privacy-first — all processing is client-side, zero file uploads ever

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Video Processing | @ffmpeg/ffmpeg (WebAssembly) |
| Image Compression | browser-image-compression |
| PDF Processing | pdf-lib, jspdf |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

## Local Development

```bash
git clone https://github.com/BharathLakkoju/swiftmedia
cd swiftmedia
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Feature |
|-------|---------|
| `/` | Home — all tools overview |
| `/compress-image` | Image compression |
| `/compress-video` | Video compression |
| `/compress-pdf` | PDF compression |
| `/merge-pdf` | PDF merger |
| `/image-to-pdf` | Image to PDF converter |

## License

MIT
