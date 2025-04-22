
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
import { ArrowRight, Clock, DollarSign, Filter, Plus, Search } from "lucide-react";
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
    status: "EXPENSE_APPROVAL_REQUESTED",
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
    status: "FINANCE_APPROVAL_REQUESTED",
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
    status: "CLEARED",
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
    status: "EXPENSE_APPROVAL_REQUESTED",
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
    status: "FINANCE_APPROVAL_REQUESTED",
    category: "Marketing",
    submittedBy: "Alex Brown",
    description: "Q2 digital marketing campaign",
    department: "Marketing"
  }
];

const mockApprovalHierarchy = {
  "EXPENSE_REQUESTED": [
    {
      "current_pointer": false,
      "is_completed": true
    }
  ],
  "EXPENSE_APPROVAL_REQUESTED": [
    {
      "role": "CEO",
      "role_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "user_name": "CEO",
      "user_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "next_status": "FINANCE_APPROVAL_REQUESTED",
      "previous_status": "EXPENSE_REQUESTED",
      "current_status": "EXPENSE_APPROVAL_REQUESTED",
      "level": 1,
      "approved_by_uuid": null,
      "approved_by_name": null,
      "current_pointer": false,
      "is_completed": false
    },
    {
      "role": "PROJECT_MANAGER",
      "role_uuid": "dcb9eb69-efc8-4712-9a8d-8a6689bddffd",
      "user_name": "project vishal",
      "user_uuid": "daf68198-0c54-426a-98f5-7ed16fd00e85",
      "next_status": "FINANCE_APPROVAL_REQUESTED",
      "previous_status": "EXPENSE_REQUESTED",
      "current_status": "EXPENSE_APPROVAL_REQUESTED",
      "level": 2,
      "approved_by_uuid": "daf68198-0c54-426a-98f5-7ed16fd00e85",
      "approved_by_name": "project vishal",
      "remark": "approved",
      "current_pointer": false,
      "is_completed": true
    },
    {
      "role": "CATEGORY_MANAGER",
      "role_uuid": "b957fc58-1367-4d57-a602-8dce179f4c5b",
      "user_name": "Category Manager",
      "user_uuid": "99a08cca-7f07-4740-87f7-96a216355112",
      "next_status": "FINANCE_APPROVAL_REQUESTED",
      "previous_status": "EXPENSE_REQUESTED",
      "current_status": "EXPENSE_APPROVAL_REQUESTED",
      "level": 3,
      "approved_by_uuid": "522bc00e-6953-482c-8ca2-99c162bc6adc",
      "approved_by_name": "Vishal Munday",
      "remark": "Approved with conditions",
      "current_pointer": false,
      "is_completed": true
    }
  ],
  "FINANCE_APPROVAL_REQUESTED": [
    {
      "role": "FINANCE_MANAGER",
      "role_uuid": "44bfd3e9-3732-4500-abde-19c6ef9b0d63",
      "user_name": "NAITIK KASHYAP",
      "user_uuid": "9725e1b2-08c1-45ad-b257-5bee03094876",
      "next_status": "FINANCE",
      "previous_status": "EXPENSE_REQUESTED",
      "current_status": "FINANCE_APPROVAL_REQUESTED",
      "level": 1,
      "approved_by_uuid": "522bc00e-6953-482c-8ca2-99c162bc6adc",
      "approved_by_name": "Vishal Munday",
      "remark": "Budget validated and approved",
      "current_pointer": false,
      "is_completed": true
    }
  ],
  "FINANCE": [
    {
      "current_pointer": false,
      "is_completed": true
    }
  ],
  "CLEARED": [
    {
      "current_pointer": true,
      "is_completed": true
    }
  ]
};

export function ExpenseList() {
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EXPENSE_REQUESTED":
        return "bg-slate-500 hover:bg-slate-600";
      case "EXPENSE_APPROVAL_REQUESTED":
        return "bg-amber-500 hover:bg-amber-600";
      case "FINANCE_APPROVAL_REQUESTED":
        return "bg-blue-500 hover:bg-blue-600";
      case "FINANCE":
        return "bg-purple-500 hover:bg-purple-600";
      case "CLEARED":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
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
          
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
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
                    <TableCell className="font-mono text-xs">{expense.id}</TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{expense.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-900 dark:text-slate-100">
                        <DollarSign className="h-4 w-4 text-emerald-500 mr-1" />
                        {expense.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.department}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(expense.status)} shadow-sm`}>
                        {formatStatus(expense.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{expense.submittedBy}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedExpense(expense)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        View Workflow
                        <ArrowRight className="ml-1 h-3 w-3" />
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
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
              Expense Workflow Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {selectedExpense && (
              <>
                <ExpenseDetails {...selectedExpense} />
                <ApprovalPathViewer
                  approvalHierarchy={mockApprovalHierarchy}
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
