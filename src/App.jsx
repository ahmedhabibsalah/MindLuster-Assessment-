import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout, Board, Column, TaskCard } from "./components/Layout/Layout";
import { useTasks } from "./hooks/useTasks";
import { COLUMN_ORDER, COLUMN_TITLES } from "./utils/constants";
import theme from "./styles/theme";
import { QueryProvider } from "./services/queryClient";

function KanbanContent() {
  const { data: tasks = [], isLoading, error } = useTasks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  const tasksByColumn = tasks.reduce((acc, task) => {
    if (!acc[task.column]) acc[task.column] = [];
    acc[task.column].push(task);
    return acc;
  }, {});

  return (
    <Layout>
      <Board>
        {COLUMN_ORDER.map((columnKey) => (
          <Column key={columnKey} title={COLUMN_TITLES[columnKey]}>
            {(tasksByColumn[columnKey] || []).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Column>
        ))}
      </Board>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <KanbanContent />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
