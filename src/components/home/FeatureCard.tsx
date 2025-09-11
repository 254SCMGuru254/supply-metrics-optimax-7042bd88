
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  frontContent?: string;
  backContent?: string;
}

const FeatureCard = ({ title, description, icon: Icon, href, frontContent, backContent }: FeatureCardProps) => {
  return (
    <Link to={href} className="block h-64">
      <div className="relative w-full h-full [perspective:1000px] group">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front Face */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl border bg-gradient-to-br from-background to-muted/20 shadow-lg p-6 flex flex-col justify-center items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{frontContent || "Hover to learn more"}</p>
          </div>
          
          {/* Back Face */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-3 text-primary">{title}</h3>
            <p className="text-sm text-foreground/80 mb-4">{backContent || description}</p>
            <div className="mt-auto">
              <span className="inline-flex items-center text-xs font-medium text-primary">
                Explore Now →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
