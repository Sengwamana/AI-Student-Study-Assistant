import { useTheme } from "../../context/ThemeContext";

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

export default ThemeToggle;
