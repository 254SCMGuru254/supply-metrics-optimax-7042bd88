import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const Pricing = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Plan</h2>
        <p className="text-gray-500">
          Start optimizing your supply chain today with our flexible pricing plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Basic</CardTitle>
            <CardDescription className="text-gray-500">
              For small businesses getting started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Up to 500 data points
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Basic optimization algorithms
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-red-500 w-5 h-5" />
                Limited support
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardContent>
        </Card>

        {/* Standard Plan */}
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Standard</CardTitle>
            <CardDescription className="text-gray-500">
              For growing businesses needing more features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Up to 5,000 data points
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Advanced optimization algorithms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Email and chat support
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Premium</CardTitle>
            <CardDescription className="text-gray-500">
              For enterprises requiring advanced analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Unlimited data points
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                Custom optimization algorithms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-5 h-5" />
                24/7 priority support
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
