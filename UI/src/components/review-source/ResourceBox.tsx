/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { PiTextAUnderlineFill } from "react-icons/pi";
import type { SourceReviewItem } from "../../_services/draft.service";
import useDeviceType from "../../lib/hooks/useDeviceType";

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const ResourceBox = ({
  it,
  collapsed,
  setCollapsed,
  removeItem,
}: {
  it: SourceReviewItem;
  removeItem: (id: string) => void;
  collapsed: Record<string, boolean>;
  setCollapsed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) => {
  const { isMobile } = useDeviceType();
  const ok = it.status === "ok";
  const isPdf = it.type === "pdf";
  const isCollapsed = collapsed[it.id] ?? false;
  const isOCR = it.processStream === "OCR";

  const toggleCollapsed = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const retryItem = (id: string) => {
    console.log(id);
    toast.message("Retry not wired yet", {
      description: "Hook it to /drafts/retry",
    });
  };

  return (
    <div
      key={it.id}
      className="flex gap-2.5 sm:my-2.5 sm:p-3 rounded-lg bg-[#F9F8F8] p-2"
    >
      <div className="flex-1">
        {/* top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="">
              {isPdf ? (
                <BsFileEarmarkPdfFill
                  size={isMobile ? 14 : 20}
                  className="text-[#4A4A4A]"
                />
              ) : (
                <PiTextAUnderlineFill
                  size={isMobile ? 14 : 20}
                  className="text-[#4A4A4A]"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0 w-[160px] sm:w-[360px]">
                <p className="sm:text-[13px] text-[12px] font-medium truncate">
                  {isPdf ? it.name : "Pasted Text"}
                </p>

                <span
                  className={classNames(
                    "sm:text-[13px] text-[12px] leading-none",
                    ok ? "text-[#2BBE52]" : "text-[#F0B429]",
                  )}
                  title={ok ? "OK" : "Warning"}
                >
                  {ok ? "✓" : "⚠"}
                </span>
              </div>

              {isOCR && (
                <div className="py-0.5 mb-1 inline-flex items-center text-[#D11A2A] gap-2 rounded-ful px-1 text-[10px]">
                  <span className="font-semibold">
                    Text was extracted from an image and may need review.
                  </span>
                </div>
              )}
              <p
                className="sm:text-[10px] text-[9px] text-[#616161] whitespace-nowrap"
                style={{ fontFamily: '"Geist Mono", sans-serif' }}
              >
                {isPdf ? `${(it as any).sizeLabel} ` : ""}
                {it.wordCountLabel}
              </p>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-1.5">
            {isPdf && !ok && (
              <button
                type="button"
                className="h-7 w-7 grid place-items-center rounded-full hover:bg-[#F2F2F2]"
                onClick={() => retryItem(it.id)}
                aria-label="Retry"
                title="Retry"
              >
                <FiRefreshCw size={isMobile ? 12 : 14} className="text-[#616161]" />
              </button>
            )}

            <button
              type="button"
              className="h-7 w-7 grid place-items-center rounded-full hover:bg-[#F2F2F2]"
              onClick={() => removeItem(it.id)}
              aria-label="Remove"
              title="Remove"
            >
              <IoTrashOutline
                size={isMobile ? 12 : 16}
                className="text-[#D11A2A] cursor-pointer"
              />
            </button>

            {/* Animated chevron */}
            <button
              type="button"
              className="h-7 w-7 grid cursor-pointer place-items-center rounded-full hover:bg-[#F2F2F2]"
              onClick={() => toggleCollapsed(it.id)}
              aria-label={isCollapsed ? "Expand" : "Collapse"}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#616161"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>
          </div>
        </div>

        <motion.div
          layout
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
          }}
          transition={{
            height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.25, ease: "easeOut" },
          }}
          style={{
            overflow: "hidden",
            pointerEvents: isCollapsed ? "none" : "auto",
          }}
        >
          <div className="mt-2 rounded-lg sm:p-3 p-2">
            {ok ? (
              <>
                <p
                  className="sm:text-[11px] text-[10px] text-[#6B6B6B]"
                  style={{ fontFamily: '"Geist Mono", sans-serif' }}
                >
                  TEXT SNIPPET
                </p>

                <div className="w-full mt-2 sm:w-[460px] bg-[#EFEFEF] rounded-lg sm:p-3 p-2 sm:text-[12px] text-[11px] text-[#2C2C2C] leading-5">
                  {"snippet" in it ? it.snippet : ""}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-[#5A5A5A] leading-5">
                {(it as any).errorMessage ??
                  "WE COULDN’T EXTRACT READABLE TEXT FROM FILE."}{" "}
                <span className="underline cursor-pointer">ADD A NEW FILE</span>{" "}
                OR REMOVE THIS FILE
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default ResourceBox;
