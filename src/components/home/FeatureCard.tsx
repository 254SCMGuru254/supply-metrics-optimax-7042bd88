
import { LucideIconType } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIconType;
  href?: string;
}

const FeatureCard = ({ title, description, icon: Icon, href }: FeatureCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {href && (
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href={href}>Learn More</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FeatureCard;
