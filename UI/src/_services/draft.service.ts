import { toast } from "sonner";
import instance from "../_api/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type UploadSourcesPayload = {
  files: File[];
  pastedText?: string;
};

export type SourceReviewItem =
  | {
      type: "pdf";
      id: string;
      processStream: "NO_OCR" | "OCR" | "NONE";
      name: string;
      sizeBytes: number;
      sizeLabel: string;
      wordCount: number;
      wordCountLabel: string; // "~1200 WORDS"
      status: "ok" | "warning";
      snippetLabel: "TEXT SNIPPET";
      snippet?: string;
      fullText: string;
      errorMessage?: string;
    }
  | {
      type: "pasted_text";
      id: string;
      processStream: "NO_OCR" | "OCR" | "NONE";
      name: "Pasted Text";
      wordCount: number;
      wordCountLabel: string;
      status: "ok";
      snippetLabel: "TEXT SNIPPET";
      fullText: string;
      snippet: string;
    };

export type ReviewSourcesResponse = {
  success: boolean;
  message: string;
  data: {
    items: SourceReviewItem[];
    totalWords: number;
    totalWordsLabel: string; // "~9,800 WORDS"
  };
};

export const useUploadSources = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["upload-sources"],
    mutationFn: async ({ files, pastedText }: UploadSourcesPayload) => {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      if (pastedText?.trim()) form.append("pastedText", pastedText.trim());
      const { data } = await instance.post<ReviewSourcesResponse>(
        "/drafts/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data.data;
    },
    onSuccess: (data) => {
      toast.success("Uploaded!");
      navigate("/review-sources", { state: { data } });
    },
    onError: () => {
      toast.error("Upload failed");
    },
  });
};
