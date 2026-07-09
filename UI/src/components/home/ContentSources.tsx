import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import { useMemo, useRef, useState } from "react";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { useUploadSources } from "../../_services/draft.service";
import useDeviceType from "../../lib/hooks/useDeviceType";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { container, fadeUp, fileItem } from "@/lib/motion";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

type UploadedFile = {
  id: string;
  file: File;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function makeFileId(file: File) {
  return `${file.name}_${file.size}_${file.lastModified}`;
}

const ContentSources = () => {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const dragDepth = useRef(0);
  const canAddMore = uploads.length < MAX_FILES;
  const { isMobile } = useDeviceType();

  const uploadSources = useUploadSources();

  const hasPastedText = pastedText.trim().length > 0;
  const canSubmit = uploads.length > 0 || hasPastedText;

  const onReviewSources = async () => {
    if (!canSubmit) {
      toast.error("Upload a file or paste some text");
      return;
    }
    try {
      const files = uploads.map((u) => u.file);
      await uploadSources.mutateAsync({
        files,
        pastedText,
      });
    } catch {
      return;
    }
  };

  const totalSize = useMemo(
    () => uploads.reduce((sum, u) => sum + u.file.size, 0),
    [uploads],
  );

  // add files
  const addFiles = (incoming: FileList | File[]) => {
    const incomingArr = Array.from(incoming);

    // filter only PDFs
    const pdfs = incomingArr.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );

    if (pdfs.length === 0) {
      toast.error("Please select PDF files only.");
      return;
    }

    // validate size
    const tooBig = pdfs.find((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (tooBig) {
      toast.error(`"${tooBig.name}" is larger than 20 MB.`);
      return;
    }

    setUploads((prev) => {
      const prevIds = new Set(prev.map((u) => u.id));

      // dedupe + convert to UploadedFile
      const nextCandidates = pdfs
        .map((file) => ({ id: makeFileId(file), file }))
        .filter((u) => !prevIds.has(u.id));

      if (nextCandidates.length === 0) return prev;

      const remainingSlots = MAX_FILES - prev.length;
      const toAdd = nextCandidates.slice(0, remainingSlots);

      if (toAdd.length < nextCandidates.length) {
        toast.error(`Max ${MAX_FILES} files. Extra files were not added.`);
      }

      return [...prev, ...toAdd];
    });
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) addFiles(e.target.files);
    // allow picking same file again after delete
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragActive(false);
    if (!canAddMore) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddMore) return;
    dragDepth.current += 1;
    if (dragDepth.current === 1) setIsDragActive(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragActive(false);
  };

  return (
    <main className="sm:my-12 my-6 flex items-center justify-center">
      <motion.div
        className="w-[520px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="sm:text-[18px] text-[16px] font-medium tracking-[-1px]">
            Add your sources
          </h1>
          <p className="sm:text-[13px] text-[12px]">
            Upload files or paste text. We’ll combine everything into one
            document
          </p>
        </motion.div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={onInputChange}
        />

        {/* Upload box */}
        <motion.div
          variants={fadeUp}
          className={`box sm:my-6 my-4 border h-[200px] rounded-lg flex flex-col items-center justify-center gap-3 transition-[background-color,border-color] duration-200 ease-out ${
            isDragActive
              ? "border-solid border-[#292d32] bg-[#F9F8F8]"
              : "border-dashed border-[#9F9C9C] bg-transparent"
          } ${!canAddMore ? "opacity-60" : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          role="button"
          tabIndex={0}
          aria-disabled={!canAddMore}
          whileHover={canAddMore && !isDragActive ? { scale: 1.01 } : undefined}
          whileTap={canAddMore ? { scale: 0.99 } : undefined}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            animate={{ y: isDragActive ? -4 : 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <BsFileEarmarkPdfFill
              size={26}
              color={isDragActive ? "#292d32" : "#616161"}
            />
          </motion.div>
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <p className="sm:text-[15px] text-[14px] text-center font-medium">
              {isDragActive
                ? "Drop to add"
                : "Choose a PDF file or drag & drop it here"}
            </p>
            <p
              className="sm:text-[11px] text-[10px] text-center"
              style={{ fontFamily: '"Geist Mono", sans-serif' }}
            >
              Max file size is 20 MB • Up to {MAX_FILES} files
            </p>
          </div>

          <Button
            type="button"
            onClick={onBrowseClick}
            disabled={!canAddMore}
          >
            Browse file
          </Button>
        </motion.div>

        {/* Uploaded documents */}
        <motion.div variants={fadeUp} className="space-y-2 mb-6">
          {uploads.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="sm:text-[13px] text-[12px] font-medium">
                Uploaded files ({uploads.length}/{MAX_FILES})
              </p>
              <p
                className="sm:text-[11px] text-[10px] text-[#616161]"
                style={{ fontFamily: '"Geist Mono", sans-serif' }}
              >
                Total: {formatBytes(totalSize)}
              </p>
            </div>
          )}

          {/* Animate list add/remove */}
          <AnimatePresence initial={false}>
            {uploads.map(({ id, file }) => (
              <motion.div
                key={id}
                variants={fileItem}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                style={{ overflow: "hidden" }}
                className="flex items-center justify-between bg-white sm:py-2 py-1.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <BsFileEarmarkPdfFill
                    size={isMobile ? 16 : 22}
                    color="#616161"
                  />
                  <div className="min-w-0">
                    <p className="sm:text-[13px] text-[12px] font-medium truncate sm:w-full w-[250px]">
                      {file.name}
                    </p>
                    <p
                      className="sm:text-[11px] text-[10px] text-[#616161]"
                      style={{ fontFamily: '"Geist Mono", sans-serif' }}
                    >
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="h-7 w-7 grid place-items-center rounded-full hover:bg-[#F2F2F2]"
                  aria-label={`Remove ${file.name}`}
                  title="Remove"
                >
                  <IoClose
                    size={isMobile ? 14 : 18}
                    color="#616161"
                    className="cursor-pointer"
                  />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Paste text */}
        <motion.div variants={fadeUp}>
          <h1 className="sm:text-[15px] text-[14px] font-medium tracking-[-1px]">
            Paste text (Optional)
          </h1>

          <div className="box mb-6 mt-3 bg-[#EFEFEF] h-[200px] rounded-lg p-4 relative">
            <Textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full sm:text-[14px] text-[13px] h-32 min-h-0 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent"
              placeholder="Notes, emails, copied sections, anything relevant..."
            />

            <p
              className="sm:text-[11px] text-[10px] right-4 absolute bottom-2.5"
              style={{ fontFamily: '"Geist Mono", sans-serif' }}
            >
              WORD COUNT: {pastedText.length}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center"
        >
          <Button
            type="button"
            size="lg"
            disabled={!canSubmit || uploadSources.isPending}
            onClick={onReviewSources}
          >
            {uploadSources.isPending ? "Preparing files..." : "Review sources"}
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
};
export default ContentSources;
