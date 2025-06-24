import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { TaskCard } from "../Task/TaskCard";
import { useTasksByColumn, useSearchTasks } from "../../hooks/useTasks";
import useTaskStore from "../../store/taskStore";
import { PAGE_SIZE } from "../../utils/constants";

export function Column({ columnKey, title }) {
  const { searchQuery, currentPage, setCurrentPage } = useTaskStore();
  const page = currentPage[columnKey];

  const tasksQuery = useTasksByColumn(columnKey, page, PAGE_SIZE);
  const searchQuery_trimmed = searchQuery.trim();
  const searchResults = useSearchTasks(searchQuery_trimmed, 1, 100);

  const isSearching = searchQuery_trimmed.length > 0;
  const query = isSearching ? searchResults : tasksQuery;
  const { data, isLoading, error } = query;

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
    setCurrentPage(columnKey, page + 1);
  };

  return (
    <Paper
      sx={{
        flex: "1 1 300px",
        minWidth: 300,
        maxWidth: 350,
        bgcolor: "grey.50",
        p: 2,
        height: "fit-content",
        minHeight: "500px",
      }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {total} task{total !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isLoading && page === 1 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Error loading tasks
          </Typography>
        ) : tasks.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            {isSearching ? "No matching tasks" : "No tasks yet"}
          </Typography>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {!isSearching && hasMore && (
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isLoading}
                sx={{ mt: 1 }}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}
