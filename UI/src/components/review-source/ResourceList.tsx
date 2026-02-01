import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ResourceBox from "./ResourceBox";
import type { SourceReviewItem } from "../../_services/draft.service";
import SortableResourceBox from "./SortableResourceBox";

export function ResourceList({
  items,
  setItems,
  collapsed,
  setCollapsed,
  removeItem,
}: {
  items: SourceReviewItem[];
  setItems: React.Dispatch<React.SetStateAction<SourceReviewItem[]>>;
  collapsed: Record<string, boolean>;
  setCollapsed: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  removeItem: (id: string) => void;
}) {
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((x) => x.id === active.id);
        const newIndex = prev.findIndex((x) => x.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((it) => (
            <SortableResourceBox key={it.id} it={it}>
              <ResourceBox
                it={it}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                removeItem={removeItem}
              />
            </SortableResourceBox>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
