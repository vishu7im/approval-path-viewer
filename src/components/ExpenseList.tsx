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
import { Card, CardHeader, CardTitle } from "./ui/card";

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
        return "bg-slate-500 hover:bg-slate-600";
      case "project_approval":
        return "bg-amber-500 hover:bg-amber-600";
      case "finance_approval":
        return "bg-blue-500 hover:bg-blue-600";
      case "cleared":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                Expense Claims
              </CardTitle>
              <p className="text-slate-500 mt-1">Manage and track expense approvals</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              New Expense
            </Button>
          </div>
        </CardHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                placeholder="Search expenses..."
              />
            </div>
            <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-700">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Submitted By</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{expense.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-900 dark:text-slate-100">
                        <DollarSign className="h-4 w-4 text-slate-500 mr-1" />
                        {expense.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.department}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(expense.status)} shadow-sm`}>
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
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200"
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
      </Card>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Expense Workflow Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
