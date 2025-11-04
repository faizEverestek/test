import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code2, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onSignOut?: () => void;
}

export const Header = ({ onSignOut }: HeaderProps) => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-r from-primary to-blue-500 p-2">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CodeGenAI</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {!isSignedIn ? (
            <>
              <Link to="/features">
                <Button variant="ghost" className="text-sm">
                  Features
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="text-sm">
                  Pricing
                </Button>
              </Link>
            </>
          ) : (
            <></>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!isSignedIn ? (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    onSignOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
