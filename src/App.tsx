import "./App.css";
import "@radix-ui/themes/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./Pages/Home";
import { Theme } from "@radix-ui/themes";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Home />
        </Theme>
      </QueryClientProvider>
    </>
  );
}

export default App;
