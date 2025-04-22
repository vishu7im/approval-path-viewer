
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, User, Briefcase, Info, Clock } from "lucide-react";

interface ExpenseDetailsProps {
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

export function ExpenseDetails({
  id,
  title,
  amount,
  date,
  status,
  category,
  submittedBy,
  description,
  department
}: ExpenseDetailsProps) {
  const getStatusColor = () => {
    switch (status) {
      case "EXPENSE_REQUESTED":
        return "bg-slate-500";
      case "EXPENSE_APPROVAL_REQUESTED":
        return "bg-amber-500";
      case "FINANCE_APPROVAL_REQUESTED":
        return "bg-blue-500";
      case "FINANCE":
        return "bg-purple-500";
      case "CLEARED":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
      <CardHeader className="pb-2 relative border-b border-slate-100 dark:border-slate-700">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/10 dark:from-blue-900/10 dark:to-purple-900/5 rounded-full -mr-16 -mt-16 z-0"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
              {title}
            </CardTitle>
            <CardDescription className="text-slate-500">
              <span className="font-mono tracking-tight">{id}</span>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor()} shadow-sm`}>
            {formatStatus(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-lg shadow-sm">
            <DollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Amount</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${amount.toLocaleString()}</p>
            </div>
          </div>
          
          {description && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 text-slate-500 mr-2" />
                <p className="text-sm font-medium text-slate-500">Description</p>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <Briefcase className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Category</p>
                <p className="font-medium">{category}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Date</p>
                <p className="font-medium">{date}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
              <User className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Submitted By</p>
                <p className="font-medium">{submittedBy}</p>
              </div>
            </div>
            
            {department && (
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Department</p>
                  <p className="font-medium">{department}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
