import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";
import { AccountType } from "../backend";
import {
  useGetAllPaymentAccounts,
  useGetAllTransactions,
} from "../hooks/useQueries";

export function FinancialModule() {
  const { data: transactions = [], isLoading: transactionsLoading } =
    useGetAllTransactions();
  const { data: paymentAccounts = [], isLoading: accountsLoading } =
    useGetAllPaymentAccounts();

  const totalRevenue = transactions
    .filter((t) => t.transactionType === AccountType.revenue)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transactionType === AccountType.expenses)
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
    },
    {
      label: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Net Income",
      value: `$${(totalRevenue - totalExpenses).toFixed(2)}`,
      icon: FileText,
    },
    {
      label: "Payment Accounts",
      value: paymentAccounts.length.toString(),
      icon: CreditCard,
    },
  ];

  const getAccountTypeLabel = (type: AccountType) => {
    const labels: Record<AccountType, string> = {
      [AccountType.assets]: "Assets",
      [AccountType.liabilities]: "Liabilities",
      [AccountType.equity]: "Equity",
      [AccountType.revenue]: "Revenue",
      [AccountType.expenses]: "Expenses",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage payments, accounting, taxes, and budgets
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Payment Accounts</TabsTrigger>
          <TabsTrigger value="ledger">Accounting Ledger</TabsTrigger>
          <TabsTrigger value="tax">Tax Management</TabsTrigger>
          <TabsTrigger value="budget">Budget & Planning</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Complete transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading transactions...
                </p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No transactions yet. Record your first transaction!
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id.toString()}
                      className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              Transaction #{transaction.id.toString()}
                            </p>
                            <span className="text-xs px-2 py-1 rounded bg-accent">
                              {getAccountTypeLabel(transaction.transactionType)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>
                              Date:{" "}
                              {new Date(
                                Number(transaction.date),
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              Journal Entries:{" "}
                              {transaction.journalEntries.length}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            ${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Accounts</CardTitle>
              <CardDescription>
                Manage payment accounts and balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading accounts...
                </p>
              ) : paymentAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No payment accounts configured yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentAccounts.map(([accountType, balance]) => (
                    <div
                      key={accountType}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{accountType}</p>
                          <p className="text-sm text-muted-foreground">
                            Payment Account
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${balance.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          current balance
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounting Ledger</CardTitle>
              <CardDescription>
                Double-entry bookkeeping records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed ledger view coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Management</CardTitle>
              <CardDescription>
                Calculate and track tax obligations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tax management tools coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget & Planning</CardTitle>
              <CardDescription>Set and monitor budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Budget planning tools coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                P&L, cash flow, and balance sheet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Financial reports coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
