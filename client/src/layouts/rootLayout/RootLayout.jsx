import { Link, Outlet } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

const queryClient = new QueryClient();

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="w-10 h-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 cursor-pointer text-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 hover:rotate-12 hover:border-accent active:scale-95" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-background transition-colors duration-300 relative px-5 py-4 md:px-14 md:py-5">
          <header className="flex items-center justify-between pb-5 animate-fade-in-down">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-3xl drop-shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">📚</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-lg text-text-primary tracking-tight">AI Student Study Assistant</span>
                <span className="text-xs text-text-muted font-medium tracking-wide">Your Personal Learning Helper</span>
              </div>
            </Link>
            <div className="flex items-center gap-3.5">
              <ThemeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="flex-1 overflow-hidden animate-fade-in-up">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
