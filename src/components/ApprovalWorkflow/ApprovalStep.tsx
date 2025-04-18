
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
        return "bg-green-500";
      case "current":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-300";
      case "skipped":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white",
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
          <h3 className="font-medium">{title}</h3>
          <div className="mt-1 text-sm text-gray-500">
            {approvers.length > 0 ? (
              <div className="space-y-1">
                {approvers.map((approver, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 text-sm p-2 rounded-md",
                      approver.isCurrentPointer && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    {approver.approved ? (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{approver.name}</span>
                    <span className="text-xs italic">({approver.role})</span>
                    {approver.approved && approver.approvedBy && (
                      <span className="text-xs text-green-600">
                        Approved by: {approver.approvedBy}
                      </span>
                    )}
                    {approver.isCurrentPointer && (
                      <span className="text-xs text-blue-600 ml-auto">
                        Current Approver
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span>No approval needed</span>
            )}
          </div>
        </div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            "ml-4 h-12 w-px bg-gray-300",
            status === "approved" && "bg-green-300"
          )}
        />
      )}
    </div>
  );
}
