/**
 * Header Component
 * 
 * Top navigation bar with logo, theme toggle, and navigation links.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen = false }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Button */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block tracking-tight">
            AI Course Architect
          </span>
          <span className="font-bold text-lg sm:hidden">ACA</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 text-sm font-medium flex-1">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className="px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-foreground text-foreground"
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-foreground text-muted-foreground"
              >
                My Courses
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/settings"
              className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-foreground text-foreground/80"
            >
              <Settings className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-foreground text-foreground/80"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
