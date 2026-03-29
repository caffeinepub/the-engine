import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

interface MarketingHeaderProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export default function MarketingHeader({
  onNavigate,
  isAuthenticated,
}: MarketingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-navy" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Agenda<span className="text-gold">AS</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => onNavigate("/dashboard")}
                className="bg-gold text-navy hover:bg-gold/90 font-semibold text-sm px-5"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate("/pricing")}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <Button
                  onClick={() => onNavigate("/pricing")}
                  className="bg-gold text-navy hover:bg-gold/90 font-semibold text-sm px-5"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setMobileOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-white/80 hover:text-gold py-2 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => {
              onNavigate("/pricing");
              setMobileOpen(false);
            }}
            className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold mt-2"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Button>
        </div>
      )}
    </header>
  );
}
