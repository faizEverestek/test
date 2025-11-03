import { Header } from "@/components/Header";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const Pricing = () => {
  const plans = [
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Perfect for individual developers and small teams",
      popular: false,
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "Frontend code generation", included: true },
        { name: "Backend API generation", included: true },
        { name: "Database schema design", included: true },
        { name: "Basic workflow editor", included: true },
        { name: "Standard support", included: true },
        { name: "Team collaboration (up to 3 members)", included: true },
        { name: "Advanced integrations", included: false },
        { name: "Enterprise security", included: false },
        { name: "Custom templates", included: false },
      ],
    },
    {
      name: "Business",
      price: "$99",
      period: "/month",
      description: "Ideal for growing teams and businesses",
      popular: true,
      features: [
        { name: "Up to 25 projects", included: true },
        { name: "Frontend code generation", included: true },
        { name: "Backend API generation", included: true },
        { name: "Database schema design", included: true },
        { name: "Advanced workflow editor", included: true },
        { name: "Priority support", included: true },
        { name: "Team collaboration (up to 15 members)", included: true },
        { name: "Advanced integrations", included: true },
        { name: "Custom templates", included: true },
        { name: "Enterprise security", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      popular: false,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "Frontend code generation", included: true },
        { name: "Backend API generation", included: true },
        { name: "Database schema design", included: true },
        { name: "Advanced workflow editor", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Unlimited team members", included: true },
        { name: "Advanced integrations", included: true },
        { name: "Custom templates", included: true },
        { name: "Enterprise security & compliance", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free, scale as you grow. All plans include our core AI code
              generation features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative glass rounded-lg p-8 hover-lift ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">All plans include</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                "AI-powered code generation",
                "Multiple programming languages",
                "Cloud infrastructure templates",
                "24/7 platform availability",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-success mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
