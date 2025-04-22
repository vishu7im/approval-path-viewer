
import React from "react";
import { Check, Clock, MessageSquare, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ApprovalStatus = "pending" | "approved" | "skipped" | "current";

interface ApproverInfo {
  name: string;
  role: string;
  approved: boolean;
  isCurrentPointer: boolean;
  approvedBy?: string;
  isCompleted?: boolean;
  remark?: string;
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
      <div className="flex items-start">
        <div
          className={cn(
            "w-8 h-8 mt-1 rounded-full flex items-center justify-center text-white shadow-sm",
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
                      "flex flex-col gap-2 p-4 rounded-lg transition-all duration-200 border",
                      approver.isCurrentPointer 
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                        : approver.approved
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                      "hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {approver.approved ? (
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <User className="h-4 w-4 text-slate-500" />
                      )}
                      <span className="font-medium">{approver.name}</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                        {approver.role}
                      </span>
                      
                      {approver.isCurrentPointer && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full ml-auto">
                          Current Approver
                        </span>
                      )}
                      
                      {approver.isCompleted && !approver.isCurrentPointer && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full ml-auto">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    {approver.approved && approver.approvedBy && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                        <Check className="h-3 w-3" />
                        Approved by: {approver.approvedBy}
                      </div>
                    )}
                    
                    {approver.remark && (
                      <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700 text-sm">
                        <div className="flex items-center gap-1 text-slate-500 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-xs font-medium">Remark:</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{approver.remark}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center h-10 text-sm text-slate-500">
                <span>No approval needed at this stage</span>
              </div>
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
