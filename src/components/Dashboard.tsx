import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Folder, GitBranch, Clock, Search, Filter } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);

  const projects = [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React frontend and Java backend",
      workflows: 5,
      lastModified: "2 hours ago",
      status: "active" as const,
      technologies: ["React", "Java", "PostgreSQL", "AWS"],
      type: "flow-chart",
    },
    {
      id: "2",
      name: "Microservices API",
      description:
        "Python-based microservices architecture with Docker deployment",
      workflows: 3,
      lastModified: "1 day ago",
      status: "completed" as const,
      technologies: ["Python", "FastAPI", "Docker", "Kubernetes"],
      type: "db-diagram",
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      description: "Real-time analytics dashboard with data visualization",
      workflows: 2,
      lastModified: "3 days ago",
      status: "draft" as const,
      technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
      type: "flow-chart",
    },
  ];

  const stats = [
    { label: "Total Projects", value: "12", icon: Folder },
    { label: "Active Workflows", value: "8", icon: GitBranch },
    { label: "Code Generated", value: "2.4K", icon: Plus },
    { label: "Hours Saved", value: "156", icon: Clock },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI code generation projects
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateProject(true)}
          className="lg:w-auto w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Projects
          </h2>
          <Badge variant="secondary">{projects.length} projects</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </div>
  );
};
