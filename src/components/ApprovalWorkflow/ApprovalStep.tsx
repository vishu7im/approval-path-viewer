
import React, { useState } from "react";
import { Check, Clock, MessageSquare, User, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedRemarks, setExpandedRemarks] = useState<Record<number, boolean>>({});

  const toggleRemark = (index: number) => {
    setExpandedRemarks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-500 text-white";
      case "current":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-start group">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors",
            getStatusColor()
          )}
        >
          {status === "approved" ? (
            <Check className="h-4 w-4" />
          ) : status === "current" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <span className="text-xs">
              {approvers.length > 0 ? approvers.length : "○"}
            </span>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <div className="mt-2 space-y-2">
            {approvers.length > 0 ? (
              <div className="space-y-2">
                {approvers.map((approver, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-md border transition-all",
                      approver.isCurrentPointer
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : approver.approved
                        ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40"
                        : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium">{approver.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                        {approver.role}
                      </span>
                    </div>
                    {approver.approved && approver.approvedBy && (
                      <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        Approved by: {approver.approvedBy}
                      </div>
                    )}
                    {approver.remark && (
                      <div className="mt-2">
                        <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <MessageSquare className="h-3 w-3 mt-0.5" />
                          {approver.remark.length > 100 && !expandedRemarks[index] ? (
                            <div className="flex-1">
                              <span>{approver.remark.substring(0, 100)}...</span>
                              <button 
                                onClick={() => toggleRemark(index)}
                                className="ml-1 text-blue-500 hover:text-blue-700 inline-flex items-center"
                              >
                                <span className="mr-1">Show more</span>
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          ) : approver.remark.length > 100 ? (
                            <div className="flex-1">
                              <span>{approver.remark}</span>
                              <button 
                                onClick={() => toggleRemark(index)}
                                className="ml-1 text-blue-500 hover:text-blue-700 inline-flex items-center"
                              >
                                <span className="mr-1">Show less</span>
                                <ChevronUp className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span>{approver.remark}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-8 flex items-center text-sm text-slate-500">
                No approval needed
              </div>
            )}
          </div>
        </div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            "ml-4 h-8 w-px",
            status === "approved"
              ? "bg-emerald-200 dark:bg-emerald-800"
              : "bg-slate-200 dark:bg-slate-700"
          )}
        />
      )}
    </div>
  );
}
