import { Editor } from "@tiptap/react";
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
          className="w-full sm:w-max sm:ml-2 rounded-full"
        >
          Download
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
