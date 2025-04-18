
import React from "react";
import { Check, Clock, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ApprovalStatus = "pending" | "approved" | "skipped" | "current";

interface ApproverInfo {
  name: string;
  role: string;
  approved: boolean;
  isCurrentPointer: boolean;
  approvedBy?: string;
}

interface ApprovalStepProps {
  title: string;
  approvers: ApproverInfo[];
  status: ApprovalStatus;
  isLastStep?: boolean;
}

export function ApprovalStep({
  title,
  approvers,
  status,
  isLastStep = false,
}: ApprovalStepProps) {
  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-500 shadow-emerald-200";
      case "current":
        return "bg-blue-500 shadow-blue-200";
      case "pending":
        return "bg-slate-300 shadow-slate-200";
      case "skipped":
        return "bg-slate-300 shadow-slate-200";
      default:
        return "bg-slate-300 shadow-slate-200";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm",
            getStatusColor()
          )}
        >
          {status === "approved" ? (
            <Check className="h-5 w-5" />
          ) : status === "current" ? (
            <Clock className="h-5 w-5" />
          ) : (
            <span className="text-xs">
              {approvers.length > 0 ? approvers.length : "✓"}
            </span>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">{title}</h3>
          <div className="mt-2 space-y-2">
            {approvers.length > 0 ? (
              <div className="space-y-2">
                {approvers.map((approver, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg transition-all duration-200",
                      approver.isCurrentPointer 
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {approver.approved ? (
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <User className="h-4 w-4 text-slate-500" />
                    )}
                    <span className="font-medium">{approver.name}</span>
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      {approver.role}
                    </span>
                    {approver.approved && approver.approvedBy && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-auto">
                        Approved by: {approver.approvedBy}
                      </span>
                    )}
                    {approver.isCurrentPointer && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">
                        Current Approver
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-500">No approval needed</span>
            )}
          </div>
        </div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            "ml-4 h-12 w-px",
            status === "approved" ? "bg-emerald-300" : "bg-slate-200 dark:bg-slate-700"
          )}
        />
      )}
    </div>
  );
}
