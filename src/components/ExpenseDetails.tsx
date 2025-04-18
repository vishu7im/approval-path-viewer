
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, User, Briefcase } from "lucide-react";

interface ExpenseDetailsProps {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  category: string;
  submittedBy: string;
}

export function ExpenseDetails({
  id,
  title,
  amount,
  date,
  status,
  category,
  submittedBy,
}: ExpenseDetailsProps) {
  const getStatusColor = () => {
    switch (status) {
      case "draft":
        return "bg-slate-500";
      case "project_approval":
        return "bg-amber-500";
      case "finance_approval":
        return "bg-blue-500";
      case "cleared":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-slate-500">ID: {id}</CardDescription>
          </div>
          <Badge className={`${getStatusColor()} shadow-sm`}>
            {status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <DollarSign className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-500">Amount</p>
              <p className="text-lg font-bold">${amount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Category</p>
                <p>{category}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Date</p>
                <p>{date}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 col-span-2">
              <User className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-500">Submitted By</p>
                <p>{submittedBy}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
