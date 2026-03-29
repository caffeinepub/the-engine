import { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { LoginButton } from "./components/LoginButton";
import { ProfileSetup } from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AdminApprovalPanel from "./pages/AdminApprovalPanel";
import BlogArticlePage from "./pages/BlogArticlePage";
import BlogListingPage from "./pages/BlogListingPage";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";

type PublicPage = "landing" | "pricing" | "blog" | "blog-article";

function getInitialPublicPage(): { page: PublicPage; slug?: string } {
  const path = window.location.pathname;
  if (path.startsWith("/blog/")) {
    return { page: "blog-article", slug: path.replace("/blog/", "") };
  }
  if (path === "/blog") return { page: "blog" };
  if (path === "/pricing") return { page: "pricing" };
  return { page: "landing" };
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [publicPage, setPublicPage] = useState<{
    page: PublicPage;
    slug?: string;
  }>(getInitialPublicPage);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  // Handle URL-based routing for public pages
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/blog/")) {
        setPublicPage({
          page: "blog-article",
          slug: path.replace("/blog/", ""),
        });
        setShowDashboard(false);
        setShowAdmin(false);
      } else if (path === "/blog") {
        setPublicPage({ page: "blog" });
        setShowDashboard(false);
        setShowAdmin(false);
      } else if (path === "/pricing") {
        setPublicPage({ page: "pricing" });
        setShowDashboard(false);
        setShowAdmin(false);
      } else if (path === "/admin/approvals") {
        setShowAdmin(true);
        setShowDashboard(false);
      } else if (path === "/dashboard") {
        setShowDashboard(true);
        setShowAdmin(false);
      } else {
        setPublicPage({ page: "landing" });
        setShowDashboard(false);
        setShowAdmin(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    if (path.startsWith("/blog/")) {
      setPublicPage({ page: "blog-article", slug: path.replace("/blog/", "") });
      setShowDashboard(false);
      setShowAdmin(false);
    } else if (path === "/blog") {
      setPublicPage({ page: "blog" });
      setShowDashboard(false);
      setShowAdmin(false);
    } else if (path === "/pricing") {
      setPublicPage({ page: "pricing" });
      setShowDashboard(false);
      setShowAdmin(false);
    } else if (path === "/admin/approvals") {
      setShowAdmin(true);
      setShowDashboard(false);
    } else if (path === "/dashboard") {
      setShowDashboard(true);
      setShowAdmin(false);
    } else {
      setPublicPage({ page: "landing" });
      setShowDashboard(false);
      setShowAdmin(false);
    }
  };

  // Check initial path for admin/dashboard
  useEffect(() => {
    if (window.location.pathname === "/admin/approvals") {
      setShowAdmin(true);
    } else if (window.location.pathname === "/dashboard") {
      setShowDashboard(true);
    }
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading Agenda Automation Station...
          </p>
        </div>
      </div>
    );
  }

  // Admin panel (protected)
  if (showAdmin) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center max-w-md mx-auto p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground mb-6">
              You must be logged in as an admin to access this panel.
            </p>
            <LoginButton />
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 block mx-auto text-sm text-muted-foreground hover:text-foreground underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return (
      <>
        {showProfileSetup && <ProfileSetup />}
        <AdminApprovalPanel onNavigate={navigate} />
      </>
    );
  }

  // Dashboard (authenticated)
  if (showDashboard && isAuthenticated) {
    return (
      <>
        {showProfileSetup && <ProfileSetup />}
        <DashboardLayout onNavigate={navigate} />
      </>
    );
  }

  // If trying to go to dashboard but not authenticated
  if (showDashboard && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access your dashboard.
          </p>
          <LoginButton />
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 block mx-auto text-sm text-muted-foreground hover:text-foreground underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Public pages
  if (publicPage.page === "pricing") {
    return (
      <PricingPage onNavigate={navigate} isAuthenticated={isAuthenticated} />
    );
  }
  if (publicPage.page === "blog") {
    return <BlogListingPage onNavigate={navigate} />;
  }
  if (publicPage.page === "blog-article") {
    return (
      <BlogArticlePage slug={publicPage.slug || ""} onNavigate={navigate} />
    );
  }

  // Landing page (default)
  return (
    <LandingPage onNavigate={navigate} isAuthenticated={isAuthenticated} />
  );
}
