/**
 * Header Component
 * 
 * Top navigation bar with logo, theme toggle, and navigation links.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
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
        <div className="flex items-center gap-2 mr-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">
            AI Course Architect
          </span>
          <span className="font-bold text-lg sm:hidden">ACA</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium flex-1">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            My Courses
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
              >
                Sign&nbsp;Up
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
