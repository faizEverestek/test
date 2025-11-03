import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Perfect for individual developers and small teams",
      features: [
        "Up to 10 projects",
        "5 workflows per project",
        "React & Vue.js generation",
        "Basic Python/Java APIs",
        "Standard templates",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Business", 
      price: "$79",
      period: "/month",
      description: "Ideal for growing teams and companies",
      features: [
        "Up to 50 projects",
        "Unlimited workflows",
        "Full-stack generation",
        "Advanced microservices",
        "Custom templates",
        "Team collaboration",
        "Priority support",
        "Advanced integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month", 
      description: "For large organizations with complex needs",
      features: [
        "Unlimited projects",
        "Unlimited workflows",
        "White-label solution",
        "Custom AI models",
        "Advanced permissions",
        "SSO integration",
        "Dedicated support",
        "Custom integrations",
        "On-premise deployment"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-surface">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, then add a site plan to go live. Account plans unlock additional features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover-lift ${plan.popular ? 'border-primary shadow-lg' : 'border-border/50'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};