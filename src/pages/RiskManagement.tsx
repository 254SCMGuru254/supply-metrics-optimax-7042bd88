import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ComprehensiveRiskManagement } from "@/components/risk-management/ComprehensiveRiskManagement";

const RiskManagement = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <ComprehensiveRiskManagement />
      </div>
    </MainLayout>
  );
};

export default RiskManagement;