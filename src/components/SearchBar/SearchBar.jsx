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
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search,
  Add,
  Clear,
  FilterList,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useState } from "react";
import useTaskStore from "../../store/taskStore";
import { COLUMNS, COLUMN_TITLES } from "../../utils/constants";

export function SearchBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [showFilters, setShowFilters] = useState(false);

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

  if (isMobile) {
    return (
      <Box sx={{ mb: 3 }} role="search" aria-label="Task search and filters">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
            <TextField
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              fullWidth
              aria-label="Search tasks by title or description"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search aria-hidden="true" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleCreateTask}
              size="small"
              sx={{ minWidth: "fit-content", px: 2 }}
              aria-label="Create new task">
              <Add />
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Button
              startIcon={<FilterList />}
              endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
              aria-expanded={showFilters}
              aria-controls="mobile-filters">
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={handleClearSearch}
                startIcon={<Clear />}>
                Clear
              </Button>
            )}
          </Box>

          <Collapse in={showFilters} id="mobile-filters">
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Column</InputLabel>
              <Select
                value={filterColumn}
                onChange={handleFilterChange}
                label="Filter by Column"
                aria-label="Filter tasks by column">
                <MenuItem value="all">All Columns</MenuItem>
                {Object.entries(COLUMN_TITLES).map(([key, title]) => (
                  <MenuItem key={key} value={key}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Collapse>

          {hasActiveFilters && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  size="small"
                  variant="outlined"
                />
              )}
              {filterColumn !== "all" && (
                <Chip
                  label={COLUMN_TITLES[filterColumn]}
                  onDelete={() => setFilterColumn("all")}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }} role="search" aria-label="Task search and filters">
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexDirection: isTablet ? "column" : "row",
        }}>
        <TextField
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="medium"
          sx={{ flexGrow: 1, minWidth: isTablet ? "100%" : 300 }}
          aria-label="Search tasks by title or description"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search aria-hidden="true" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            width: isTablet ? "100%" : "auto",
          }}>
          <FormControl
            size="medium"
            sx={{ minWidth: 150, flexGrow: isTablet ? 1 : 0 }}>
            <InputLabel>Filter by Column</InputLabel>
            <Select
              value={filterColumn}
              onChange={handleFilterChange}
              label="Filter by Column"
              aria-label="Filter tasks by column"
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
            size="large"
            aria-label="Create new task">
            {isTablet ? "Add" : "Add Task"}
          </Button>
        </Box>
      </Box>

      {hasActiveFilters && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}>
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
