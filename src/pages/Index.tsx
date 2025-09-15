import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FloatingChatbot from "@/components/chatbot/FloatingChatbot";
import StrategicHero from "@/components/home/StrategicHero";
import BusinessChallengeSelector from "@/components/home/BusinessChallengeSelector";
import IndustryApplications from "@/components/home/IndustryApplications";
import ComprehensiveQuestionnaire from "@/components/home/ComprehensiveQuestionnaire";
import ProfessionalFooter from "@/components/layout/ProfessionalFooter";
import ProfessionalHeader from "@/components/layout/ProfessionalHeader";
import TrustIndicators from "@/components/home/TrustIndicators";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProfessionalHeader />
      <StrategicHero />
      <TrustIndicators />
      <BusinessChallengeSelector />
      <ComprehensiveQuestionnaire />
      <IndustryApplications />
      <ProfessionalFooter />
      <FloatingChatbot />
    </div>
  );
};

export default Index;