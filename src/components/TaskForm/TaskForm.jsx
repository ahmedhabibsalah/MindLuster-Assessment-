import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { COLUMNS, COLUMN_TITLES } from "../../utils/constants";
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";

export function TaskForm() {
  const { isTaskFormOpen, editingTask, closeTaskForm } = useTaskStore();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    column: COLUMNS.BACKLOG,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        column: editingTask.column,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        column: COLUMNS.BACKLOG,
      });
    }
    setErrors({});
  }, [editingTask, isTaskFormOpen]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (editingTask) {
      updateTask.mutate({
        id: editingTask.id,
        data: formData,
      });
    } else {
      createTask.mutate(formData);
    }
  };

  const handleClose = () => {
    if (!createTask.isLoading && !updateTask.isLoading) {
      closeTaskForm();
    }
  };

  const isLoading = createTask.isLoading || updateTask.isLoading;

  return (
    <Dialog open={isTaskFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isLoading}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isLoading}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              select
              label="Column"
              value={formData.column}
              onChange={handleChange("column")}
              disabled={isLoading}
              fullWidth>
              {Object.values(COLUMNS).map((column) => (
                <MenuItem key={column} value={column}>
                  {COLUMN_TITLES[column]}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : editingTask ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
