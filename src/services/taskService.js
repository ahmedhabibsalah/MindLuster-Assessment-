import api from "./api";

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get("/tasks");
    return response.data;
  },

  getTasksByColumn: async (column, page = 1, limit = 10) => {
    const response = await api.get("/tasks", {
      params: {
        column,
        _page: page,
        _limit: limit,
      },
    });
    return {
      data: response.data,
      total: parseInt(response.headers["x-total-count"] || "0"),
      page,
      limit,
    };
  },

  searchTasks: async (query, page = 1, limit = 10) => {
    const response = await api.get("/tasks", {
      params: {
        q: query,
        _page: page,
        _limit: limit,
      },
    });
    return {
      data: response.data,
      total: parseInt(response.headers["x-total-count"] || "0"),
      page,
      limit,
    };
  },

  createTask: async (taskData) => {
    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await api.post("/tasks", newTask);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const updatedTask = {
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    const response = await api.put(`/tasks/${id}`, updatedTask);
    return response.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
  },

  moveTask: async (id, newColumn) => {
    const response = await api.get(`/tasks/${id}`);
    const task = response.data;

    const updatedTask = {
      ...task,
      column: newColumn,
      updatedAt: new Date().toISOString(),
    };

    const updateResponse = await api.put(`/tasks/${id}`, updatedTask);
    return updateResponse.data;
  },
};
