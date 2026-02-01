import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Editor } from "@tiptap/react";

export function DownloadMenu({
  editor,
  title,
  downloadTextAsPdf,
  downloadTextAsDocx,
}: {
  editor: Editor;
  title: string;
  downloadTextAsPdf: (title: string, text: string) => void;
  downloadTextAsDocx: (title: string, text: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const downloadPdf = () => {
    const plain = editor?.getText?.() ?? "";
    downloadTextAsPdf(title, plain);
    setOpen(false);
  };

  const downloadDocx = async () => {
    const plain = editor?.getText?.() ?? "";
    await downloadTextAsDocx(title, plain);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full sm:w-max">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 rounded-full bg-black px-4 text-white sm:text-[18px] text-[14px] font-medium hover:bg-black/90 sm:ml-2 cursor-pointer w-full sm:w-max"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Download
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-full sm:w-44 rounded-xl border border-[#E6E6E6] bg-white shadow-lg overflow-hidden z-50"
          >
            <button
              role="menuitem"
              className="w-full px-4 py-2 text-left text-[14px] sm:text-[16px] hover:bg-[#F6F6F6]"
              onClick={downloadPdf}
            >
              PDF (.pdf)
            </button>

            <button
              role="menuitem"
              className="w-full px-4 py-2 text-left text-[14px] sm:text-[16px] hover:bg-[#F6F6F6]"
              onClick={downloadDocx}
            >
              Word (.docx)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
