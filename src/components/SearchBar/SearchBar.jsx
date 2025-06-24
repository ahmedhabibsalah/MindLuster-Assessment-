import { TextField, InputAdornment, Box, Button } from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import useTaskStore from "../../store/taskStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery, openTaskForm } = useTaskStore();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateTask = () => {
    openTaskForm();
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
      <TextField
        placeholder="Search tasks by title or description..."
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="medium"
        sx={{ flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleCreateTask}
        size="large">
        Add Task
      </Button>
    </Box>
  );
}
