
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Clock, DollarSign, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { ExpenseDetails } from "./ExpenseDetails";
import { ApprovalPathViewer } from "./ApprovalWorkflow/ApprovalPathViewer";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  submittedBy: string;
  description?: string;
  department?: string;
}

const mockExpenses: Expense[] = [
  {
    id: "EXP-2023-001",
    title: "Business Trip to New York",
    amount: 15000,
    date: "2023-04-15",
    status: "project_approval",
    category: "Travel",
    submittedBy: "John Doe",
    description: "Annual client meeting and conference attendance",
    department: "Sales"
  },
  {
    id: "EXP-2023-002",
    title: "Office Supplies",
    amount: 500,
    date: "2023-04-16",
    status: "finance_approval",
    category: "Supplies",
    submittedBy: "Jane Smith",
    description: "Monthly office supplies restocking",
    department: "Operations"
  },
  {
    id: "EXP-2023-003",
    title: "Team Lunch",
    amount: 200,
    date: "2023-04-17",
    status: "cleared",
    category: "Meals",
    submittedBy: "Mike Johnson",
    description: "Team lunch for project completion",
    department: "Engineering"
  },
  {
    id: "EXP-2023-004",
    title: "Software Licenses",
    amount: 12000,
    date: "2023-04-18",
    status: "project_approval",
    category: "Technology",
    submittedBy: "Sarah Wilson",
    description: "Annual software subscription renewal",
    department: "IT"
  },
  {
    id: "EXP-2023-005",
    title: "Marketing Campaign",
    amount: 8500,
    date: "2023-04-19",
    status: "finance_approval",
    category: "Marketing",
    submittedBy: "Alex Brown",
    description: "Q2 digital marketing campaign",
    department: "Marketing"
  }
];

const approval_hierarchy = {
  "draft": [],
  "project_approval": [
    {
      role: "ceo",
      user_name: "ramesh ceo",
      next_status: "finance_approval",
      previous_status: "draft",
      current_status: "project_approval",
      level: 1,
      approved_by_uuid: null,
      approved_by_name: "",
      current_pointer: false
    },
    {
      role: "project_manager",
      user_name: "rohit",
      next_status: "finance_approval",
      previous_status: "draft",
      current_status: "project_approval",
      level: 2,
      approved_by_uuid: null,
      approved_by_name: "",
      current_pointer: true
    },
    {
      role: "category_manager",
      user_name: "manish",
      next_status: "finance_approval",
      previous_status: "draft",
      current_status: "project_approval",
      level: 2,
      approved_by_uuid: null,
      approved_by_name: "",
      current_pointer: false
    }
  ],
  "finance_approval": [
    {
      role: "finance_manager",
      user_name: "rahul",
      next_status: "cleared",
      previous_status: "project_approval",
      current_status: "finance_approval",
      level: 1,
      approved_by_uuid: null,
      approved_by_name: "",
      current_pointer: false
    },
    {
      role: "finance_manager",
      user_name: "rahul",
      next_status: "cleared",
      previous_status: "project_approval",
      current_status: "finance_approval",
      level: 2,
      approved_by_uuid: null,
      approved_by_name: "",
      current_pointer: false
    }
  ],
  "cleared": []
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
      <div className="rounded-lg border bg-card p-6 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Expense Claims</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Expense
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search expenses..."
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
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
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id} className="group">
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.department}</TableCell>
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
      </div>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Expense Workflow Details</DialogTitle>
          </DialogHeader>
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
