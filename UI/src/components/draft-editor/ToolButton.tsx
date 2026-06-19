import { cn } from "@/lib/utils";

type Side = "left" | "right" | "solo";

export default function ToolBtn({
  children,
  onClick,
  disabled,
  active,
  side = "solo",
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  side?: Side;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "sm:size-9 size-7 flex items-center justify-center bg-[#F2F2F2]",
        "text-[#292d32] cursor-pointer transition-colors",
        "hover:bg-[#E9E9E9] disabled:opacity-40 disabled:hover:bg-[#F2F2F2]",
        "[&_svg]:sm:size-[18px] [&_svg]:size-[14px]",
        side === "left" && "rounded-l-2xl rounded-r-none",
        side === "right" && "rounded-r-2xl rounded-l-none",
        side === "solo" && "rounded-2xl",
        active && "bg-[#E0E0E0]",
      )}
    >
      {children}
    </button>
  );
}

export function ToolBtnGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-[2px]">{children}</div>;
}
