import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useIsCallerAdmin,
  useIsCallerApproved,
} from "../hooks/useQueries";
import { BusinessIntelligenceModule } from "../pages/BusinessIntelligenceModule";
import { DashboardHome } from "../pages/DashboardHome";
import { EmployeeModule } from "../pages/EmployeeModule";
import { FinancialModule } from "../pages/FinancialModule";
import { LogisticsModule } from "../pages/LogisticsModule";
import { OperationsModule } from "../pages/OperationsModule";
import { SalesModule } from "../pages/SalesModule";
import { ServicesModule } from "../pages/ServicesModule";

type Module =
  | "home"
  | "sales"
  | "services"
  | "logistics"
  | "financial"
  | "employees"
  | "operations"
  | "bi";

const navItems = [
  { id: "home" as Module, label: "Dashboard", icon: LayoutDashboard },
  { id: "sales" as Module, label: "Sales & CRM", icon: ShoppingCart },
  { id: "services" as Module, label: "Services", icon: Wrench },
  { id: "logistics" as Module, label: "Logistics", icon: Truck },
  { id: "financial" as Module, label: "Financial", icon: DollarSign },
  { id: "employees" as Module, label: "Employees", icon: Users },
  { id: "operations" as Module, label: "Operations", icon: Settings },
  { id: "bi" as Module, label: "Business Intelligence", icon: Brain },
];

interface DashboardLayoutProps {
  onNavigate: (path: string) => void;
}

export default function DashboardLayout({ onNavigate }: DashboardLayoutProps) {
  const [activeModule, setActiveModule] = useState<Module>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: isApproved, isLoading: approvalLoading } =
    useIsCallerApproved();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate("/");
  };

  const renderModule = () => {
    // Admins bypass approval check; show lock for non-approved non-home modules
    if (
      !isAdmin &&
      !approvalLoading &&
      isApproved === false &&
      activeModule !== "home"
    ) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto p-8">
            <Lock className="w-14 h-14 text-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Access Pending Approval
            </h2>
            <p className="text-muted-foreground text-sm">
              Your account is pending admin approval. Once your PayPal payment
              is verified, you'll gain full access to all modules.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Questions? Contact{" "}
              <a
                href="mailto:mntman8041@gmail.com"
                className="text-gold hover:underline"
              >
                mntman8041@gmail.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case "home":
        return (
          <DashboardHome
            onNavigate={onNavigate}
            onOpenModule={(mod) => setActiveModule(mod)}
          />
        );
      case "sales":
        return <SalesModule />;
      case "services":
        return <ServicesModule />;
      case "logistics":
        return <LogisticsModule />;
      case "financial":
        return <FinancialModule />;
      case "employees":
        return <EmployeeModule />;
      case "operations":
        return <OperationsModule />;
      case "bi":
        return <BusinessIntelligenceModule />;
      default:
        return (
          <DashboardHome
            onNavigate={onNavigate}
            onOpenModule={(mod) => setActiveModule(mod)}
          />
        );
    }
  };

  const displayName =
    userProfile?.businessName ||
    (identity
      ? `${identity.getPrincipal().toString().slice(0, 8)}...`
      : "User");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white flex flex-col transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-navy" />
            </div>
            <span className="font-display font-bold text-sm">AgendaAS</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Approval status banner */}
        {!isAdmin && !approvalLoading && isApproved === false && (
          <div className="mx-3 mt-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-2">
            <p className="text-xs text-yellow-300 font-medium">
              ⏳ Pending Approval
            </p>
            <p className="text-xs text-yellow-300/70 mt-0.5">
              Access limited until approved
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isLocked =
              !isAdmin &&
              !approvalLoading &&
              isApproved === false &&
              item.id !== "home";
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    activeModule === item.id
                      ? "bg-gold text-navy"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {isLocked && <Lock className="w-3 h-3 opacity-50" />}
                {activeModule === item.id && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin link */}
        {isAdmin && (
          <div className="px-3 pb-2">
            <button
              type="button"
              onClick={() => onNavigate("/admin/approvals")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gold/80 hover:text-gold hover:bg-gold/10 transition-all"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </button>
          </div>
        )}

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <span className="text-gold text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-white/40 truncate">
                {userProfile?.businessSector || "Business"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-white/60 hover:text-white hover:bg-white/10 justify-start gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-display font-bold text-foreground text-sm">
              {navItems.find((n) => n.id === activeModule)?.label ||
                "Dashboard"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Marketing Site
          </button>
        </header>

        {/* Module content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
