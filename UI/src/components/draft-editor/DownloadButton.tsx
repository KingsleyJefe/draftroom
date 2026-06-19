import { Editor } from "@tiptap/react";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DownloadMenu({
  editor,
  title,
  downloadTextAsDocx,
}: {
  editor: Editor;
  title: string;
  downloadTextAsPdf?: (title: string, text: string) => void;
  downloadTextAsDocx: (title: string, text: string) => Promise<void> | void;
}) {
  const downloadDocx = async () => {
    const plain = editor?.getText?.() ?? "";
    await downloadTextAsDocx(title, plain);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="rounded-2xl bg-[#292d32] hover:bg-[#1f2226] sm:h-9 h-7 sm:px-4 px-3 sm:text-[15px] text-[12px] font-medium"
        >
          Download
          <IconDownload className="sm:size-[18px] size-[14px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="sm:min-w-40">
        <DropdownMenuItem onSelect={downloadDocx}>
          Word (.docx)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
