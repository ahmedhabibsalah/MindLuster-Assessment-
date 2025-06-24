import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
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

export function Column({ columnKey, title }) {
  const { searchQuery, currentPage, setCurrentPage, draggedTask } =
    useTaskStore();
  const [scrollMode, setScrollMode] = useState("button"); // 'button' or 'infinite'
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

  if (error) {
    return (
      <Paper
        sx={{
          flex: "1 1 300px",
          minWidth: 300,
          maxWidth: 350,
          p: 2,
          height: "fit-content",
          minHeight: "500px",
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
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        flex: "1 1 300px",
        minWidth: 300,
        maxWidth: 350,
        bgcolor: canDrop
          ? "primary.light"
          : isDraggedTaskInColumn
          ? "grey.200"
          : "grey.50",
        p: 2,
        height: "fit-content",
        minHeight: "500px",
        maxHeight: "80vh",
        border: canDrop ? "2px dashed" : "2px solid transparent",
        borderColor: canDrop ? "primary.main" : "transparent",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={toggleScrollMode}
            sx={{ fontSize: "0.75rem" }}>
            {scrollMode === "button" ? "∞" : "⬇"}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {total} task{total !== 1 ? "s" : ""}
        </Typography>
        {canDrop && (
          <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
            Drop here to move task
          </Typography>
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
        }}>
        {isLoading && page === 1 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </Box>
        ) : tasks.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            {isSearching ? "No matching tasks" : "No tasks yet"}
          </Typography>
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
                  <TaskCard task={task} />
                </div>
              );
            })}
          </SortableContext>
        )}

        {!isSearching && hasMore && scrollMode === "button" && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={isLoading}
            sx={{ mt: 1 }}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        )}

        {!isSearching && isFetching && page > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
