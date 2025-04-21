
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import OpenSourceFeatures from "@/components/home/OpenSourceFeatures";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="container py-10">
      <Hero />
      <FeatureGrid />
      <OpenSourceFeatures />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
