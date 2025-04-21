
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
}

const FeatureCard = ({ icon: Icon, title, description, linkTo, buttonText }: FeatureCardProps) => {
  return (
    <Link to={linkTo} className="group">
      <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
        <Icon className="h-10 w-10 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
          {buttonText}
        </Button>
      </Card>
    </Link>
  );
};

export default FeatureCard;
