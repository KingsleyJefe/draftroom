import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { Agentation } from "agentation";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-right" />
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Router>
          <App />
        </Router>
      </AuthContextProvider>
    </QueryClientProvider>
    {import.meta.env.DEV && <Agentation />}
  </>,
);
