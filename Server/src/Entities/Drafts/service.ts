/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { createCanvas } from "@napi-rs/canvas";
import { createWorker } from "tesseract.js";

const SNIPPET_LEN = 220;
const MIN_TEXT_CHARS = 30;

const DraftsService = {
  makeId: function (input: string) {
    return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
  },

  shouldOcr: function (extractedText: string) {
    return DraftsService.cleanText(extractedText).length < MIN_TEXT_CHARS;
  },

  formatBytes: function (bytes: number) {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 2)} MB`;
    return `${kb.toFixed(0)} KB`;
  },

  cleanText: function (text: string) {
    return text.replace(/\s+/g, " ").trim();
  },

  wordCountOf: function (text: string) {
    const t = DraftsService.cleanText(text);
    if (!t) return 0;
    return t.split(" ").filter(Boolean).length;
  },

  approxWordsLabel: function (n: number) {
    const rounded =
      n >= 1000 ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10;
    return `~${rounded.toLocaleString()} WORDS`;
  },

  snippetOf: function (text: string) {
    const t = DraftsService.cleanText(text);
    if (!t) return "";
    return t.length > SNIPPET_LEN ? `${t.slice(0, SNIPPET_LEN).trim()}…` : t;
  },

  extractWithPdfJs: async function (buffer: Buffer) {
    // dynamic import avoids ESM/CJS headaches
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const doc = await loadingTask.promise;

    let out = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .map((it: any) => ("str" in it ? it.str : ""))
        .filter(Boolean);
      out += strings.join(" ") + "\n";
    }
    return out;
  },

  extractPdfText: async function (buffer: Buffer): Promise<{
    stream: "NO_OCR" | "OCR";
    text: string;
  }> {
    const text = DraftsService.cleanText(
      await DraftsService.extractWithPdfJs(buffer),
    );
    if (!DraftsService.shouldOcr(text)) return { stream: "NO_OCR", text };

    // OCR fallback (only if needed)
    const { images } = await DraftsService.renderPdfPagesToPngBuffers(buffer, {
      maxPages: 8, // efficiency guard
      scale: 1.6, // balance
    });

    const ocrTextRaw = await DraftsService.ocrPngBuffers(images, "eng");
    return { stream: "OCR", text: DraftsService.cleanText(ocrTextRaw) };
  },

  renderPdfPagesToPngBuffers: async function (
    buffer: Buffer,
    opts?: {
      maxPages?: number;
      scale?: number;
    },
  ) {
    const maxPages = opts?.maxPages ?? 30; // efficiency guard
    const scale = opts?.scale ?? 1.5;

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) })
      .promise;

    const pageCount = Math.min(doc.numPages, maxPages);
    const images: Buffer[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = createCanvas(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height),
      );
      const ctx = canvas.getContext("2d");

      await page.render({
        canvasContext: ctx as any,
        canvas: canvas as any,
        viewport,
      } as any).promise;

      images.push(canvas.toBuffer("image/png"));
    }

    return { images, totalPages: doc.numPages, renderedPages: pageCount };
  },

  ocrPngBuffers: async function (pngBuffers: Buffer[], lang = "eng") {
    const worker = await createWorker(lang);

    // speed-first config. You can tune later for accuracy.
    await worker.setParameters({
      tessedit_pageseg_mode: "6", // assume block of text
    } as any);

    let combined = "";

    for (const img of pngBuffers) {
      const { data } = await worker.recognize(img);
      combined += (data.text || "") + "\n";
    }

    await worker.terminate();
    return combined;
  },
};

export default DraftsService;
