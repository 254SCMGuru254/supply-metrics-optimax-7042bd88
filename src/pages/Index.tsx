import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";

const Index = () => {
  return (
    <div className="container py-10">
      <Hero />
      <FeatureGrid />
      <CallToAction />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {modelFormulaRegistry.map(model => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <div className="mb-2 text-2xl font-bold">{model.name}</div>
            <div className="mb-4 text-muted-foreground">{model.description}</div>
            <a href={`/${model.id.replace(/-/g, "")}`} className="mt-auto btn btn-primary">Analyze</a>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
