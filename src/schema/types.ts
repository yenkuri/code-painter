export type NodeKind =
  | "router"
  | "dns_blocker"
  | "switch"
  | "server"
  | "app"
  | "storage"
  | "device"
  | "reverse_proxy"
  | "network";

export type EdgeKind =
  | "LAN"
  | "WAN"
  | "DNS"
  | "reverse_proxy"
  | "SMB"
  | "API"
  | "docker_network"
  | "dependency";

export type Criticality = "low" | "medium" | "high" | "critical";

export type LayoutViewKind =
  | "physical"
  | "logical"
  | "external-access"
  | "service-dependency";

export interface ArchitectureDocument {
  schemaVersion: string;
  metadata: ArchitectureMetadata;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  layouts: ArchitectureLayout[];
}

export interface ArchitectureMetadata {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  notes?: string;
}

export interface ArchitectureNode {
  id: string;
  kind: NodeKind;
  hostname?: string;
  displayName: string;
  role?: string;
  ip?: string;
  services?: string[];
  tags?: string[];
  criticality?: Criticality;
  notes?: string;
}

export interface ArchitectureEdge {
  id: string;
  kind: EdgeKind;
  from: string;
  to: string;
  label?: string;
  tags?: string[];
  notes?: string;
}

export interface ArchitectureLayout {
  id: string;
  name: string;
  view: LayoutViewKind;
  items: LayoutItem[];
}

export interface LayoutItem {
  nodeId: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
}

