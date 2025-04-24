
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="container py-10">
      <Hero />
      <FeatureGrid />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
