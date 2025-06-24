import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import { QUERY_KEYS } from "../utils/constants";
import useTaskStore from "../store/taskStore";
import useNotificationStore from "../store/notificationStore";

export const useTasks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: taskService.getAllTasks,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useTasksByColumn = (column, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS_BY_COLUMN, column, page, limit],
    queryFn: () => taskService.getTasksByColumn(column, page, limit),
    keepPreviousData: true,
    retry: 2,
    staleTime: 30000,
  });
};

export const useSearchTasks = (query, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS, "search", query, page, limit],
    queryFn: () => taskService.searchTasks(query, page, limit),
    enabled: query.length > 0,
    keepPreviousData: true,
    retry: 1,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useTaskStore((state) => state.closeTaskForm);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
      closeTaskForm();
      addNotification({
        type: "success",
        message: `Task "${data.title}" created successfully!`,
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: "Failed to create task. Please try again.",
        autoHide: false,
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useTaskStore((state) => state.closeTaskForm);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
      closeTaskForm();
      addNotification({
        type: "success",
        message: `Task "${data.title}" updated successfully!`,
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: "Failed to update task. Please try again.",
        autoHide: false,
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  return useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
      await queryClient.cancelQueries([QUERY_KEYS.TASKS_BY_COLUMN]);

      const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

      return { previousTasks };
    },
    onError: (error, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
      }
      addNotification({
        type: "error",
        message: "Failed to delete task. Please try again.",
        autoHide: false,
      });
    },
    onSuccess: () => {
      addNotification({
        type: "success",
        message: "Task deleted successfully!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  return useMutation({
    mutationFn: ({ id, newColumn }) => taskService.moveTask(id, newColumn),
    onMutate: async ({ id, newColumn }) => {
      await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
      await queryClient.cancelQueries([QUERY_KEYS.TASKS_BY_COLUMN]);

      const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

      if (previousTasks) {
        const optimisticTasks = previousTasks.map((task) =>
          task.id === id ? { ...task, column: newColumn } : task
        );
        queryClient.setQueryData([QUERY_KEYS.TASKS], optimisticTasks);
      }

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
      }
      addNotification({
        type: "error",
        message: "Failed to move task. Please try again.",
        autoHide: false,
      });
    },
    onSuccess: (data) => {
      addNotification({
        type: "success",
        message: `Task moved to ${data.column.replace("_", " ")} successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
    },
  });
};
