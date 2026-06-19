import ToolBtn from "./ToolButton";
import { Editor } from "@tiptap/react";
import type { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { TextSelection } from "prosemirror-state";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { DownloadMenu } from "./DownloadButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IToolbarProps {
  title: string;
  editor: Editor;
  setTitle: React.Dispatch<SetStateAction<string>>;
}

function safeFileName(name: string) {
  const trimmed = name.trim() || "Untitled draft";
  return trimmed.replace(/[\\/:*?"<>|]+/g, "-");
}

function downloadTextAsPdf(title: string, text: string) {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 16;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  // jsPDF needs manual line wrapping
  const lines = doc.splitTextToSize(text || "", maxWidth);

  let y = margin;

  for (let i = 0; i < lines.length; i++) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  doc.save(`${safeFileName(title)}.pdf`);
}

async function downloadTextAsDocx(title: string, text: string) {
  const paragraphs = text.split(/\n{2,}/g).map(
    (p) =>
      new Paragraph({
        children: [new TextRun(p)],
      }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFileName(title)}.docx`);
}

function transformSelection(
  editor: Editor,
  transform: (text: string) => string,
) {
  const { state, view } = editor;
  const { from, to } = state.selection;

  if (from === to) return;

  const text = state.doc.textBetween(from, to, " ");
  const transformed = transform(text);

  let tr = state.tr.insertText(transformed, from, to);

  // re-apply selection so it stays highlighted
  tr = tr.setSelection(
    TextSelection.create(tr.doc, from, from + transformed.length),
  );

  view.dispatch(tr);
  view.focus();
}

const TopBar = ({ title, setTitle, editor }: IToolbarProps) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 bg-[#EFEFEF] sm:text-[16px] text-[14px]">
      <div className="p-3">
        <div className="mx-auto w-full max-w-[860px] pb-2 pt-3 flex items-center justify-between gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="hidden sm:flex rounded-full bg-white"
            aria-label="Back"
            title="Back"
          >
            ←
          </Button>

          <div className="flex sm:flex-row flex-col w-full gap-2 sm:gap-0 items-center justify-center bg-white py-1.5 px-3 sm:rounded-2xl rounded-xl border border-[#6161613e]">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 sm:mr-2.5 border-transparent bg-transparent dark:bg-transparent font-medium sm:text-[16px] text-[14px] focus-visible:bg-[#FAFAFA] focus-visible:border-[#E6E6E6] focus-visible:ring-0"
            />
            {/* simple toolbar */}
            <div className="flex items-center gap-1">
              <ToolBtn
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                active
              >
                ↶
              </ToolBtn>
              <ToolBtn
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                active
              >
                ↷
              </ToolBtn>

              <div className="mx-1.5 h-5 w-px bg-[#E6E6E6]" />

              <ToolBtn
                onClick={() =>
                  transformSelection(editor, (t) => t.toUpperCase())
                }
              >
                Aa↑
              </ToolBtn>

              <ToolBtn
                onClick={() =>
                  transformSelection(editor, (t) => t.toLowerCase())
                }
              >
                Aa↓
              </ToolBtn>

              <div className="mx-1.5 h-5 w-px bg-[#E6E6E6]" />

              <ToolBtn
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive("bold")}
              >
                B
              </ToolBtn>
              <ToolBtn
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive("italic")}
              >
                <span className="italic cursive">I</span>
              </ToolBtn>
            </div>

            {/* <button
              type="button"
              onClick={onDownload}
              className="h-10 rounded-full bg-black px-4 text-white sm:text-[18px] text-[14px] font-medium hover:bg-black/90 sm:ml-2 cursor-pointer w-full sm:w-max"
            >
              Download
            </button> */}

            {/* <div className="relative w-full">
              <button
                type="button"
                className="h-10 rounded-full bg-black px-4 text-white sm:text-[18px] text-[14px] font-medium hover:bg-black/90 sm:ml-2 cursor-pointer w-full sm:w-max"
              >
                Download
              </button>

              <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg overflow-hidden">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-[#F6F6F6]"
                  onClick={() => {
                    const plain = editor?.getText() ?? "";
                    downloadTextAsPdf(title, plain);
                  }}
                >
                  PDF (.pdf)
                </button>

                <button
                  className="w-full px-4 py-2 text-left hover:bg-[#F6F6F6]"
                  onClick={() => {
                    const plain = editor?.getText() ?? "";
                    downloadTextAsDocx(title, plain);
                  }}
                >
                  Word (.docx)
                </button>
              </div>
            </div> */}

            <DownloadMenu
              editor={editor}
              title={title}
              downloadTextAsPdf={downloadTextAsPdf}
              downloadTextAsDocx={downloadTextAsDocx}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
