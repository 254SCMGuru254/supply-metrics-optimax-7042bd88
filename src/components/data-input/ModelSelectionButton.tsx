
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type ModelSelectionButtonProps = {
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const ModelSelectionButton = ({
  isActive,
  onClick,
  icon: Icon,
  title,
  description,
}: ModelSelectionButtonProps) => {
  return (
    <Button 
      variant={isActive ? "default" : "outline"} 
      className="flex items-center justify-start gap-2 p-4 h-auto"
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </Button>
  );
};
