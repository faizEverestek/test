import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  Zap,
  Database,
  Cloud,
  GitBranch,
  Users,
  MessageSquare,
  Workflow,
  ArrowRight,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const features = [
    {
      icon: Code2,
      title: "Frontend Generation",
      description: "Generate React.js components and complete applications",
    },
    {
      icon: Zap,
      title: "Backend APIs",
      description:
        "Create Java and Python backend services with best practices",
    },
    {
      icon: Cloud,
      title: "Infrastructure",
      description: "Generate Terraform code for AWS cloud deployments",
    },
    {
      icon: Database,
      title: "Database Schema",
      description: "Design and generate Liquibase database migrations",
    },
    {
      icon: GitBranch,
      title: "Microservices",
      description: "Build scalable microservice architectures",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with roles, teams, and permissions",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5" />

        {/* Hero content */}
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Generate Code with <span className="text-gradient">AI Power</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into production-ready code. Generate
              frontend, backend, infrastructure, and database schemas with our
              advanced AI platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                variant="hero"
                size="lg"
                onClick={onGetStarted}
                className="w-full sm:w-auto"
              >
                Start Building Now
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover-lift"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Input Methods */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Two Ways to Create
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose your preferred method to generate code
            </p>
          </div>

          <Tabs defaultValue="prompts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Text Prompts
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Visual Workflows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">
                        Natural Language Generation
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Describe what you want to build in plain English. Our AI
                        understands context, requirements, and technical
                        specifications to generate production-ready code.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            1
                          </div>
                          <p className="text-sm">
                            Describe your application requirements
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            2
                          </div>
                          <p className="text-sm">
                            AI analyzes and generates code structure
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            3
                          </div>
                          <p className="text-sm">
                            Review, customize, and deploy
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Example prompt:
                      </div>
                      <div className="text-sm font-mono bg-muted p-3 rounded">
                        "Create a task management app with user authentication,
                        project workspaces, real-time collaboration, and team
                        management. Use React frontend, Python FastAPI backend,
                        PostgreSQL database, and deploy on AWS with
                        auto-scaling."
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">
                        Visual Workflow Builder
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Design your system architecture using our intuitive
                        flowchart interface. Connect components, define
                        relationships, and generate code visually.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            1
                          </div>
                          <p className="text-sm">Drag and drop components</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            2
                          </div>
                          <p className="text-sm">
                            Define relationships and data flow
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            3
                          </div>
                          <p className="text-sm">
                            Generate integrated code base
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-6 text-center">
                      <div className="text-sm text-muted-foreground mb-4">
                        Interactive Workflow Canvas
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-16 w-full rounded bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xs">
                          Frontend
                        </div>
                        <div className="h-16 w-full rounded bg-green-100 border-2 border-green-300 flex items-center justify-center text-xs">
                          API
                        </div>
                        <div className="h-16 w-full rounded bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-xs">
                          Database
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        Connect components to generate code
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Project Management */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Project & Team Management
          </h2>
          <p className="text-muted-foreground mb-12">
            Organize your work and collaborate with your team
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="text-left">
              <CardHeader>
                <div className="rounded-lg bg-gradient-to-r from-primary to-blue-500 p-3 mr-4 mb-4 w-fit h-fit">
                  <Workflow className="h-6 w-6 text-white" />
                </div>

                <CardTitle>Projects & Workflows</CardTitle>
                <CardDescription>
                  Create projects and organize multiple workflows within each
                  project. Keep related components and systems grouped together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <div className="rounded-lg bg-gradient-to-r from-primary to-blue-500 p-3 mr-4 mb-4 w-fit h-fit">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Invite team members, assign roles and permissions. Create
                  teams with specific access levels and responsibilities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
