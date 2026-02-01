import { Editor, EditorContent } from "@tiptap/react";
import type { SourceReviewItem } from "../../_services/draft.service";

const EDITOR = ({
  items,
  editor,
}: {
  editor: Editor;
  items: SourceReviewItem[];
}) => {
  return (
    <div className="mx-auto w-full max-w-[980px] sm:px-4 py-2">
      {/* OCR warning if any source used OCR */}
      {items.some((x) => x.processStream === "OCR") && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[13px] text-amber-900">
            <span className="font-semibold">Scanned document detected:</span>
            <span className="text-amber-900/70">
              Some text may be inaccurate — please review.
            </span>
          </div>
        </div>
      )}

      <div>
        <div className="px-6 py-2">
          <EditorContent
            editor={editor}
            className="prose max-w-none min-h-[65vh]"
          />
        </div>
      </div>
    </div>
  );
};
export default EDITOR;
