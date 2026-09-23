import React, { useState } from 'react';
import {
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../ui/Tooltip';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface TopBarProps {
  onToggleMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileNav }) => {
  const { user, logout, isLoggingOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-cream-50/80 dark:bg-forest-900/80 backdrop-blur-md border-b border-moss/10 dark:border-forest-700 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu toggle + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-lg text-forest dark:text-cream hover:bg-moss/10 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-moss dark:text-gold">
            Workspace
          </span>
          <span className="text-forest/30 dark:text-cream/30">/</span>
          <span className="text-sm font-bold text-forest dark:text-cream truncate max-w-[160px] sm:max-w-xs">
            {user?.name || 'BorrowBox'}
          </span>
        </div>
      </div>

      {/* Right Actions: Theme Toggle, User Chip, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light mode toggle */}
        <Tooltip content={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-forest dark:text-cream hover:bg-moss/10 dark:hover:bg-forest-700 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-forest" />
            )}
          </button>
        </Tooltip>

        {/* User Info Avatar */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-moss/10 dark:bg-forest-800 border border-moss/20 dark:border-forest-700">
          <div className="w-7 h-7 rounded-full bg-forest dark:bg-moss text-cream flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {user?.name ? user.name.slice(0, 2) : <UserIcon className="w-3.5 h-3.5" />}
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-bold text-forest dark:text-cream leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-forest/60 dark:text-cream/60 leading-tight">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Logout action button */}
        <Tooltip content="Sign Out">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Log out"
            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          await logout();
          setShowLogoutConfirm(false);
        }}
        title="Sign Out"
        message="Are you sure you want to sign out of BorrowBox?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isLoggingOut}
      />
    </header>
  );
};
