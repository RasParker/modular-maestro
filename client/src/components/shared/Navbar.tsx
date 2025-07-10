import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, User, Crown, Shield, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'creator':
        return '/creator/dashboard';
      case 'fan':
        return '/fan/dashboard';
      default:
        return '/';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'creator':
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary">
              Xclusive
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
              Explore
            </Link>
            <Link to="/creator/artisticmia" className="text-foreground hover:text-primary transition-colors">
              Test Smart Blur
            </Link>
            {user && user.role === 'fan' && (
              <Link to="/fan/feed" className="text-foreground hover:text-primary transition-colors">
                Feed
              </Link>
            )}
            {user && (
              <Link to={getDashboardLink()} className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">X</span>
                      </div>
                      <span className="text-xl font-bold text-gradient-primary">Xclusive</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4 mt-8">
                  {/* User Info */}
                  {user && (
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                          {getRoleIcon()}
                          {user.role}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link 
                        to="/explore" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-foreground hover:text-primary"
                      >
                        Explore
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" asChild className="justify-start">
                      <Link 
                        to="/creator/artisticmia" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-foreground hover:text-primary"
                      >
                        Test Smart Blur (Creator Profile)
                      </Link>
                    </Button>
                    
                    {user && user.role === 'fan' && (
                      <Button variant="ghost" asChild className="justify-start">
                        <Link 
                          to="/fan/feed" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-foreground hover:text-primary"
                        >
                          Feed
                        </Link>
                      </Button>
                    )}
                    
                    {user && (
                      <Button variant="ghost" asChild className="justify-start">
                        <Link 
                          to={getDashboardLink()} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-foreground hover:text-primary"
                        >
                          Dashboard
                        </Link>
                      </Button>
                    )}
                    
                    {user && (
                      <Button variant="ghost" asChild className="justify-start">
                        <Link 
                          to={`/${user.role}/settings`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-foreground hover:text-primary flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  
                  {/* Authentication */}
                  {user ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button variant="premium" asChild>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                        {getRoleIcon()}
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.role}/settings`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="premium" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};