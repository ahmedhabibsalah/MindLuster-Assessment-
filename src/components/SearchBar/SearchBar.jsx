import {
  TextField,
  InputAdornment,
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Search, Add, Clear, FilterList } from "@mui/icons-material";
import { useState } from "react";
import useTaskStore from "../../store/taskStore";
import { COLUMNS, COLUMN_TITLES } from "../../utils/constants";

export function SearchBar() {
  const { searchQuery, setSearchQuery, openTaskForm, resetPagination } =
    useTaskStore();
  const [filterColumn, setFilterColumn] = useState("all");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    resetPagination();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilterColumn("all");
    resetPagination();
  };

  const handleCreateTask = () => {
    openTaskForm();
  };

  const handleFilterChange = (event) => {
    setFilterColumn(event.target.value);
    resetPagination();
  };

  const hasActiveFilters = searchQuery.length > 0 || filterColumn !== "all";

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
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
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => setSearchQuery("")}
                  sx={{ minWidth: "auto", p: 0.5 }}>
                  <Clear />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="medium" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Column</InputLabel>
          <Select
            value={filterColumn}
            onChange={handleFilterChange}
            label="Filter by Column"
            startAdornment={
              <FilterList sx={{ mr: 1, color: "text.secondary" }} />
            }>
            <MenuItem value="all">All Columns</MenuItem>
            {Object.entries(COLUMN_TITLES).map(([key, title]) => (
              <MenuItem key={key} value={key}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTask}
          size="large">
          Add Task
        </Button>
      </Box>

      {hasActiveFilters && (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => setSearchQuery("")}
              size="small"
              variant="outlined"
            />
          )}
          {filterColumn !== "all" && (
            <Chip
              label={`Column: ${COLUMN_TITLES[filterColumn]}`}
              onDelete={() => setFilterColumn("all")}
              size="small"
              variant="outlined"
            />
          )}
          <Button
            size="small"
            onClick={handleClearSearch}
            startIcon={<Clear />}
            sx={{ ml: 1 }}>
            Clear All
          </Button>
        </Box>
      )}
    </Box>
  );
}
