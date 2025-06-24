import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import { MoreVert, Edit, Delete, DragIndicator } from "@mui/icons-material";
import { useState, useRef } from "react";
import { useDeleteTask } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function TaskCard({ task, isDragging = false, animationDelay = 0 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [focused, setFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

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
    transition: isSortableDragging
      ? transition
      : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleEdit();
    }
    if (event.key === "Delete") {
      event.preventDefault();
      handleDelete();
    }
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  if (isDragging) {
    return (
      <Zoom in={true}>
        <Card
          sx={{
            cursor: "grabbing",
            transform: "rotate(5deg) scale(1.05)",
            opacity: 0.9,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            border: `2px solid ${theme.palette.primary.main}`,
            background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
          }}
          aria-hidden="true">
          <CardContent sx={{ pb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          </CardContent>
        </Card>
      </Zoom>
    );
  }

  return (
    <Grow
      in={true}
      timeout={300 + animationDelay * 100}
      style={{ transformOrigin: "0 0 0" }}>
      <Card
        ref={(node) => {
          setNodeRef(node);
          cardRef.current = node;
        }}
        style={style}
        tabIndex={0}
        role="button"
        aria-label={`Task: ${task.title}. Press Enter to edit, Delete key to remove.`}
        aria-describedby={`task-${task.id}-description`}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          cursor: isSortableDragging ? "grabbing" : "grab",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: focused ? `2px solid ${theme.palette.primary.main}` : "none",
          outlineOffset: "2px",
          position: "relative",
          overflow: "hidden",
          background: isHovered
            ? "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)"
            : "#fff",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "&:hover": {
            transform: isSortableDragging
              ? "none"
              : "translateY(-4px) scale(1.02)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: "2px",
          },
          "&:active": {
            transform: "scale(0.98)",
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
            <Box
              sx={{ display: "flex", alignItems: "flex-start", flexGrow: 1 }}>
              <Fade in={isHovered} timeout={200}>
                <Box
                  {...listeners}
                  tabIndex={-1}
                  role="button"
                  aria-label="Drag to move task"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1,
                    mt: 0.5,
                    cursor: "grab",
                    p: 0.5,
                    borderRadius: 1,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: isHovered ? 1 : 0.3,
                    "&:active": { cursor: "grabbing" },
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "scale(1.1)",
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: "2px",
                    },
                  }}>
                  <DragIndicator
                    sx={{
                      color: "text.secondary",
                      fontSize: isMobile ? 16 : 20,
                      transition: "color 0.2s ease",
                    }}
                    aria-hidden="true"
                  />
                </Box>
              </Fade>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h3"
                  sx={{
                    mb: 1,
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                    transition: "color 0.2s ease",
                    color: isHovered ? "primary.main" : "text.primary",
                  }}>
                  {task.title}
                </Typography>
              </Box>
            </Box>

            <Zoom in={true} timeout={300}>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label={`More options for ${task.title}`}
                aria-expanded={Boolean(anchorEl)}
                aria-haspopup="true"
                sx={{
                  ml: 1,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "rotate(90deg) scale(1.1)",
                    bgcolor: "action.hover",
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: "2px",
                  },
                }}>
                <MoreVert />
              </IconButton>
            </Zoom>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              ml: isMobile ? 0 : 4,
              wordBreak: "break-word",
              lineHeight: 1.4,
              transition: "color 0.2s ease",
            }}
            id={`task-${task.id}-description`}>
            {task.description}
          </Typography>

          <Box
            sx={{
              ml: isMobile ? 0 : 4,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
                animation: isHovered ? "pulse 2s infinite" : "none",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                  "50%": {
                    transform: "scale(1.2)",
                    opacity: 0.7,
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              aria-label={`Created ${formatRelativeTime(task.createdAt)}`}>
              {formatRelativeTime(task.createdAt)}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            transitionDuration={200}
            MenuListProps={{
              "aria-labelledby": "task-options-button",
              role: "menu",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
            }}>
            <MenuItem
              onClick={handleEdit}
              role="menuitem"
              aria-label={`Edit ${task.title}`}
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  transform: "translateX(4px)",
                },
              }}>
              <Edit sx={{ mr: 1 }} fontSize="small" aria-hidden="true" />
              Edit
            </MenuItem>
            <MenuItem
              onClick={handleDelete}
              sx={{
                color: "error.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "error.main",
                  color: "error.contrastText",
                  transform: "translateX(4px)",
                },
              }}
              role="menuitem"
              aria-label={`Delete ${task.title}`}>
              <Delete sx={{ mr: 1 }} fontSize="small" aria-hidden="true" />
              Delete
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </Grow>
  );
}
