import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import router from "./routes/routes";
import { queryClient } from "./lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "./store/providers/theme-provider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
