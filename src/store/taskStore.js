import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useTaskStore = create()(
  devtools(
    (set, get) => ({
      searchQuery: "",
      currentPage: {
        backlog: 1,
        in_progress: 1,
        review: 1,
        done: 1,
      },
      pageSize: 10,
      draggedTask: null,
      isTaskFormOpen: false,
      editingTask: null,

      setSearchQuery: (query) => set({ searchQuery: query }),

      setCurrentPage: (column, page) =>
        set((state) => ({
          currentPage: {
            ...state.currentPage,
            [column]: page,
          },
        })),

      setDraggedTask: (task) => set({ draggedTask: task }),

      openTaskForm: (task = null) =>
        set({
          isTaskFormOpen: true,
          editingTask: task,
        }),

      closeTaskForm: () =>
        set({
          isTaskFormOpen: false,
          editingTask: null,
        }),

      resetPagination: () =>
        set({
          currentPage: {
            backlog: 1,
            in_progress: 1,
            review: 1,
            done: 1,
          },
        }),
    }),
    {
      name: "task-store",
    }
  )
);

export default useTaskStore;
