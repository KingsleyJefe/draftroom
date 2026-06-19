import { useEffect, useRef } from "react";
import { IconX, IconEyeOff } from "@tabler/icons-react";

type PopoverState = {
  x: number;
  y: number;
};

export default function TitlePopover({
  state,
  onClose,
  onRemove,
  onHideAll,
}: {
  state: PopoverState | null;
  onClose: () => void;
  onRemove: () => void;
  onHideAll: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    // Defer to allow opening click to register
    const id = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handler);
    };
  }, [state, onClose]);

  if (!state) return null;

  return (
    <div
      ref={ref}
      style={{ left: state.x, top: state.y }}
      className="fixed z-50 bg-[#e3e2e2] border-2 border-[#6161611a] rounded-xl p-[6px] flex flex-col gap-1.5 shadow-md"
    >
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-white/60 transition-colors cursor-pointer"
      >
        <IconX className="size-[18px] text-[#616161]" />
        <span className="font-mono uppercase text-[12px] tracking-[-0.3px] text-[#616161] whitespace-nowrap">
          Remove this title
        </span>
      </button>
      <button
        type="button"
        onClick={onHideAll}
        className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-white/60 transition-colors cursor-pointer"
      >
        <IconEyeOff className="size-[18px] text-[#d30404]" />
        <span className="font-mono uppercase text-[12px] tracking-[-0.3px] text-[#d30404] whitespace-nowrap">
          Turn off all titles
        </span>
      </button>
    </div>
  );
}
