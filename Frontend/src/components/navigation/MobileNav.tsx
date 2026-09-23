import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Repeat,
  AlertTriangle,
  X,
  Box,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-900/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] h-full bg-forest dark:bg-forest-900 text-cream p-5 flex flex-col z-10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-forest-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-forest font-black">
              <Box className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-base text-cream">
              Borrow<span className="text-gold">Box</span>
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 rounded-lg text-cream/70 hover:text-cream hover:bg-forest-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
                  ${
                    isActive
                      ? 'bg-moss text-cream font-semibold'
                      : 'text-cream/70 hover:bg-forest-700 hover:text-cream'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
