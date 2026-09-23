import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Repeat,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Box,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: ROUTES.ITEMS,
      label: 'Items',
      icon: Package,
    },
    {
      to: ROUTES.BORROWERS,
      label: 'Borrowers',
      icon: Users,
    },
    {
      to: ROUTES.LENDING,
      label: 'Lending',
      icon: Repeat,
    },
    {
      to: ROUTES.DUE_SOON_OVERDUE,
      label: 'Due & Overdue',
      icon: AlertTriangle,
    },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        h-screen sticky top-0
        bg-forest dark:bg-forest-900
        text-cream
        border-r border-forest-700
        transition-all duration-200 ease-in-out
        z-30
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-forest-700">
        <NavLink
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-forest font-black shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <Box className="w-6 h-6 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-cream">
                Borrow<span className="text-gold">Box</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-moss-400 font-semibold">
                Tracker
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex p-1.5 rounded-lg text-cream/60 hover:text-cream hover:bg-forest-700 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  isActive
                    ? 'bg-moss text-cream shadow-xs font-semibold'
                    : 'text-cream/70 hover:text-cream hover:bg-forest-700/60'
                }
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom info badge */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-xl bg-forest-800/80 border border-forest-700/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-cream/90">System Online</span>
          </div>
          <p className="mt-1 text-[11px] text-cream/60">
            Connected to BorrowBox Core
          </p>
        </div>
      )}
    </aside>
  );
};
