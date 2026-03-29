import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetAllRegistrations,
  useIsCallerAdmin,
  useUpdateRegistrationStatus,
} from "@/hooks/useQueries";
import { Principal } from "@dfinity/principal";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  Loader2,
  LogOut,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { ApprovalStatus } from "../backend";

interface AdminApprovalPanelProps {
  onNavigate: (path: string) => void;
}

export default function AdminApprovalPanel({
  onNavigate,
}: AdminApprovalPanelProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: registrations, isLoading: regLoading } =
    useGetAllRegistrations();
  const { mutate: updateStatus, isPending } = useUpdateRegistrationStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate("/");
  };

  const handleStatusUpdate = (principalStr: string, status: ApprovalStatus) => {
    setUpdatingId(principalStr);
    const principal = Principal.fromText(principalStr);
    updateStatus(
      { principal, status },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-14 h-14 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Not Authorized
          </h2>
          <p className="text-muted-foreground mb-6">
            You don't have admin access to this panel. Only the platform
            administrator can view this page.
          </p>
          <Button onClick={() => onNavigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const statusBadge = (status: ApprovalStatus) => {
    if (status === ApprovalStatus.approved) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          Approved
        </Badge>
      );
    }
    if (status === ApprovalStatus.denied) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">Denied</Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        Pending
      </Badge>
    );
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pending =
    registrations?.filter((r) => r.status === ApprovalStatus.pending) || [];
  const others =
    registrations?.filter((r) => r.status !== ApprovalStatus.pending) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">Admin Panel</h1>
            <p className="text-white/50 text-xs">Agenda Automation Station</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 hidden sm:block">
            {identity?.getPrincipal().toString().slice(0, 12)}...
          </span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
          <Button
            onClick={() => onNavigate("/dashboard")}
            size="sm"
            className="bg-gold text-navy hover:bg-gold/90 font-semibold"
          >
            Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Access Guide Banner */}
        <div
          data-ocid="admin.info_panel"
          className="bg-navy/5 border border-navy/20 rounded-xl p-5 mb-6 flex gap-4"
        >
          <div className="shrink-0 mt-0.5">
            <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-1">
              Admin Access Guide
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To access this admin panel: navigate to{" "}
              <code className="bg-navy/10 text-navy font-mono text-xs px-1.5 py-0.5 rounded">
                /admin/approvals
              </code>{" "}
              in your browser URL, then log in with Internet Identity. Admin
              access is granted to the platform owner. From here you can view
              all subscriber registrations, approve or deny access manually if
              needed, and monitor platform activity.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Registrations",
              value: registrations?.length || 0,
              icon: Clock,
              color: "text-foreground",
            },
            {
              label: "Pending Approval",
              value: pending.length,
              icon: Clock,
              color: "text-yellow-600",
            },
            {
              label: "Approved",
              value:
                registrations?.filter(
                  (r) => r.status === ApprovalStatus.approved,
                ).length || 0,
              icon: CheckCircle,
              color: "text-green-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className={`text-2xl font-display font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Pending Registrations */}
        <div className="bg-card border border-border rounded-xl mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h2 className="font-display font-bold text-foreground">
              Pending Registrations
            </h2>
            {pending.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-700 ml-auto">
                {pending.length} pending
              </Badge>
            )}
          </div>
          {regLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <p>No pending registrations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>PayPal TX ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((reg) => {
                    const principalStr = reg.principal.toString();
                    const isUpdating = updatingId === principalStr && isPending;
                    return (
                      <TableRow key={principalStr}>
                        <TableCell className="font-medium">
                          {reg.fullName}
                        </TableCell>
                        <TableCell className="text-sm">{reg.email}</TableCell>
                        <TableCell className="text-sm">
                          {reg.subscriptionTier}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {reg.paypalTransactionId}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(reg.timestamp)}
                        </TableCell>
                        <TableCell>{statusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(
                                  principalStr,
                                  ApprovalStatus.approved,
                                )
                              }
                              disabled={isUpdating}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleStatusUpdate(
                                  principalStr,
                                  ApprovalStatus.denied,
                                )
                              }
                              disabled={isUpdating}
                              className="text-xs h-7 px-3"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Deny
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* All Registrations */}
        {others.length > 0 && (
          <div className="bg-card border border-border rounded-xl">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-foreground">
                Processed Registrations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>PayPal TX ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {others.map((reg) => {
                    const principalStr = reg.principal.toString();
                    const isUpdating = updatingId === principalStr && isPending;
                    return (
                      <TableRow key={principalStr}>
                        <TableCell className="font-medium">
                          {reg.fullName}
                        </TableCell>
                        <TableCell className="text-sm">{reg.email}</TableCell>
                        <TableCell className="text-sm">
                          {reg.subscriptionTier}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {reg.paypalTransactionId}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(reg.timestamp)}
                        </TableCell>
                        <TableCell>{statusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {reg.status !== ApprovalStatus.approved && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    principalStr,
                                    ApprovalStatus.approved,
                                  )
                                }
                                disabled={isUpdating}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            {reg.status !== ApprovalStatus.denied && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleStatusUpdate(
                                    principalStr,
                                    ApprovalStatus.denied,
                                  )
                                }
                                disabled={isUpdating}
                                className="text-xs h-7 px-3"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Deny
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
