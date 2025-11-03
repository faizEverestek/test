import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Database,
  Code,
  Cloud,
  Workflow,
  Plus,
  Save,
  Play,
  Download,
} from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start Project" },
    position: { x: 250, y: 25 },
    style: { backgroundColor: "hsl(var(--primary))", color: "white" },
  },
  {
    id: "2",
    data: { label: "Define Requirements" },
    position: { x: 100, y: 125 },
    style: { backgroundColor: "hsl(var(--surface))" },
  },
  {
    id: "3",
    data: { label: "Generate Frontend" },
    position: { x: 400, y: 125 },
    style: { backgroundColor: "hsl(var(--accent))" },
  },
  {
    id: "4",
    data: { label: "Generate Backend APIs" },
    position: { x: 100, y: 225 },
    style: { backgroundColor: "hsl(var(--secondary))" },
  },
  {
    id: "5",
    data: { label: "Setup Infrastructure" },
    position: { x: 400, y: 225 },
    style: { backgroundColor: "hsl(var(--muted))" },
  },
  {
    id: "6",
    type: "output",
    data: { label: "Deploy Application" },
    position: { x: 250, y: 325 },
    style: { backgroundColor: "hsl(var(--success))", color: "white" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-6", source: "5", target: "6" },
];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState("default");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = [
    {
      type: "frontend",
      label: "Frontend",
      icon: Code,
      color: "hsl(var(--primary))",
    },
    {
      type: "backend",
      label: "Backend API",
      icon: Database,
      color: "hsl(var(--secondary))",
    },
    {
      type: "infrastructure",
      label: "Infrastructure",
      icon: Cloud,
      color: "hsl(var(--accent))",
    },
    {
      type: "workflow",
      label: "Workflow Step",
      icon: Workflow,
      color: "hsl(var(--muted))",
    },
  ];

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `New ${type} Node` },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: {
        backgroundColor:
          nodeTypes.find((nt) => nt.type === type)?.color ||
          "hsl(var(--surface))",
        color:
          type === "frontend" || type === "backend"
            ? "white"
            : "hsl(var(--foreground))",
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="h-screen">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-border bg-surface/50 p-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Workflow Components
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {nodeTypes.map((nodeType) => (
                  <Button
                    key={nodeType.type}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => addNode(nodeType.type)}
                  >
                    <nodeType.icon className="h-4 w-4 mr-2" />
                    <span>{nodeType.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Workflow Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute Workflow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Code
                </Button>
              </div>
            </div>

            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Workflow Stats</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Nodes:</span>
                  <Badge variant="secondary">{nodes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Connections:</span>
                  <Badge variant="secondary">{edges.length}</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-background"
            >
              <Controls className="bg-surface border border-border" />
              <MiniMap
                className="bg-surface border border-border"
                nodeColor={(node) =>
                  node.style?.backgroundColor || "hsl(var(--primary))"
                }
              />
              <Background gap={20} size={1} className="opacity-30" />

              <Panel
                position="top-right"
                className="bg-surface border border-border rounded-lg p-2"
              >
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-black">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Node
                  </Button>
                  <Button size="sm" className="text-black">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkflowEditor;
