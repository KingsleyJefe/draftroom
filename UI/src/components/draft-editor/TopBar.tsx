import ToolBtn, { ToolBtnGroup } from "./ToolButton";
import { Editor } from "@tiptap/react";
import type { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { DownloadMenu } from "./DownloadButton";
import { Input } from "@/components/ui/input";
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconItalic,
} from "@tabler/icons-react";

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
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 16;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

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
    (p) => new Paragraph({ children: [new TextRun(p)] }),
  );
  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFileName(title)}.docx`);
}

const TopBar = ({ title, setTitle, editor }: IToolbarProps) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 bg-[#EFEFEF]">
      <div className="px-3 pt-3 pb-2">
        <div className="mx-auto w-full max-w-[860px] flex items-center gap-2.5">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="hidden sm:flex shrink-0 items-center justify-center bg-white border-2 border-[#6161611a] rounded-full size-11 hover:bg-[#FAFAFA] cursor-pointer transition-colors"
          >
            <IconArrowLeft className="size-5 text-[#292d32]" />
          </button>

          {/* Pill toolbar */}
          <div className="flex sm:flex-row flex-col w-full gap-2 sm:gap-0 items-center sm:justify-between bg-white sm:py-1.5 py-2 sm:px-4 px-3 sm:rounded-[28px] rounded-2xl border-2 border-[#6161611a]">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled draft"
              className="flex-1 sm:mr-3 border-transparent bg-transparent dark:bg-transparent font-medium sm:text-[16px] text-[14px] tracking-[-0.4px] text-[#292d32] focus-visible:bg-[#FAFAFA] focus-visible:border-[#E6E6E6] focus-visible:ring-0 placeholder:text-[#292d32]/40"
            />

            <div className="flex items-center sm:gap-4 gap-2">
              {/* Grouped tool buttons */}
              <div className="flex items-center sm:gap-2 gap-1.5">
                <ToolBtnGroup>
                  <ToolBtn
                    side="left"
                    ariaLabel="Undo"
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().undo()}
                  >
                    <IconArrowBackUp />
                  </ToolBtn>
                  <ToolBtn
                    side="right"
                    ariaLabel="Redo"
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().redo()}
                  >
                    <IconArrowForwardUp />
                  </ToolBtn>
                </ToolBtnGroup>

                <ToolBtnGroup>
                  <ToolBtn
                    side="left"
                    ariaLabel="Bold"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive("bold")}
                  >
                    <IconBold />
                  </ToolBtn>
                  <ToolBtn
                    side="right"
                    ariaLabel="Italic"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive("italic")}
                  >
                    <IconItalic />
                  </ToolBtn>
                </ToolBtnGroup>
              </div>

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
    </div>
  );
};
export default TopBar;
