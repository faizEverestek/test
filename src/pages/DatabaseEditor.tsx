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
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Database, Plus, Save, Download, Key, Link, Table } from "lucide-react";

// Custom Table Node Component
const TableNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-surface border-2 border-border rounded-lg shadow-lg min-w-[200px]">
      <div className="bg-primary text-primary-foreground px-3 py-2 rounded-t-lg font-semibold flex items-center">
        <Table className="h-4 w-4 mr-2" />
        {data.label}
      </div>
      <div className="p-3">
        {data.fields?.map((field: any, index: number) => (
          <div
            key={index}
            className="flex items-center py-1 text-sm border-b border-border last:border-b-0"
          >
            <div className="flex items-center flex-1">
              {field.isPrimaryKey && (
                <Key className="h-3 w-3 text-primary mr-1" />
              )}
              {field.isForeignKey && (
                <Link className="h-3 w-3 text-accent mr-1" />
              )}
              <span className="font-medium">{field.name}</span>
            </div>
            <Badge variant="outline" className="ml-2 text-xs">
              {field.type}
            </Badge>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "hsl(var(--primary))" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "hsl(var(--primary))" }}
      />
    </div>
  );
};

const nodeTypes = {
  table: TableNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "table",
    data: {
      label: "Users",
      fields: [
        { name: "id", type: "UUID", isPrimaryKey: true, isForeignKey: false },
        {
          name: "email",
          type: "VARCHAR",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "password",
          type: "VARCHAR",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "table",
    data: {
      label: "Projects",
      fields: [
        { name: "id", type: "UUID", isPrimaryKey: true, isForeignKey: false },
        {
          name: "user_id",
          type: "UUID",
          isPrimaryKey: false,
          isForeignKey: true,
        },
        {
          name: "name",
          type: "VARCHAR",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "description",
          type: "TEXT",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    position: { x: 400, y: 100 },
  },
  {
    id: "3",
    type: "table",
    data: {
      label: "Workflows",
      fields: [
        { name: "id", type: "UUID", isPrimaryKey: true, isForeignKey: false },
        {
          name: "project_id",
          type: "UUID",
          isPrimaryKey: false,
          isForeignKey: true,
        },
        {
          name: "name",
          type: "VARCHAR",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "definition",
          type: "JSONB",
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ],
    },
    position: { x: 700, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    label: "user_id",
    style: { stroke: "hsl(var(--primary))" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    label: "project_id",
    style: { stroke: "hsl(var(--primary))" },
  },
];

const DatabaseEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newTableName, setNewTableName] = useState("");

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "hsl(var(--primary))" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addTable = () => {
    if (!newTableName) return;

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: "table",
      data: {
        label: newTableName,
        fields: [
          { name: "id", type: "UUID", isPrimaryKey: true, isForeignKey: false },
        ],
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNewTableName("");
  };

  const dataTypes = [
    "UUID",
    "VARCHAR",
    "TEXT",
    "INTEGER",
    "BOOLEAN",
    "TIMESTAMP",
    "JSONB",
    "DECIMAL",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="h-screen">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-border bg-surface/50 p-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Database Designer</h2>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Add New Table
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Table name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTable()}
                  />
                  <Button onClick={addTable} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Data Types</h3>
              <div className="grid grid-cols-2 gap-1">
                {dataTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-xs justify-center"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Schema Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Schema
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Liquibase
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Generate SQL
                </Button>
              </div>
            </div>

            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Schema Stats</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tables:</span>
                  <Badge variant="secondary">{nodes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Relations:</span>
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
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
            >
              <Controls className="bg-surface border border-border" />
              <MiniMap
                className="bg-surface border border-border"
                nodeColor="hsl(var(--primary))"
              />
              <Background gap={20} size={1} className="opacity-30" />

              <Panel
                position="top-right"
                className="bg-surface border border-border rounded-lg p-2"
              >
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-black">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Table
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

export default DatabaseEditor;
