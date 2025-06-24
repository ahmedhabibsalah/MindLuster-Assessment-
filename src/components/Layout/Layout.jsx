import { Box, Container, Typography, AppBar, Toolbar } from "@mui/material";

export function Layout({ children }) {
  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kanban Board
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}

export function Board({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        minHeight: "70vh",
        pb: 2,
      }}>
      {children}
    </Box>
  );
}

export function Column({ title, children }) {
  return (
    <Box
      sx={{
        flex: "1 1 300px",
        minWidth: 300,
        bgcolor: "grey.100",
        borderRadius: 2,
        p: 2,
      }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

export function TaskCard({ task, onClick }) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 2,
        borderRadius: 1,
        cursor: "pointer",
        "&:hover": {
          bgcolor: "grey.50",
        },
      }}
      onClick={onClick}>
      <Typography variant="subtitle1" gutterBottom>
        {task.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {task.description}
      </Typography>
    </Box>
  );
}
