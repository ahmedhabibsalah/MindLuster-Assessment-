import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { COLUMNS, COLUMN_TITLES } from "../../utils/constants";
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";

export function TaskForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const titleFieldRef = useRef(null);

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
    if (isTaskFormOpen) {
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

      setTimeout(() => {
        titleFieldRef.current?.focus();
      }, 100);
    }
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
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      errorElement?.focus();
      return;
    }

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

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  const isLoading = createTask.isLoading || updateTask.isLoading;
  const dialogTitle = editingTask ? "Edit Task" : "Create New Task";

  return (
    <Dialog
      open={isTaskFormOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="task-form-title"
      aria-describedby="task-form-description"
      onKeyDown={handleKeyDown}
      sx={{
        "& .MuiDialog-paper": {
          minHeight: isMobile ? "100vh" : "auto",
        },
      }}>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle
          id="task-form-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}>
          {dialogTitle}
          {isMobile && (
            <IconButton
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Close dialog"
              size="small">
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent>
          <Box
            id="task-form-description"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 1,
            }}>
            <TextField
              name="title"
              label="Task Title"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={
                errors.title || "Enter a descriptive title for your task"
              }
              disabled={isLoading}
              fullWidth
              required
              inputRef={titleFieldRef}
              aria-describedby="title-helper-text"
              inputProps={{
                maxLength: 100,
                "aria-label": "Task title",
              }}
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={
                errors.description || "Provide details about the task"
              }
              disabled={isLoading}
              multiline
              rows={4}
              fullWidth
              required
              aria-describedby="description-helper-text"
              inputProps={{
                maxLength: 500,
                "aria-label": "Task description",
              }}
            />

            <TextField
              name="column"
              select
              label="Status"
              value={formData.column}
              onChange={handleChange("column")}
              disabled={isLoading}
              fullWidth
              aria-describedby="column-helper-text"
              helperText="Select the current status of the task">
              {Object.entries(COLUMN_TITLES).map(([key, title]) => (
                <MenuItem key={key} value={key}>
                  {title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Cancel and close dialog">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            aria-label={
              isLoading
                ? "Saving task..."
                : editingTask
                ? "Update task"
                : "Create task"
            }>
            {isLoading ? "Saving..." : editingTask ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
