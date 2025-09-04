import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ComprehensiveFacilityLocation } from "@/components/facility-location/ComprehensiveFacilityLocation";

const FacilityLocation = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <ComprehensiveFacilityLocation />
      </div>
    </MainLayout>
  );
};

export default FacilityLocation;