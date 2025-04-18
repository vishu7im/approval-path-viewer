
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalStep } from "./ApprovalStep";

export interface ApprovalHierarchy {
  [key: string]: ApprovalLevel[];
}

export interface ApprovalLevel {
  role: string;
  user_name: string;
  condtion?: string[];
  next_status: string;
  previous: string;
  current_status: string;
  level: string;
}

interface ApprovalPathViewerProps {
  approvalHierarchy: ApprovalHierarchy;
  currentStatus: string;
  expenseAmount: number;
  isApproved?: boolean;
}

export function ApprovalPathViewer({
  approvalHierarchy,
  currentStatus,
  expenseAmount,
  isApproved = false,
}: ApprovalPathViewerProps) {
  const getStepStatus = (status: string) => {
    // Status can be: current, pending, approved, skipped
    const statusKeys = Object.keys(approvalHierarchy);
    const currentIndex = statusKeys.indexOf(currentStatus);
    const statusIndex = statusKeys.indexOf(status);

    if (status === currentStatus) return "current";
    if (statusIndex < currentIndex) return "approved";
    return "pending";
  };

  const shouldShowLevel = (level: ApprovalLevel[]) => {
    // If any level has a condition, check if it should be displayed
    if (!level || level.length === 0) return true;

    // Check if this level has conditions
    const hasConditions = level.some(
      (approver) => approver.condtion && approver.condtion.length > 0
    );

    if (!hasConditions) return true;

    // Check if any approver's condition is met
    return level.some((approver) => {
      if (!approver.condtion) return true;
      
      return approver.condtion.some((condition) => {
        // Parse the condition (simple implementation for "amount>1000")
        if (condition.includes("ammount>")) {
          const threshold = parseInt(condition.split(">")[1]);
          return expenseAmount > threshold;
        }
        return true;
      });
    });
  };

  const groupApproversByLevel = (approvers: ApprovalLevel[]) => {
    const grouped: { [key: string]: ApprovalLevel[] } = {};
    
    approvers.forEach(approver => {
      if (!grouped[approver.level]) {
        grouped[approver.level] = [];
      }
      grouped[approver.level].push(approver);
    });
    
    return Object.values(grouped);
  };

  const approvalSteps = useMemo(() => {
    const steps = [];
    
    Object.entries(approvalHierarchy).forEach(([status, approvers]) => {
      if (approvers.length === 0) {
        // Handle start or end states with no approvers
        steps.push({
          title: status === "draft" ? "Draft" : "Completed",
          approvers: [],
          status: getStepStatus(status),
        });
      } else if (shouldShowLevel(approvers)) {
        // Group approvers by level
        const levelsGroup = groupApproversByLevel(approvers);
        
        levelsGroup.forEach((levelApprovers, index) => {
          // Check if any approver in this level has a condition
          const levelTitle = `${status.split('_').join(' ')} - Level ${levelApprovers[0].level}`;
          
          steps.push({
            title: levelTitle,
            approvers: levelApprovers.map(a => ({
              name: a.user_name,
              role: a.role,
              approved: currentStatus !== status && getStepStatus(status) === "approved"
            })),
            status: getStepStatus(status),
          });
        });
      }
    });
    
    return steps;
  }, [approvalHierarchy, currentStatus, expenseAmount]);

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
        
        <div className="mt-6 text-sm text-gray-500">
          <div className="font-medium">Current Status: <span className="text-blue-600 capitalize">{currentStatus.replace("_", " ")}</span></div>
          <div>Expense Amount: <span className="font-medium">${expenseAmount.toLocaleString()}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
