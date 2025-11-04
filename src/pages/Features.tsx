import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Code, Database, Cloud, Workflow, Users, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Code,
      title: "Frontend Code Generation",
      description:
        "Generate React.js applications with modern components, hooks, and best practices. Create responsive UIs with Tailwind CSS and TypeScript support.",
      details: [
        "React 18+ with hooks and context",
        "TypeScript for type safety",
        "Tailwind CSS for styling",
        "Component-based architecture",
        "Responsive design patterns",
      ],
    },
    {
      icon: Database,
      title: "Backend API Development",
      description:
        "Create robust backend APIs in Java or Python with industry-standard patterns and frameworks.",
      details: [
        "Spring Boot for Java APIs",
        "FastAPI/Django for Python",
        "RESTful API design",
        "Authentication & authorization",
        "Database integration",
      ],
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description:
        "Generate Terraform code for AWS infrastructure with best practices and security configurations.",
      details: [
        "AWS services configuration",
        "Terraform infrastructure as code",
        "Auto-scaling groups",
        "Load balancers & networking",
        "Security groups & IAM roles",
      ],
    },
    {
      icon: Database,
      title: "Database Schema",
      description:
        "Design and generate database schemas using Liquibase or other industry-standard tools.",
      details: [
        "Visual database diagram editor",
        "Liquibase changelog generation",
        "Relationship management",
        "Data migration scripts",
        "Schema versioning",
      ],
    },
    {
      icon: Workflow,
      title: "Microservices Architecture",
      description:
        "Generate complete microservices with proper communication patterns and service discovery.",
      details: [
        "Service mesh configuration",
        "API gateway setup",
        "Inter-service communication",
        "Circuit breakers & resilience",
        "Distributed tracing",
      ],
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together with role-based access control and team management features.",
      details: [
        "Role-based permissions",
        "Team workspace management",
        "Project sharing & collaboration",
        "Version control integration",
        "Real-time collaboration",
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
              Powerful Features for Modern Development
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale modern
              applications with AI-powered code generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass rounded-lg p-8 hover-lift">
                <div className="flex items-center mb-6">
                  <div className="rounded-lg bg-gradient-to-r from-primary to-blue-500 p-3 mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>

                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <Shield className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
