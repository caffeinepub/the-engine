import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: bigint;
    status: Variant_pending_completed_inProgress;
    serviceType: ServiceType;
    dateRequested: Time;
    customer: string;
    createdBy: Principal;
    description: string;
}
export type Time = bigint;
export type ServiceType = {
    __kind__: "repair";
    repair: null;
} | {
    __kind__: "cleaning";
    cleaning: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "consulting";
    consulting: null;
} | {
    __kind__: "maintenance";
    maintenance: null;
};
export interface Shipment {
    id: bigint;
    status: Variant_pending_inTransit_delivered;
    destination: string;
    contents: string;
    createdBy: Principal;
    origin: string;
    shippingMethod: string;
    deliveryDate: Time;
    shippingDate: Time;
    price: number;
}
export interface AccountingTransaction {
    id: bigint;
    transactionType: AccountType;
    journalEntries: Array<JournalEntry>;
    date: bigint;
    description: string;
    amount: number;
}
export interface UserApprovalInfo {
    status: ApprovalStatus__1;
    principal: Principal;
}
export interface UserRegistration {
    status: ApprovalStatus;
    paypalTransactionId: string;
    principal: Principal;
    subscriptionTier: string;
    fullName: string;
    email: string;
    timestamp: Time;
}
export interface JournalEntry {
    id: bigint;
    date: bigint;
    journal: string;
    description: string;
    account: string;
    amount: number;
    transactionId: bigint;
}
export interface Employee {
    id: bigint;
    name: string;
    role: string;
    isActive: boolean;
    email: string;
}
export interface UserProfile {
    id: bigint;
    contactInfo: string;
    balanceShipping: number;
    businessName: string;
    shippingPackages: Array<string>;
    warehouseLocation: string;
    businessSector: string;
    turnoverRegion: bigint;
    activeInvoices: Array<string>;
    balanceGeneralGoods: number;
}
export enum AccountType {
    liabilities = "liabilities",
    revenue = "revenue",
    expenses = "expenses",
    assets = "assets",
    equity = "equity"
}
export enum ApprovalStatus {
    pending = "pending",
    denied = "denied",
    approved = "approved"
}
export enum ApprovalStatus__1 {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_completed_inProgress {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum Variant_pending_inTransit_delivered {
    pending = "pending",
    inTransit = "inTransit",
    delivered = "delivered"
}
export interface backendInterface {
    addCustomer(name: string, details: string): Promise<void>;
    addEmployee(name: string, role: string, email: string, isActive: boolean): Promise<bigint>;
    addInventory(location: string, quantity: bigint): Promise<void>;
    addPaymentAccount(accountType: string, balance: number): Promise<void>;
    addSupplier(name: string, details: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateBalance(accountType: AccountType): Promise<number>;
    createServiceRequest(serviceType: ServiceType, description: string, customer: string): Promise<bigint>;
    createShipment(origin: string, destination: string, contents: string, shippingMethod: string, price: number): Promise<bigint>;
    deleteEmployee(id: bigint): Promise<void>;
    deleteShipment(id: bigint): Promise<void>;
    deleteTransaction(id: bigint): Promise<void>;
    getActiveEmployees(): Promise<Array<Employee>>;
    getAllCustomers(): Promise<Array<[string, string]>>;
    getAllEmployees(): Promise<Array<Employee>>;
    getAllInventory(): Promise<Array<[string, bigint]>>;
    getAllPaymentAccounts(): Promise<Array<[string, number]>>;
    getAllRegistrations(): Promise<Array<UserRegistration>>;
    getAllServiceRequests(): Promise<Array<ServiceRequest>>;
    getAllShipments(): Promise<Array<Shipment>>;
    getAllSuppliers(): Promise<Array<[string, string]>>;
    getAllTransactions(): Promise<Array<AccountingTransaction>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getCallerRegistrationStatus(): Promise<ApprovalStatus | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(name: string): Promise<string | null>;
    getEmployee(id: bigint): Promise<Employee | null>;
    getEmployeesByRole(role: string): Promise<Array<Employee>>;
    getInventory(location: string): Promise<bigint | null>;
    getPaymentAccount(accountType: string): Promise<number | null>;
    getServiceRequestsByStatus(status: Variant_pending_completed_inProgress): Promise<Array<ServiceRequest>>;
    getShipment(id: bigint): Promise<Shipment | null>;
    getShipmentsByCaller(): Promise<Array<Shipment>>;
    getShipmentsByStatus(status: Variant_pending_inTransit_delivered): Promise<Array<Shipment>>;
    getSupplier(name: string): Promise<string | null>;
    getTransaction(id: bigint): Promise<AccountingTransaction | null>;
    getTransactionsByType(transactionType: AccountType): Promise<Array<AccountingTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    recordTransaction(date: bigint, amount: number, description: string, transactionType: AccountType, journalEntries: Array<JournalEntry>): Promise<bigint>;
    removeInventory(location: string, quantity: bigint): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus__1): Promise<void>;
    submitRegistration(fullName: string, email: string, subscriptionTier: string, paypalTransactionId: string): Promise<void>;
    transferPayment(fromAccount: string, toAccount: string, amount: number): Promise<void>;
    updateEmployee(id: bigint, name: string, role: string, email: string, isActive: boolean): Promise<void>;
    updatePaymentAccount(accountType: string, balance: number): Promise<void>;
    updateRegistrationStatus(principal: Principal, status: ApprovalStatus): Promise<void>;
    updateServiceRequestStatus(id: bigint, newStatus: Variant_pending_completed_inProgress): Promise<void>;
    updateShipmentStatus(id: bigint, newStatus: Variant_pending_inTransit_delivered): Promise<void>;
}
