
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { icons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  buttonText: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, linkTo, buttonText, index }: FeatureCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md"
      data-aos="fade-up" 
      data-aos-delay={50 * index}
    >
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate(linkTo)}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
