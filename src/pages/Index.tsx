import ProfessionalNavbar from "@/components/home/ProfessionalNavbar";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import FloatingChatbot from "@/components/chatbot/FloatingChatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ProfessionalNavbar />
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <Hero />
          <FeatureGrid />
          <CallToAction />
        </div>
        <Footer />
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default Index;