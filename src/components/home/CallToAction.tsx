
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <div className="flex justify-center mb-8">
      <Link to="/kenya-supply-chain">
        <Button size="lg">
          Start Optimizing Your Kenyan Supply Chain
        </Button>
      </Link>
    </div>
  );
};

export default CallToAction;
