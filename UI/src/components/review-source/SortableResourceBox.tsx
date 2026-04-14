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
  } = useSortable({ id: it.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-lg",
        isDragging ? "opacity-80 ring-2 ring-indigo-500/50" : "",
      ].join(" ")}
    >
      {/* Drag handle */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-5 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-200"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          {/* simple handle icon */}
          <span className="text-xl leading-none">⋮⋮</span>
        </button>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
