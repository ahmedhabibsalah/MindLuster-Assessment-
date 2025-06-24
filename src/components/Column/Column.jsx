import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Fade,
  Slide,
} from "@mui/material";
import { TaskCard } from "../Task/TaskCard";
import { TaskCardSkeleton } from "../Loading/LoadingSkeleton";
import { useTasksByColumn, useSearchTasks } from "../../hooks/useTasks";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import useTaskStore from "../../store/taskStore";
import { PAGE_SIZE } from "../../utils/constants";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

export function Column({ columnKey, title, animationDelay = 0 }) {
  const { searchQuery, currentPage, setCurrentPage, draggedTask } =
    useTaskStore();
  const [scrollMode, setScrollMode] = useState("button");
  const [isHovered, setIsHovered] = useState(false);
  const page = currentPage[columnKey];

  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
    data: {
      column: columnKey,
    },
  });

  const tasksQuery = useTasksByColumn(columnKey, page, PAGE_SIZE);
  const searchQuery_trimmed = searchQuery.trim();
  const searchResults = useSearchTasks(searchQuery_trimmed, 1, 100);

  const isSearching = searchQuery_trimmed.length > 0;
  const query = isSearching ? searchResults : tasksQuery;
  const { data, isLoading, error, isFetching } = query;

  let tasks = [];
  let total = 0;
  let hasMore = false;

  if (data) {
    if (isSearching) {
      tasks = data.data.filter((task) => task.column === columnKey);
      total = tasks.length;
    } else {
      tasks = data.data || [];
      total = data.total || 0;
      hasMore = page * PAGE_SIZE < total;
    }
  }

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(columnKey, page + 1);
    }
  };

  const lastElementRef = useInfiniteScroll(
    hasMore && scrollMode === "infinite",
    isLoading,
    handleLoadMore
  );

  const isDraggedTaskInColumn = draggedTask && draggedTask.column === columnKey;
  const canDrop = isOver && draggedTask && draggedTask.column !== columnKey;

  const toggleScrollMode = () => {
    setScrollMode(scrollMode === "button" ? "infinite" : "button");
  };

  const getColumnColor = () => {
    switch (columnKey) {
      case "backlog":
        return "#f3f4f6";
      case "in_progress":
        return "#dbeafe";
      case "review":
        return "#fef3c7";
      case "done":
        return "#d1fae5";
      default:
        return "#f9fafb";
    }
  };

  const getHeaderColor = () => {
    switch (columnKey) {
      case "backlog":
        return "#6b7280";
      case "in_progress":
        return "#2563eb";
      case "review":
        return "#d97706";
      case "done":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  if (error) {
    return (
      <Slide direction="up" in={true} timeout={300 + animationDelay * 100}>
        <Paper
          sx={{
            flex: "1 1 300px",
            minWidth: 300,
            maxWidth: 350,
            p: 2,
            height: "fit-content",
            minHeight: "500px",
            bgcolor: "#ffebee",
          }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load tasks. Please try again.
            <Button
              size="small"
              onClick={() => window.location.reload()}
              sx={{ ml: 1 }}>
              Retry
            </Button>
          </Alert>
        </Paper>
      </Slide>
    );
  }

  return (
    <Slide direction="up" in={true} timeout={300 + animationDelay * 100}>
      <Paper
        ref={setNodeRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          flex: "1 1 300px",
          minWidth: 300,
          maxWidth: 350,
          bgcolor: canDrop
            ? "primary.light"
            : isDraggedTaskInColumn
            ? "grey.200"
            : getColumnColor(),
          p: 2,
          height: "fit-content",
          minHeight: "500px",
          maxHeight: "80vh",
          border: canDrop ? "3px dashed" : "2px solid transparent",
          borderColor: canDrop ? "primary.main" : "transparent",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 8px 32px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${getHeaderColor()}, ${getHeaderColor()}80)`,
            transform: isHovered ? "scaleX(1)" : "scaleX(0.8)",
            transformOrigin: "center",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}>
        <Box sx={{ mb: 2, position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Fade in={true} timeout={500 + animationDelay * 100}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: getHeaderColor(),
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}>
                {title}
              </Typography>
            </Fade>

            <Fade in={true} timeout={600 + animationDelay * 100}>
              <Button
                size="small"
                variant="text"
                onClick={toggleScrollMode}
                sx={{
                  fontSize: "0.75rem",
                  minWidth: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "rotate(180deg) scale(1.1)",
                    bgcolor: "action.hover",
                  },
                }}
                aria-label={
                  scrollMode === "button"
                    ? "Switch to infinite scroll"
                    : "Switch to button pagination"
                }>
                {scrollMode === "button" ? "∞" : "⬇"}
              </Button>
            </Fade>
          </Box>

          <Fade in={true} timeout={700 + animationDelay * 100}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: getHeaderColor(),
                  animation: total > 0 ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.2)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {total} task{total !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Fade>

          {canDrop && (
            <Fade in={true}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  animation: "bounce 1s infinite",
                  "@keyframes bounce": {
                    "0%, 20%, 53%, 80%, 100%": { transform: "translateY(0)" },
                    "40%, 43%": { transform: "translateY(-8px)" },
                    "70%": { transform: "translateY(-4px)" },
                    "90%": { transform: "translateY(-2px)" },
                  },
                }}>
                Drop here to move task
              </Typography>
            </Fade>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            flexGrow: 1,
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(0,0,0,0.3)",
              },
            },
          }}>
          {isLoading && page === 1 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Fade in={true} timeout={300 + index * 100} key={index}>
                  <div>
                    <TaskCardSkeleton />
                  </div>
                </Fade>
              ))}
            </Box>
          ) : tasks.length === 0 ? (
            <Fade in={true} timeout={500}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  textAlign: "center",
                }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}>
                  <Typography variant="h4" color="text.disabled">
                    📝
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {isSearching ? "No matching tasks" : "No tasks yet"}
                </Typography>
              </Box>
            </Fade>
          ) : (
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}>
              {tasks.map((task, index) => {
                const isLastItem = index === tasks.length - 1;
                const ref =
                  scrollMode === "infinite" && isLastItem && hasMore
                    ? lastElementRef
                    : null;

                return (
                  <div key={task.id} ref={ref}>
                    <TaskCard task={task} animationDelay={index} />
                  </div>
                );
              })}
            </SortableContext>
          )}

          {!isSearching && hasMore && scrollMode === "button" && (
            <Fade in={true} timeout={300}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isLoading}
                sx={{
                  mt: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}>
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    Loading...
                  </Box>
                ) : (
                  "Load More"
                )}
              </Button>
            </Fade>
          )}

          {!isSearching && isFetching && page > 1 && (
            <Fade in={true}>
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress
                  size={24}
                  sx={{
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </Slide>
  );
}
