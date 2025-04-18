
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalStep } from "./ApprovalStep";

export interface ApprovalLevel {
  role: string;
  user_name: string;
  next_status: string;
  previous_status: string;
  current_status: string;
  level: number;
  approved_by_uuid: string | null;
  approved_by_name: string;
  current_pointer: boolean;
}

export interface ApprovalHierarchy {
  [key: string]: ApprovalLevel[];
}

interface ApprovalPathViewerProps {
  approvalHierarchy: ApprovalHierarchy;
  currentStatus: string;
  expenseAmount: number;
}

export function ApprovalPathViewer({
  approvalHierarchy,
  currentStatus,
}: ApprovalPathViewerProps) {
  const getStepStatus = (status: string, approvers: ApprovalLevel[]) => {
    const statusKeys = Object.keys(approvalHierarchy);
    const currentIndex = statusKeys.indexOf(currentStatus);
    const statusIndex = statusKeys.indexOf(status);

    // Check if any approver in this status has current_pointer
    const hasCurrentPointer = approvers.some(a => a.current_pointer);
    
    if (hasCurrentPointer) return "current";
    if (statusIndex < currentIndex) return "approved";
    return "pending";
  };

  const approvalSteps = useMemo(() => {
    const steps = [];
    
    Object.entries(approvalHierarchy).forEach(([status, approvers]) => {
      if (approvers.length === 0) {
        steps.push({
          title: status === "draft" ? "Draft" : "Completed",
          approvers: [],
          status: getStepStatus(status, approvers),
        });
      } else {
        // Group approvers by level
        const levelGroups = approvers.reduce((acc, approver) => {
          const level = approver.level;
          if (!acc[level]) acc[level] = [];
          acc[level].push(approver);
          return acc;
        }, {} as Record<number, ApprovalLevel[]>);
        
        Object.entries(levelGroups).forEach(([level, levelApprovers]) => {
          const levelTitle = `${status.split('_').join(' ')} - Level ${level}`;
          
          steps.push({
            title: levelTitle,
            approvers: levelApprovers.map(a => ({
              name: a.user_name,
              role: a.role,
              approved: !!a.approved_by_uuid,
              isCurrentPointer: a.current_pointer,
              approvedBy: a.approved_by_name
            })),
            status: getStepStatus(status, levelApprovers),
          });
        });
      }
    });
    
    return steps;
  }, [approvalHierarchy, currentStatus]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Expense Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
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
    </Card>
  );
}
