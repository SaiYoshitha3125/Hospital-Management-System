import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Heart, Moon, Sun, LogIn, LogOut, FileText,
  ClipboardList, MessageSquare, User, Search, Video, Calendar, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import yoshithaAvatar from '@/assets/yoshitha-avatar.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const { isAuthenticated, isOtpVerified, logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/chat', label: 'AI Chat' },
  ];

  const consultLinks = [
    { to: '/vc-appointment', label: '⚡ Instant VC Consult', isNew: true },
    { to: '/consultation-request', label: 'Text Consultation' },
    { to: '/appointments', label: 'Book Appointment' },
  ];

  const protectedLinks = (isAuthenticated && isOtpVerified) ? [
    { to: '/medical-profile', label: 'My Profile', icon: User },
    { to: '/medical-form', label: 'Update Health', icon: ClipboardList },
    { to: '/medical-search', label: 'Medical Search', icon: Search },
    { to: '/my-consultations', label: 'My Consultations', icon: MessageSquare },
    { to: '/my-reports', label: 'My Reports', icon: FileText },
  ] : [];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled
        ? 'border-border/50 bg-background/95 backdrop-blur-xl shadow-sm'
        : 'border-transparent bg-background/80 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-soft group-hover:shadow-hover transition-all duration-300">
              <Heart className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-black text-foreground">
              Medi<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Consult Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                ['/vc-appointment', '/consultation-request', '/appointments'].includes(location.pathname)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
                <Video className="h-3.5 w-3.5" />
                Consult
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {consultLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.isNew && <span className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 px-2 py-0.5 rounded-full font-semibold">New</span>}
                  </Link>
                ))}
              </div>
            </div>

            {protectedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* User Profile & Auth Button */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/medical-profile"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted/70 transition-all group"
                    title="View Patient Profile"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/40 shadow-sm bg-primary/10 group-hover:scale-105 transition-transform">
                      <img
                        src={yoshithaAvatar}
                        alt="Yoshitha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {user?.full_name || 'Yoshitha'}
                    </span>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-lg gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors h-8"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg gap-2 bg-gradient-to-r from-primary to-blue-600 text-white shadow-soft"
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              className="rounded-lg"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-1 pt-2">
            {isAuthenticated && (
              <Link
                to="/medical-profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 mb-2"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 bg-card">
                  <img src={yoshithaAvatar} alt="Yoshitha" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{user?.full_name || 'Yoshitha'}</p>
                  <p className="text-xs text-primary font-medium">View Patient Profile</p>
                </div>
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Consult links */}
            <div className="border-t border-border/40 my-1 pt-1">
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Consult</p>
              {consultLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                  {link.isNew && <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">New</span>}
                </Link>
              ))}
            </div>

            {protectedLinks.length > 0 && (
              <div className="border-t border-border/40 my-1 pt-1">
                <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">My Account</p>
                {protectedLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-border/50">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start rounded-lg gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg gap-2 bg-gradient-to-r from-primary to-blue-600 text-white"
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Login / Sign Up
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
