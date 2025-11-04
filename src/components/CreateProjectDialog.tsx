import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Workflow, Database, MessageSquare, Bot, FileCode, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (project: any) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [creationMethod, setCreationMethod] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && projectType) {
      onCreateProject?.({
        id: Date.now().toString(),
        name: projectName,
        description,
        type: projectType,
        createdAt: new Date().toISOString(),
        status: "active",
        creationMethod,
        prompt
      });
      setProjectName("");
      setDescription("");
      setProjectType("");
      setPrompt("");
      onOpenChange(false);
    }
  };

  const handleNavigateToEditor = (editorType: string) => {
    onOpenChange(false);
    if (editorType === 'workflow') {
      navigate('/workflow-editor');
    } else if (editorType === 'database') {
      navigate('/database-editor');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Choose how you want to create your new AI code generation project.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={creationMethod} onValueChange={setCreationMethod} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Prompt
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflow Designer
            </TabsTrigger>
            <TabsTrigger value="diagram" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Diagram
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI-Powered Project Generation
                </CardTitle>
                <CardDescription>
                  Describe your project requirements and let AI generate the complete solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Project Requirements</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to build. E.g., 'Create a task management app with user authentication, project boards, and team collaboration features. Include a React frontend, Node.js backend, and PostgreSQL database.'"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`cursor-pointer transition-all ${projectType === 'fullstack' ? 'ring-2 ring-primary' : 'hover:bg-accent'}`} onClick={() => setProjectType('fullstack')}>
                    <CardHeader className="text-center">
                      <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <CardTitle className="text-sm">Full Stack App</CardTitle>
                      <CardDescription className="text-xs">Complete application with frontend and backend</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${projectType === 'api' ? 'ring-2 ring-primary' : 'hover:bg-accent'}`} onClick={() => setProjectType('api')}>
                    <CardHeader className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <CardTitle className="text-sm">API Service</CardTitle>
                      <CardDescription className="text-xs">Backend API with database integration</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${projectType === 'microservice' ? 'ring-2 ring-primary' : 'hover:bg-accent'}`} onClick={() => setProjectType('microservice')}>
                    <CardHeader className="text-center">
                      <Workflow className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <CardTitle className="text-sm">Microservice</CardTitle>
                      <CardDescription className="text-xs">Scalable microservice architecture</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Visual Workflow Designer
                </CardTitle>
                <CardDescription>
                  Design your project architecture using a visual workflow editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Workflow Components</h4>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 border rounded-lg">
                        <FileCode className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Frontend Components</span>
                      </div>
                      <div className="flex items-center p-2 border rounded-lg">
                        <Database className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">API Endpoints</span>
                      </div>
                      <div className="flex items-center p-2 border rounded-lg">
                        <Zap className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Business Logic</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Preview</h4>
                    <div className="border-2 border-dashed border-muted rounded-lg h-32 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Workflow preview will appear here</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigateToEditor('workflow')}
                  className="w-full"
                >
                  Open Workflow Editor
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Diagram Designer
                </CardTitle>
                <CardDescription>
                  Design your database schema visually and generate migration scripts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Schema Components</h4>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 border rounded-lg">
                        <Database className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Tables & Relationships</span>
                      </div>
                      <div className="flex items-center p-2 border rounded-lg">
                        <FileCode className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Liquibase Migrations</span>
                      </div>
                      <div className="flex items-center p-2 border rounded-lg">
                        <Zap className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">Index Optimization</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Schema Preview</h4>
                    <div className="border-2 border-dashed border-muted rounded-lg h-32 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Database diagram will appear here</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigateToEditor('database')}
                  className="w-full"
                >
                  Open Database Designer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="projectType">Framework/Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React.js</SelectItem>
                  <SelectItem value="java">Java Spring</SelectItem>
                  <SelectItem value="python">Python FastAPI</SelectItem>
                  <SelectItem value="terraform">Terraform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional project details"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!projectName || (!prompt && creationMethod === 'prompt')}>
              Create Project
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};