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
    <div className="mx-auto w-full max-w-[860px] sm:px-3 py-1.5">
      {/* OCR warning if any source used OCR */}
      {items.some((x) => x.processStream === "OCR") && (
        <div className="mb-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-900">
            <span className="font-semibold">Scanned document detected:</span>
            <span className="text-amber-900/70">
              Some text may be inaccurate — please review.
            </span>
          </div>
        </div>
      )}

      <div>
        <div className="px-4 py-1.5 text-[15px] text-black/70">
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
