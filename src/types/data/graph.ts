export interface ICytoscapeHtmlTemplate {
  label: string;
  classes: string;
}

export interface INode {
  data: { id: string; label?: string; parent?: string; classes?: string };
  classes: string;
  position?: { x: number; y: number };
}

export interface IEdge {
  data: { id: string; source: string; target: string };
}
