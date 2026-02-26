import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import { useMemo, useRef, useState } from "react";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { useUploadSources } from "../../_services/draft.service";
import useDeviceType from "../../lib/hooks/useDeviceType";
import { AnimatePresence, motion, type Variants } from "framer-motion";

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

/** Animations */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.58, ease: "easeOut" },
  },
};

const ContentSources = () => {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pastedText, setPastedText] = useState("");
  const canAddMore = uploads.length < MAX_FILES;
  const { isMobile } = useDeviceType();

  const uploadSources = useUploadSources();

  const onReviewSources = async () => {
    if (!uploads.length) {
      toast.error("upload some files");
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
    if (!canAddMore) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <main className="sm:my-20 my-10 flex items-center justify-center">
      <motion.div
        className="w-[580px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="sm:text-[24px] text-[18px] font-medium">
            Add your sources
          </h1>
          <p className="sm:text-[18px] text-[14px]">
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
          className={`box sm:my-10 my-5 border border-dashed border-[#9F9C9C] h-[265px] rounded-2xl flex flex-col items-center justify-center gap-6 ${
            !canAddMore ? "opacity-60" : ""
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          role="button"
          tabIndex={0}
          aria-disabled={!canAddMore}
          whileHover={canAddMore ? { scale: 1.01 } : undefined}
          whileTap={canAddMore ? { scale: 0.99 } : undefined}
          transition={{ duration: 0.18 }}
        >
          <BsFileEarmarkPdfFill size={38} color="#616161" />
          <div className="flex flex-col items-center justify-center">
            <p className="sm:text-[20px] text-[16px] text-center font-medium">
              Choose a PDF file or drag & drop it here
            </p>
            <p
              className="sm:text-[16px] text-[12px] text-center"
              style={{ fontFamily: '"Geist Mono", sans-serif' }}
            >
              Max file size is 20 MB • Up to {MAX_FILES} files
            </p>
          </div>

          <button
            className="sm:text-[18px] text-[14px] px-6 py-3 rounded-2xl bg-[#292D32] text-white cursor-pointer"
            onClick={onBrowseClick}
            disabled={!canAddMore}
          >
            Browse file
          </button>
        </motion.div>

        {/* Uploaded documents */}
        <motion.div variants={fadeUp} className="space-y-3 mb-8">
          {uploads.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="sm:text-[18px] text-[14px] font-medium">
                Uploaded files ({uploads.length}/{MAX_FILES})
              </p>
              <p
                className="sm:text-[14px] text-[12px] text-[#616161]"
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
                variants={itemAnim}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className="flex items-center justify-between bg-white sm:py-3 py-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BsFileEarmarkPdfFill
                    size={isMobile ? 20 : 32}
                    color="#616161"
                  />
                  <div className="min-w-0">
                    <p className="sm:text-[18px] text-[13px] font-medium truncate sm:w-full w-[250px]">
                      {file.name}
                    </p>
                    <p
                      className="sm:text-[16px] text-[12px] text-[#616161]"
                      style={{ fontFamily: '"Geist Mono", sans-serif' }}
                    >
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="h-9 w-9 grid place-items-center rounded-full hover:bg-[#F2F2F2]"
                  aria-label={`Remove ${file.name}`}
                  title="Remove"
                >
                  <IoClose
                    size={isMobile ? 18 : 28}
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
          <h1 className="sm:text-[20px] text-[18px] font-medium">
            Paste text (Optional)
          </h1>

          <div className="box mb-10 mt-4 bg-[#EFEFEF] h-[265px] rounded-2xl p-5 relative">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full sm:text-[20px] text-[16px] h-45 resize-none outline-0"
              placeholder="Notes, emails, copied sections, anything relevant..."
            />

            <p className="sm:text-[15px] text-[12px] right-6 absolute bottom-3">
              WORD COUNT: {pastedText.length}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center"
        >
          <button
            className="sm:text-[18px] text-[14px] px-6 py-4 disabled:bg-[#A2A2A2] disabled:cursor-not-allowed bg-black cursor-pointer text-white rounded-2xl"
            disabled={uploads.length === 0 || uploadSources.isPending}
            onClick={onReviewSources}
          >
            {uploadSources.isPending ? "Prepearing files..." : "Review sources"}
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
};
export default ContentSources;
