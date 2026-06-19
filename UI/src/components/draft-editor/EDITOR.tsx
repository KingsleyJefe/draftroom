import { useEffect, useRef, useState } from "react";
import { Editor, EditorContent } from "@tiptap/react";
import { TextSelection } from "prosemirror-state";
import TitlePopover from "./TitlePopover";
import type { SourceReviewItem } from "../../_services/draft.service";
import { cn } from "@/lib/utils";

type PopoverState = {
  x: number;
  y: number;
  pos: number;
  size: number;
} | null;

const EDITOR = ({
  items,
  editor,
  hideAllTitles,
  onHideAllTitles,
}: {
  editor: Editor;
  items: SourceReviewItem[];
  hideAllTitles: boolean;
  onHideAllTitles: () => void;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<PopoverState>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const titleEl = target.closest("h3");
      if (!titleEl || !wrapper.contains(titleEl)) return;

      // Resolve the prosemirror node position from the DOM element
      const view = editor.view;
      const pos = view.posAtDOM(titleEl, 0);
      const $pos = view.state.doc.resolve(pos);
      const node = $pos.parent;
      const nodeStart = $pos.before($pos.depth);
      const nodeSize = node.nodeSize;

      const rect = titleEl.getBoundingClientRect();
      setPopover({
        x: rect.left,
        y: rect.bottom + 6,
        pos: nodeStart,
        size: nodeSize,
      });
    };

    wrapper.addEventListener("click", handler);
    return () => wrapper.removeEventListener("click", handler);
  }, [editor]);

  const removeTitle = () => {
    if (!popover) return;
    const { state, view } = editor;
    const tr = state.tr.delete(popover.pos, popover.pos + popover.size);
    tr.setSelection(TextSelection.create(tr.doc, Math.min(popover.pos, tr.doc.content.size)));
    view.dispatch(tr);
    setPopover(null);
  };

  const hideAll = () => {
    onHideAllTitles();
    setPopover(null);
  };

  return (
    <div className="mx-auto w-full max-w-[860px] sm:px-3 px-1 sm:py-4 py-2">
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

      <div
        ref={wrapperRef}
        className={cn(
          "editor-body sm:px-6 px-3 sm:py-4 py-3",
          hideAllTitles && "hide-titles",
        )}
      >
        <EditorContent
          editor={editor}
          className="prose prose-neutral max-w-none min-h-[65vh]"
        />
      </div>

      <TitlePopover
        state={popover}
        onClose={() => setPopover(null)}
        onRemove={removeTitle}
        onHideAll={hideAll}
      />
    </div>
  );
};
export default EDITOR;
