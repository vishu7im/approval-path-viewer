
import React from "react";
import { ExpenseList } from "@/components/ExpenseList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Index;
