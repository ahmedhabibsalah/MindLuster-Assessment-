import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout } from "./components/Layout/Layout";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { Board } from "./components/Board/Board";
import { TaskForm } from "./components/TaskForm/TaskForm";
import theme from "./styles/theme";
import { QueryProvider } from "./services/queryClient";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <Layout>
          <SearchBar />
          <Board />
          <TaskForm />
        </Layout>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
