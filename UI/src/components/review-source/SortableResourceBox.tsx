import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableResourceBox({
  it,
  children,
}: {
  it: { id: string };
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    activeIndex,
    overIndex,
    index,
  } = useSortable({ id: it.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 20 : "auto",
  };

  // Show drop-line above when dragging from below onto this item,
  // below when dragging from above onto this item.
  const showDropLineTop =
    isOver && !isDragging && activeIndex !== -1 && activeIndex > index;
  const showDropLineBottom =
    isOver && !isDragging && activeIndex !== -1 && activeIndex < index;
  const dragging = isDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group relative rounded-lg transition-shadow duration-200 ease-out",
        dragging
          ? "shadow-[0_12px_32px_-16px_rgba(0,0,0,0.28)] bg-white scale-[1.01]"
          : "",
      ].join(" ")}
    >
      {/* Drop-line indicator */}
      {(showDropLineTop || showDropLineBottom) && (
        <div
          className={[
            "pointer-events-none absolute left-0 right-0 flex items-center gap-2",
            showDropLineTop ? "-top-2" : "-bottom-2",
          ].join(" ")}
        >
          <span
            className="text-[9px] tracking-[0.5px] text-[#292d32] whitespace-nowrap"
            style={{ fontFamily: '"Geist Mono", sans-serif' }}
          >
            INSERT HERE
          </span>
          <span className="flex-1 h-px bg-[#292d32]" />
        </div>
      )}

      <div className="flex items-start gap-2.5">
        {/* Drag handle */}
        <button
          type="button"
          className="mt-3.5 cursor-grab active:cursor-grabbing text-[#c9c9c9] group-hover:text-[#292d32] transition-colors duration-150"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <span className="text-base leading-none select-none">⋮⋮</span>
        </button>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
