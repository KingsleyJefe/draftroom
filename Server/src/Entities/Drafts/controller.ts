import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../global/constants/http-status-codes";
import DraftsService from "./service";

export const getDrafts = async (
  req: Request<object, object, { pastedText?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const pastedText = String(req.body?.pastedText || "").trim();

    if (!files.length && !pastedText) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please upload at least one PDF or paste some text.",
      });
    }

    const items = [];
    let totalWords = 0;

    // PDFs
    for (const f of files) {
      const id = DraftsService.makeId(
        `${f.originalname}_${f.size}_${f.mimetype}`,
      );

      let status: "ok" | "warning" = "ok";
      let snippet = "";
      let fullText = "";
      let wc = 0;
      let errorMessage: string | undefined;
      let processStream: "NO_OCR" | "OCR" | "NONE" = "NONE";

      try {
        const { text, stream } = await DraftsService.extractPdfText(f.buffer);

        fullText = text;
        processStream = stream;
        wc = DraftsService.wordCountOf(text);
        snippet = DraftsService.snippetOf(text);

        // treat “no readable text” as warning (like your screenshot)
        if (wc === 0 || snippet.length < 10) {
          status = "warning";
          errorMessage =
            "WE COULDN’T EXTRACT READABLE TEXT FROM FILE. YOU CAN RETRY UPLOAD, ADD A NEW FILE OR REMOVE THIS FILE.";
        }
      } catch {
        status = "warning";
        errorMessage =
          "WE COULDN’T EXTRACT READABLE TEXT FROM FILE. YOU CAN RETRY UPLOAD, ADD A NEW FILE OR REMOVE THIS FILE.";
      }

      totalWords += wc;

      items.push({
        type: "pdf",
        processStream: processStream,
        id,
        name: f.originalname,
        sizeBytes: f.size,
        sizeLabel: DraftsService.formatBytes(f.size),
        wordCount: wc,
        wordCountLabel: DraftsService.approxWordsLabel(wc),
        status,
        snippetLabel: "TEXT SNIPPET",
        snippet: status === "ok" ? snippet : undefined,
        fullText: status === "ok" ? fullText : undefined,
        errorMessage,
      });
    }

    if (pastedText) {
      const wc = pastedText?.length;
      totalWords += wc;

      items.push({
        type: "pasted_text",
        processStream: "NONE",
        id: DraftsService.makeId(`pasted_${pastedText.slice(0, 50)}`),
        name: "Pasted Text",
        wordCount: wc,
        wordCountLabel: DraftsService.approxWordsLabel(wc),
        status: "ok",
        snippetLabel: "TEXT SNIPPET",
        snippet: DraftsService.snippetOf(pastedText),
        fullText: pastedText,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "sources uploaded successfully",
      data: {
        items,
        totalWords,
        totalWordsLabel: `~${totalWords.toLocaleString()} WORDS`,
      },
    });
  } catch (error) {
    next(error);
  }
};
