import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert, Edit, Delete, DragIndicator } from "@mui/icons-material";
import { useState } from "react";
import { useDeleteTask } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TaskCard({ task, isDragging = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const deleteTask = useDeleteTask();
  const openTaskForm = useTaskStore((state) => state.openTaskForm);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    openTaskForm(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id);
    }
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isDragging) {
    return (
      <Card sx={{ cursor: "grabbing" }}>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        cursor: isSortableDragging ? "grabbing" : "grab",
        transition: "all 0.2s",
        "&:hover": {
          transform: isSortableDragging ? "none" : "translateY(-2px)",
          boxShadow: 3,
        },
      }}
      {...attributes}>
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              {...listeners}
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 1,
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
              }}>
              <DragIndicator sx={{ color: "text.secondary", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" component="h3" sx={{ mb: 1, flexGrow: 1 }}>
              {task.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, ml: 4 }}>
          {task.description}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
          Created: {formatDate(task.createdAt)}
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
