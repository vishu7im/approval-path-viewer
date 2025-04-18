
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Clock, DollarSign } from "lucide-react";
import { ExpenseDetails } from "./ExpenseDetails";
import { ApprovalPathViewer } from "./ApprovalWorkflow/ApprovalPathViewer";
import { Badge } from "./ui/badge";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  submittedBy: string;
}

const mockExpenses: Expense[] = [
  {
    id: "EXP-2023-001",
    title: "Business Trip to New York",
    amount: 1500,
    date: "2023-04-15",
    status: "project_approval",
    category: "Travel",
    submittedBy: "John Doe",
  },
  {
    id: "EXP-2023-002",
    title: "Office Supplies",
    amount: 500,
    date: "2023-04-16",
    status: "finance_approval",
    category: "Supplies",
    submittedBy: "Jane Smith",
  },
  {
    id: "EXP-2023-003",
    title: "Team Lunch",
    amount: 200,
    date: "2023-04-17",
    status: "cleared",
    category: "Meals",
    submittedBy: "Mike Johnson",
  },
];

const approval_hierarchy = {
  draft: [],
  project_approval: [
    {
      role: "project_manager",
      user_name: "ramesh",
      condtion: ["ammount>1000"],
      next_status: "finance_approval",
      previous: "draft",
      current_status: "project_approval",
      level: "1",
    },
    {
      role: "project_manager",
      user_name: "rohit",
      condtion: ["ammount>1000"],
      next_status: "finance_approval",
      previous: "draft",
      current_status: "project_approval",
      level: "1",
    },
    {
      role: "category_manager",
      user_name: "manish",
      next_status: "finance_approval",
      previous: "draft",
      current_status: "project_approval",
      level: "2",
    },
  ],
  finance_approval: [
    {
      role: "finance_manager",
      user_name: "rahul",
      next_status: "cleared",
      previous: "draft",
      current_status: "finance_approval",
      level: "1",
    },
    {
      role: "finance_manager",
      user_name: "rahul",
      next_status: "cleared",
      previous: "draft",
      current_status: "finance_approval",
      level: "2",
    },
  ],
  cleared: [],
};

export function ExpenseList() {
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "project_approval":
        return "bg-amber-500";
      case "finance_approval":
        return "bg-blue-500";
      case "cleared":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Expense Claims</h2>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.submittedBy}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedExpense(expense)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      View Workflow
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedExpense && (
              <>
                <ExpenseDetails {...selectedExpense} />
                <ApprovalPathViewer
                  approvalHierarchy={approval_hierarchy}
                  currentStatus={selectedExpense.status}
                  expenseAmount={selectedExpense.amount}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
