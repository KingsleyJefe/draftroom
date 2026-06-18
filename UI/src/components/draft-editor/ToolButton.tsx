export default function ToolBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "sm:h-9 sm:w-9 h-7 w-7 rounded-full border border-[#E6E6E6] sm:text-[14px] text-[9px] font-semibold cursor-pointer",
        "hover:bg-[#F6F6F6] disabled:opacity-40 disabled:hover:bg-transparent",
        active ? "bg-[#EFEFEF]" : "bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
