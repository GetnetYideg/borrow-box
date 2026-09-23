import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Tooltip } from '../components/ui/Tooltip';

export const AuthLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream dark:bg-forest-900 text-forest dark:text-cream transition-colors duration-200">
      {/* Top Navbar */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-moss/10 dark:border-forest-700/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-forest font-black shadow-xs group-hover:scale-105 transition-transform">
            <Box className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-forest dark:text-cream">
              Borrow<span className="text-gold">Box</span>
            </span>
          </div>
        </Link>

        <Tooltip content={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-forest dark:text-cream hover:bg-moss/10 dark:hover:bg-forest-700 cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-forest" />
            )}
          </button>
        </Tooltip>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-forest/60 dark:text-cream/60 border-t border-moss/10 dark:border-forest-700/50">
        &copy; {new Date().getFullYear()} BorrowBox Inc. Secure item lending & tracking.
      </footer>
    </div>
  );
};
