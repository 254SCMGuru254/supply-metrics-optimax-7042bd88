
import React from "react";
import { useParams } from "react-router-dom";
import ComprehensiveInventoryManagement from "@/components/inventory-optimization/ComprehensiveInventoryManagement";

const InventoryManagement = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No project selected. Please go back to the dashboard and select a project.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ComprehensiveInventoryManagement projectId={projectId} />
    </div>
  );
};

export default InventoryManagement;
