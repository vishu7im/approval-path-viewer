
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>ID: {id}</CardDescription>
          </div>
          <Badge className={getStatusColor()}>
            {status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Amount</p>
            <p className="text-lg font-semibold">${amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p>{category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p>{date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Submitted By</p>
            <p>{submittedBy}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
