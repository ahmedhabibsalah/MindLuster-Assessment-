import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import { QUERY_KEYS } from "../utils/constants";
import useTaskStore from "../store/taskStore";

export const useTasks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: taskService.getAllTasks,
  });
};

export const useTasksByColumn = (column, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS_BY_COLUMN, column, page, limit],
    queryFn: () => taskService.getTasksByColumn(column, page, limit),
    keepPreviousData: true,
  });
};

export const useSearchTasks = (query, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS, "search", query, page, limit],
    queryFn: () => taskService.searchTasks(query, page, limit),
    enabled: query.length > 0,
    keepPreviousData: true,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useTaskStore((state) => state.closeTaskForm);

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
      closeTaskForm();
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const closeTaskForm = useTaskStore((state) => state.closeTaskForm);

  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
      closeTaskForm();
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newColumn }) => taskService.moveTask(id, newColumn),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
      queryClient.invalidateQueries([QUERY_KEYS.TASKS_BY_COLUMN]);
    },
  });
};
