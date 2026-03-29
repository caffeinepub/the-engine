import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AccountType,
  AccountingTransaction,
  ApprovalStatus,
  Employee,
  JournalEntry,
  ServiceRequest,
  Shipment,
  UserProfile,
  UserRegistration,
} from "../backend";
import type {
  Variant_pending_completed_inProgress,
  Variant_pending_inTransit_delivered,
} from "../backend";
import { useActor } from "./useActor";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Admin Check ─────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Approval ────────────────────────────────────────────────────────────────

export function useIsCallerApproved() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isCallerApproved"] });
    },
  });
}

// ─── Registration ─────────────────────────────────────────────────────────────

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      email: string;
      subscriptionTier: string;
      paypalTransactionId: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitRegistration(
        data.fullName,
        data.email,
        data.subscriptionTier,
        data.paypalTransactionId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerRegistrationStatus"] });
      queryClient.invalidateQueries({ queryKey: ["allRegistrations"] });
    },
  });
}

export function useGetCallerRegistrationStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ApprovalStatus | null>({
    queryKey: ["callerRegistrationStatus"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerRegistrationStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllRegistrations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRegistration[]>({
    queryKey: ["allRegistrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateRegistrationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      principal: import("@dfinity/principal").Principal;
      status: ApprovalStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateRegistrationStatus(data.principal, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["isCallerApproved"] });
    },
  });
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export function useSubmitWaitlistEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const existing: string[] = JSON.parse(
        localStorage.getItem("waitlist_emails") || "[]",
      );
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("waitlist_emails", JSON.stringify(existing));
      }
      return Promise.resolve();
    },
  });
}

// ─── Service Requests ─────────────────────────────────────────────────────────

export function useGetAllServiceRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ServiceRequest[]>({
    queryKey: ["serviceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServiceRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetServiceRequestsByStatus(
  status: Variant_pending_completed_inProgress,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ServiceRequest[]>({
    queryKey: ["serviceRequests", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServiceRequestsByStatus(status);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateServiceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceType: import("../backend").ServiceType;
      description: string;
      customer: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createServiceRequest(
        data.serviceType,
        data.description,
        data.customer,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
    },
  });
}

export function useUpdateServiceRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      status: Variant_pending_completed_inProgress;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateServiceRequestStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
    },
  });
}

// ─── Shipments ────────────────────────────────────────────────────────────────

export function useGetAllShipments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShipments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetShipmentsByStatus(
  status: Variant_pending_inTransit_delivered,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Shipment[]>({
    queryKey: ["shipments", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShipmentsByStatus(status);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateShipment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      origin: string;
      destination: string;
      contents: string;
      shippingMethod: string;
      price: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createShipment(
        data.origin,
        data.destination,
        data.contents,
        data.shippingMethod,
        data.price,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      status: Variant_pending_inTransit_delivered;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateShipmentStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useDeleteShipment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteShipment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function useGetAllInventory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[string, bigint][]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInventory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddInventory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { location: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addInventory(data.location, data.quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useRemoveInventory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { location: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeInventory(data.location, data.quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function useGetAllTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AccountingTransaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRecordTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      date: bigint;
      amount: number;
      description: string;
      transactionType: AccountType;
      journalEntries: JournalEntry[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordTransaction(
        data.date,
        data.amount,
        data.description,
        data.transactionType,
        data.journalEntries,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

// ─── Payment Accounts ─────────────────────────────────────────────────────────

export function useGetAllPaymentAccounts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[string, number][]>({
    queryKey: ["paymentAccounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentAccounts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPaymentAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { accountType: string; balance: number }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPaymentAccount(data.accountType, data.balance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentAccounts"] });
    },
  });
}

export function useUpdatePaymentAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { accountType: string; balance: number }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePaymentAccount(data.accountType, data.balance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentAccounts"] });
    },
  });
}

export function useTransferPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fromAccount: string;
      toAccount: string;
      amount: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.transferPayment(
        data.fromAccount,
        data.toAccount,
        data.amount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentAccounts"] });
    },
  });
}

// ─── Employees ────────────────────────────────────────────────────────────────

export function useGetAllEmployees() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployees();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActiveEmployees() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ["employees", "active"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveEmployees();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      role: string;
      email: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addEmployee(data.name, data.role, data.email, data.isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      role: string;
      email: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEmployee(
        data.id,
        data.name,
        data.role,
        data.email,
        data.isActive,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// ─── Customers & Suppliers ────────────────────────────────────────────────────

export function useGetAllCustomers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[string, string][]>({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllSuppliers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[string, string][]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSuppliers();
    },
    enabled: !!actor && !actorFetching,
  });
}
