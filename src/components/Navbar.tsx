
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-bold text-xl">
          Supply Chain Optimax
        </Link>
        
        <NavigationMenu className="ml-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Optimization</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/route-optimization"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Route Optimization
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Advanced vehicle routing and delivery optimization
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/network-optimization" title="Network Optimization">
                    Supply network design and facility location
                  </ListItem>
                  <ListItem href="/center-of-gravity" title="Center of Gravity">
                    Optimal facility placement analysis
                  </ListItem>
                  <ListItem href="/heuristic-optimization" title="Heuristic Optimization">
                    Advanced algorithmic optimization
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Analysis</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem href="/simulation" title="Simulation">
                    Monte Carlo and scenario analysis
                  </ListItem>
                  <ListItem href="/inventory-management" title="Inventory Management">
                    EOQ and multi-echelon optimization
                  </ListItem>
                  <ListItem href="/isohedron-analysis" title="Isohedron Analysis">
                    Geometric optimization analysis
                  </ListItem>
                  <ListItem href="/business-value" title="Business Value">
                    ROI and business impact analysis
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem href="/data-management" title="Data Management">
                    Import/export and Kenya features
                  </ListItem>
                  <ListItem href="/pricing" title="Pricing">
                    Subscription plans and pricing models
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

const ListItem = ({ className, title, children, href, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
