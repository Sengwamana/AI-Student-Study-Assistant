import { Link, Outlet } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-background transition-colors duration-300 relative">
          <main className="flex-1 overflow-hidden animate-fade-in-up">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
