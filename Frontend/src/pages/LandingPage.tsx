import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Repeat,
  CheckCircle2,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-cream dark:bg-forest-900 text-forest dark:text-cream selection:bg-moss selection:text-cream">
      {/* Top Navbar */}
      <nav className="h-20 max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between border-b border-moss/10 dark:border-forest-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-forest font-black shadow-xs">
            <Box className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-forest dark:text-cream">
            Borrow<span className="text-gold">Box</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
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

          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 sm:px-12 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold-600 dark:text-gold text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4" />
          Zero Hassle Item Lending & Tracking
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-forest dark:text-cream leading-tight">
          Never lose track of what you’ve lent again.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-forest/70 dark:text-cream/80 max-w-3xl mx-auto leading-relaxed">
          BorrowBox is the modern inventory and lending companion. Track valuable tools,
          books, electronics, and gear with scheduled due dates, automated overdue alerts,
          and tailored reminder generators.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-md text-base"
              >
                Open Your Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-md text-base font-semibold"
                >
                  Start Borrowing Smarter
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  Sign In to Workspace
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-forest-800 border border-moss/15 dark:border-forest-700 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-moss/10 dark:bg-forest-700 text-moss dark:text-cream flex items-center justify-center mb-4">
              <Repeat className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-forest dark:text-cream">
              Clean Lending Workflows
            </h2>
            <p className="mt-2 text-sm text-forest/70 dark:text-cream/70 leading-relaxed">
              Lend items in seconds. The system automatically marks items unavailable and
              tracks due dates with one click.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-forest-800 border border-moss/15 dark:border-forest-700 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold-600 dark:text-gold flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-forest dark:text-cream">
              Due Date & Overdue Alerts
            </h2>
            <p className="mt-2 text-sm text-forest/70 dark:text-cream/70 leading-relaxed">
              Stay ahead of late returns. Dynamic indicators highlight items due soon or
              past schedule automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-forest-800 border border-moss/15 dark:border-forest-700 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-moss/10 dark:bg-forest-700 text-moss dark:text-cream flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-forest dark:text-cream">
              Smart Reminder Generator
            </h2>
            <p className="mt-2 text-sm text-forest/70 dark:text-cream/70 leading-relaxed">
              Generate polite, casual, formal, or humorous reminders with 1-click clipboard
              copy for quick follow-ups.
            </p>
          </div>
        </div>

        {/* Security & Organization Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-forest dark:bg-forest-800 text-cream flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              Corporate & Team Ready
            </h3>
            <p className="mt-1 text-sm text-cream/70 max-w-lg">
              Secure authentication with silent refresh tokens, strict input validations,
              and isolated borrower contacts.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-cream/90">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold" /> No Lost Items
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold" /> Clear Audit Trail
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gold" /> 1-Click Returns
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-forest/60 dark:text-cream/60 border-t border-moss/10 dark:border-forest-700/50">
        &copy; {new Date().getFullYear()} BorrowBox Inc. Built with precision and care.
      </footer>
    </div>
  );
};
