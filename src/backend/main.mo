import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import UserApproval "user-approval/approval";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  public type Error = {
    #cannotBeBuilt : Text;
  };

  // Accounting Types
  type AccountType = {
    #assets;
    #liabilities;
    #equity;
    #revenue;
    #expenses;
  };

  type JournalEntry = {
    id : Nat;
    date : Int;
    amount : Float;
    description : Text;
    account : Text;
    transactionId : Nat;
    journal : Text;
  };

  public type AccountingTransaction = {
    id : Nat;
    date : Int;
    amount : Float;
    description : Text;
    transactionType : AccountType;
    journalEntries : [JournalEntry];
  };

  let accountingTransactions = Map.empty<Nat, AccountingTransaction>();
  var nextTransactionId = 0;

  // Service Types
  public type ServiceType = {
    #cleaning;
    #maintenance;
    #repair;
    #consulting;
    #other : Text;
  };

  public type ServiceRequest = {
    id : Nat;
    serviceType : ServiceType;
    description : Text;
    customer : Text;
    dateRequested : Time.Time;
    status : {
      #pending;
      #inProgress;
      #completed;
    };
    createdBy : Principal;
  };

  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  var nextServiceRequestId = 0;

  // Employee Types
  public type Employee = {
    id : Nat;
    name : Text;
    role : Text;
    email : Text;
    isActive : Bool;
  };

  let employees = Map.empty<Nat, Employee>();
  var nextEmployeeId = 0;

  // Shipping Types
  public type Shipment = {
    id : Nat;
    origin : Text;
    destination : Text;
    status : {
      #pending;
      #inTransit;
      #delivered;
    };
    contents : Text;
    shippingMethod : Text;
    price : Float;
    shippingDate : Time.Time;
    deliveryDate : Time.Time;
    createdBy : Principal;
  };

  let shipments = Map.empty<Nat, Shipment>();
  var nextShipmentId = 0;

  // User Type
  public type UserProfile = {
    contactInfo : Text;
    businessName : Text;
    turnoverRegion : Nat;
    balanceShipping : Float;
    balanceGeneralGoods : Float;
    businessSector : Text;
    activeInvoices : [Text];
    shippingPackages : [Text];
    warehouseLocation : Text;
    id : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextUserId = 0;

  // Registration Types
  public type ApprovalStatus = {
    #pending;
    #approved;
    #denied;
  };

  public type UserRegistration = {
    principal : Principal;
    fullName : Text;
    email : Text;
    subscriptionTier : Text;
    paypalTransactionId : Text;
    timestamp : Time.Time;
    status : ApprovalStatus;
  };

  let registrations = Map.empty<Principal, UserRegistration>();

  let inventory = Map.empty<Text, Nat>();
  let customers = Map.empty<Text, Text>();
  let suppliers = Map.empty<Text, Text>();
  let paymentAccounts = Map.empty<Text, Float>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Approval State
  let approvalState = UserApproval.initState(accessControlState);

  // Storage Mixin (for future file handling)
  include MixinStorage();

  ///////////////////////
  // Registration Functions
  ///////////////////////

  public shared ({ caller }) func submitRegistration(
    fullName : Text,
    email : Text,
    subscriptionTier : Text,
    paypalTransactionId : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit registrations");
    };

    let registration : UserRegistration = {
      principal = caller;
      fullName;
      email;
      subscriptionTier;
      paypalTransactionId;
      timestamp = Time.now();
      status = #pending;
    };

    registrations.add(caller, registration);
  };

  public query ({ caller }) func getAllRegistrations() : async [UserRegistration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray();
  };

  public query ({ caller }) func getCallerRegistrationStatus() : async ?ApprovalStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view registration status");
    };
    registrations.get(caller).map(func(r) { r.status });
  };

  public shared ({ caller }) func updateRegistrationStatus(principal : Principal, status : ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update registration status");
    };

    switch (registrations.get(principal)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) {
        let updated : UserRegistration = { registration with status };
        registrations.add(principal, updated);
      };
    };
  };

  ///////////////////////
  // Approval Functions (User Approval Component)
  ///////////////////////

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set approval status");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list approvals");
    };
    UserApproval.listApprovals(approvalState);
  };

  ///////////////////////
  // Shipment Functions
  ///////////////////////

  public shared ({ caller }) func createShipment(
    origin : Text,
    destination : Text,
    contents : Text,
    shippingMethod : Text,
    price : Float,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create shipments");
    };
    let shipment : Shipment = {
      id = nextShipmentId;
      origin;
      destination;
      contents;
      shippingMethod;
      price;
      status = #pending;
      shippingDate = Time.now();
      deliveryDate = Time.now();
      createdBy = caller;
    };
    shipments.add(nextShipmentId, shipment);
    nextShipmentId += 1;
    shipment.id;
  };

  public query ({ caller }) func getAllShipments() : async [Shipment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all shipments");
    };
    shipments.values().toArray();
  };

  public query ({ caller }) func getShipmentsByStatus(status : { #pending; #inTransit; #delivered }) : async [Shipment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter all shipments");
    };
    shipments.values().toArray().filter(func(s) { s.status == status });
  };

  public query ({ caller }) func getShipment(id : Nat) : async ?Shipment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view shipments");
    };
    switch (shipments.get(id)) {
      case (null) { null };
      case (?shipment) {
        if (shipment.createdBy == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?shipment;
        } else {
          Runtime.trap("Unauthorized: Can only view your own shipments");
        };
      };
    };
  };

  public shared ({ caller }) func updateShipmentStatus(
    id : Nat,
    newStatus : { #pending; #inTransit; #delivered },
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update shipments");
    };
    switch (shipments.get(id)) {
      case (null) { Runtime.trap("Shipment not found") };
      case (?shipment) {
        if (shipment.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own shipments");
        };
        let updated : Shipment = { shipment with status = newStatus };
        shipments.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getShipmentsByCaller() : async [Shipment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view shipments");
    };
    shipments.values().toArray().filter(func(s) { s.createdBy == caller });
  };

  public shared ({ caller }) func deleteShipment(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete shipments");
    };
    switch (shipments.get(id)) {
      case (null) { Runtime.trap("Shipment not found") };
      case (?shipment) {
        if (shipment.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own shipments");
        };
        shipments.remove(id);
      };
    };
  };

  ///////////////////////
  // Inventory Functions
  ///////////////////////

  public shared ({ caller }) func addInventory(location : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add inventory");
    };
    let current = switch (inventory.get(location)) { case (null) { 0 }; case (?q) { q } };
    inventory.add(location, current + quantity);
  };

  public shared ({ caller }) func removeInventory(location : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove inventory");
    };
    let current = switch (inventory.get(location)) { case (null) { 0 }; case (?q) { q } };
    if (current < quantity) {
      Runtime.trap("Insufficient inventory");
    };
    inventory.add(location, current - quantity);
  };

  public query ({ caller }) func getInventory(location : Text) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inventory");
    };
    inventory.get(location);
  };

  public query ({ caller }) func getAllInventory() : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inventory");
    };
    inventory.toArray();
  };

  ///////////////////////
  // Accounting Functions
  ///////////////////////

  public shared ({ caller }) func recordTransaction(
    date : Int,
    amount : Float,
    description : Text,
    transactionType : AccountType,
    journalEntries : [JournalEntry],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record transactions");
    };
    let transaction : AccountingTransaction = {
      id = nextTransactionId;
      date;
      amount;
      description;
      transactionType;
      journalEntries;
    };
    accountingTransactions.add(nextTransactionId, transaction);
    nextTransactionId += 1;
    transaction.id;
  };

  public query ({ caller }) func getTransaction(id : Nat) : async ?AccountingTransaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view transactions");
    };
    accountingTransactions.get(id);
  };

  public query ({ caller }) func getAllTransactions() : async [AccountingTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };
    accountingTransactions.values().toArray();
  };

  public query ({ caller }) func getTransactionsByType(transactionType : AccountType) : async [AccountingTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view transactions");
    };
    accountingTransactions.values().toArray().filter(func(t) { t.transactionType == transactionType });
  };

  public query ({ caller }) func calculateBalance(accountType : AccountType) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can calculate balances");
    };
    let transactions = accountingTransactions.values().toArray();
    let filtered = transactions.filter(func(t) { t.transactionType == accountType });
    let amounts = filtered.map(func(t) { t.amount });
    _calculateSum(amounts);
  };

  func _calculateSum(amounts : [Float]) : Float {
    amounts.foldLeft(
      0.0,
      func(acc, amount) { acc + amount },
    );
  };

  public shared ({ caller }) func deleteTransaction(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete transactions");
    };
    switch (accountingTransactions.get(id)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?_) { accountingTransactions.remove(id) };
    };
  };

  ///////////////////////
  // Customer and Supplier Functions
  ///////////////////////

  public shared ({ caller }) func addCustomer(name : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add customers");
    };
    if (customers.containsKey(name)) {
      Runtime.trap("Customer already exists");
    };
    customers.add(name, details);
  };

  public shared ({ caller }) func addSupplier(name : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add suppliers");
    };
    if (suppliers.containsKey(name)) {
      Runtime.trap("Supplier already exists");
    };
    suppliers.add(name, details);
  };

  public query ({ caller }) func getCustomer(name : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view customers");
    };
    customers.get(name);
  };

  public query ({ caller }) func getSupplier(name : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view suppliers");
    };
    suppliers.get(name);
  };

  public query ({ caller }) func getAllCustomers() : async [(Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view customers");
    };
    customers.toArray();
  };

  public query ({ caller }) func getAllSuppliers() : async [(Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view suppliers");
    };
    suppliers.toArray();
  };

  ///////////////////////
  // Service Requests
  ///////////////////////

  public shared ({ caller }) func createServiceRequest(
    serviceType : ServiceType,
    description : Text,
    customer : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create service requests");
    };
    let request : ServiceRequest = {
      id = nextServiceRequestId;
      serviceType;
      description;
      customer;
      dateRequested = Time.now();
      status = #pending;
      createdBy = caller;
    };
    serviceRequests.add(nextServiceRequestId, request);
    nextServiceRequestId += 1;
    request.id;
  };

  public query ({ caller }) func getAllServiceRequests() : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all service requests");
    };
    serviceRequests.values().toArray();
  };

  public query ({ caller }) func getServiceRequestsByStatus(status : { #pending; #inProgress; #completed }) : async [ServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view service requests");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      serviceRequests.values().toArray().filter(func(r) { r.status == status });
    } else {
      serviceRequests.values().toArray().filter(func(r) { r.status == status and r.createdBy == caller });
    };
  };

  public shared ({ caller }) func updateServiceRequestStatus(
    id : Nat,
    newStatus : { #pending; #inProgress; #completed },
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update service requests");
    };
    switch (serviceRequests.get(id)) {
      case (null) { Runtime.trap("Service request not found") };
      case (?request) {
        if (request.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own service requests");
        };
        let updated : ServiceRequest = { request with status = newStatus };
        serviceRequests.add(id, updated);
      };
    };
  };

  ///////////////////////
  // Employee Functions
  ///////////////////////

  public shared ({ caller }) func addEmployee(
    name : Text,
    role : Text,
    email : Text,
    isActive : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add employees");
    };
    let employee : Employee = {
      id = nextEmployeeId;
      name;
      role;
      email;
      isActive;
    };
    employees.add(nextEmployeeId, employee);
    nextEmployeeId += 1;
    employee.id;
  };

  public shared ({ caller }) func updateEmployee(
    id : Nat,
    name : Text,
    role : Text,
    email : Text,
    isActive : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_) {
        let updated : Employee = {
          id;
          name;
          role;
          email;
          isActive;
        };
        employees.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getEmployee(id : Nat) : async ?Employee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employees");
    };
    employees.get(id);
  };

  public query ({ caller }) func getAllEmployees() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employees");
    };
    employees.values().toArray();
  };

  public query ({ caller }) func getActiveEmployees() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employees");
    };
    employees.values().toArray().filter(func(e) { e.isActive });
  };

  public query ({ caller }) func getEmployeesByRole(role : Text) : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view employees");
    };
    employees.values().toArray().filter(func(e) { e.role == role });
  };

  public shared ({ caller }) func deleteEmployee(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_) { employees.remove(id) };
    };
  };

  ///////////////////////
  // User Profile Management
  ///////////////////////

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    if (userProfiles.containsKey(caller)) {
      let _ = userProfiles.get(caller);
      userProfiles.remove(caller);
    } else {
      nextUserId += 1;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.toArray();
  };

  ///////////////////////
  // Payment Management
  ///////////////////////

  public shared ({ caller }) func addPaymentAccount(accountType : Text, balance : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add payment accounts");
    };
    paymentAccounts.add(accountType, balance);
  };

  public shared ({ caller }) func updatePaymentAccount(accountType : Text, balance : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment accounts");
    };
    paymentAccounts.add(accountType, balance);
  };

  public query ({ caller }) func getPaymentAccount(accountType : Text) : async ?Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view payment accounts");
    };
    paymentAccounts.get(accountType);
  };

  public query ({ caller }) func getAllPaymentAccounts() : async [(Text, Float)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all payment accounts");
    };
    paymentAccounts.toArray();
  };

  public shared ({ caller }) func transferPayment(
    fromAccount : Text,
    toAccount : Text,
    amount : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can transfer payments");
    };
    let fromBalance = switch (paymentAccounts.get(fromAccount)) {
      case (null) { Runtime.trap("From account not found") };
      case (?b) { b };
    };
    let toBalance = switch (paymentAccounts.get(toAccount)) {
      case (null) { 0.0 };
      case (?b) { b };
    };

    if (fromBalance < amount) {
      Runtime.trap("Insufficient balance");
    };

    paymentAccounts.add(fromAccount, fromBalance - amount);
    paymentAccounts.add(toAccount, toBalance + amount);
  };
};
