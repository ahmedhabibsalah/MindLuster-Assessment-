import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { useMoveTask } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";
import { TaskCard } from "../Task/TaskCard";

export function DnDProvider({ children }) {
  const [activeTask, setActiveTask] = useState(null);
  const moveTask = useMoveTask();
  const setDraggedTask = useTaskStore((state) => state.setDraggedTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = active.data.current?.task;
    setActiveTask(task);
    setDraggedTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);
    setDraggedTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task;
    const overColumn = over.data.current?.column;
    const overTask = over.data.current?.task;

    if (!activeTask) return;

    let newColumn = activeTask.column;

    if (overColumn) {
      newColumn = overColumn;
    } else if (overTask) {
      newColumn = overTask.column;
    }

    if (newColumn !== activeTask.column) {
      moveTask.mutate({
        id: activeTask.id,
        newColumn: newColumn,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>
        {activeTask ? (
          <div style={{ transform: "rotate(5deg)", opacity: 0.8 }}>
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
