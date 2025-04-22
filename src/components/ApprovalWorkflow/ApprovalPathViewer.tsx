import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalStep } from "./ApprovalStep";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ApprovalLevel {
  role?: string;
  role_uuid?: string;
  user_name?: string;
  user_uuid?: string;
  next_status?: string;
  previous_status?: string;
  current_status?: string;
  level?: number;
  approved_by_uuid?: string | null;
  approved_by_name?: string | null;
  current_pointer?: boolean;
  is_completed?: boolean;
  remark?: string;
}

export interface ApprovalHierarchy {
  [key: string]: ApprovalLevel[];
}

interface ApprovalPathViewerProps {
  approvalHierarchy: ApprovalHierarchy;
  currentStatus: string;
  expenseAmount?: number;
}

export function ApprovalPathViewer({
  approvalHierarchy,
  currentStatus,
}: ApprovalPathViewerProps) {
  const getStepStatus = (status: string, approvers: ApprovalLevel[]) => {
    const statusKeys = Object.keys(approvalHierarchy);
    const currentIndex = statusKeys.indexOf(currentStatus);
    const statusIndex = statusKeys.indexOf(status);

    const hasCurrentPointer = approvers.some(a => a.current_pointer);
    const isCompleted = approvers.every(a => a.is_completed);
    
    if (hasCurrentPointer) return "current";
    if (isCompleted || statusIndex < currentIndex) return "approved";
    return "pending";
  };

  const formatStatusName = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const approvalSteps = useMemo(() => {
    const steps = [];
    
    Object.entries(approvalHierarchy).forEach(([status, approvers]) => {
      if (approvers.length === 0 || 
          (approvers.length === 1 && !approvers[0].role && !approvers[0].user_name)) {
        if (status === "EXPENSE_REQUESTED" || status === "CLEARED" || status === "FINANCE") {
          steps.push({
            title: formatStatusName(status),
            approvers: [],
            status: getStepStatus(status, approvers),
          });
        }
      } else {
        const levelGroups = approvers.reduce((acc, approver) => {
          const level = approver.level || 0;
          if (!acc[level]) acc[level] = [];
          acc[level].push(approver);
          return acc;
        }, {} as Record<number, ApprovalLevel[]>);
        
        Object.entries(levelGroups).forEach(([level, levelApprovers]) => {
          const levelTitle = `${formatStatusName(status)} - Level ${level}`;
          
          steps.push({
            title: levelTitle,
            approvers: levelApprovers.map(a => ({
              name: a.user_name || '',
              role: a.role || '',
              approved: !!a.approved_by_uuid,
              isCurrentPointer: a.current_pointer || false,
              approvedBy: a.approved_by_name || '',
              isCompleted: a.is_completed || false,
              remark: a.remark || ''
            })),
            status: getStepStatus(status, levelApprovers),
          });
        });
      }
    });
    
    return steps;
  }, [approvalHierarchy, currentStatus]);

  return (
    <Card className="w-full shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Approval Workflow
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[480px]">
        <CardContent className="p-4">
          <div className="space-y-4">
            {approvalSteps.map((step, index) => (
              <ApprovalStep
                key={index}
                title={step.title}
                approvers={step.approvers}
                status={step.status}
                isLastStep={index === approvalSteps.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
