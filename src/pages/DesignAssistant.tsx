
import { SupplyChainDesignAssistant } from "@/components/ai-design-assistant/SupplyChainDesignAssistant";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const DesignAssistant = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-1" />
              Design Assistant
            </span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Design Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Chat with AI to design, analyze, and optimize your supply chain structure
          </p>
        </div>
        
        <SupplyChainDesignAssistant />
      </div>
    </div>
  );
};

export default DesignAssistant;
