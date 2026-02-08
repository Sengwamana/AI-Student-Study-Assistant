import { Link, Outlet } from "react-router-dom";
import "./rootLayout.css";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

const queryClient = new QueryClient();

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="themeToggle" 
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
        <div className="rootLayout">
          <header>
            <Link to="/" className="logo">
              <span className="logo-icon">📚</span>
              <div className="logo-text">
                <span className="logo-title">AI Student Study Assistant</span>
                <span className="logo-subtitle">Your Personal Learning Helper</span>
              </div>
            </Link>
            <div className="user">
              <ThemeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
