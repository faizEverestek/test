import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, MoreHorizontal, Play, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  workflows: number;
  lastModified: string;
  status: "active" | "completed" | "draft";
  technologies: string[];
  type: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover-lift cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <GitBranch className="h-4 w-4" />
              <span>{project.workflows} workflows</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{project.lastModified}</span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3} more
            </Badge>
          )}
        </div>

        <div className="pt-2">
          <Link
            to={
              project?.type === "flow-chart"
                ? "/workflow-editor"
                : "/database-editor"
            }
          >
            <Button variant="outline" size="sm" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Open Project
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
