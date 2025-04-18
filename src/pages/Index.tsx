
import React, { useState } from "react";
import { ApprovalPathViewer } from "@/components/ApprovalWorkflow/ApprovalPathViewer";
import { ExpenseDetails } from "@/components/ExpenseDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [expenseAmount, setExpenseAmount] = useState(1500);
  const [currentStatus, setCurrentStatus] = useState("project_approval");

  // Approval hierarchy data
  const approval_hierarchy = {
    "draft": [],
    "project_approval": [
      {
        role: "project_manager",
        user_name: "ramesh",
        condtion: ["ammount>1000"],
        next_status: "finance_approval",
        previous: "draft",
        current_status: "project_approval",
        level: "1"
      },
      {
        role: "project_manager",
        user_name: "rohit",
        condtion: ["ammount>1000"],
        next_status: "finance_approval",
        previous: "draft",
        current_status: "project_approval",
        level: "1"
      },
      {
        role: "category_manager",
        user_name: "manish",
        next_status: "finance_approval",
        previous: "draft",
        current_status: "project_approval",
        level: "2"
      },
    ],
    "finance_approval": [
      {
        role: "finance_manager",
        user_name: "rahul",
        next_status: "cleared",
        previous: "draft",
        current_status: "finance_approval",
        level: "1"
      },
      {
        role: "finance_manager",
        user_name: "rahul",
        next_status: "cleared",
        previous: "draft",
        current_status: "finance_approval",
        level: "2"
      },
    ],
    "cleared": []
  };

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Expense Approval Workflow</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ApprovalPathViewer 
              approvalHierarchy={approval_hierarchy}
              currentStatus={currentStatus}
              expenseAmount={expenseAmount}
            />
          </div>
          
          <div className="space-y-6">
            <ExpenseDetails
              id="EXP-2023-001"
              title="Business Trip to New York"
              amount={expenseAmount}
              date="2023-04-15"
              status={currentStatus}
              category="Travel"
              submittedBy="John Doe"
            />
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Simulation Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Expense Amount: ${expenseAmount}
                  </label>
                  <Slider
                    defaultValue={[expenseAmount]}
                    max={5000}
                    min={500}
                    step={100}
                    onValueChange={(val) => setExpenseAmount(val[0])}
                    className="my-2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Current Status:
                  </label>
                  <Tabs defaultValue={currentStatus} onValueChange={handleStatusChange} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="draft">Draft</TabsTrigger>
                      <TabsTrigger value="project_approval">Project</TabsTrigger>
                      <TabsTrigger value="finance_approval">Finance</TabsTrigger>
                      <TabsTrigger value="cleared">Cleared</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
