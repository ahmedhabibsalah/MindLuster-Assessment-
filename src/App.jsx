import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryProvider } from "./services/queryClient";
import { Layout } from "./components/Layout/Layout";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { Board } from "./components/Board/Board";
import { TaskForm } from "./components/TaskForm/TaskForm";
import { NotificationContainer } from "./components/Notification/NotificationContainer";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { BoardSkeleton } from "./components/Loading/LoadingSkeleton";
import { useTasks } from "./hooks/useTasks";
import theme from "./styles/theme";
import { Suspense } from "react";

function KanbanContent() {
  const { isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <Layout>
        <SearchBar />
        <BoardSkeleton />
      </Layout>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <Layout>
      <SearchBar />
      <Board />
      <TaskForm />
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <QueryProvider>
          <Suspense fallback={<BoardSkeleton />}>
            <KanbanContent />
          </Suspense>
          <NotificationContainer />
        </QueryProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
