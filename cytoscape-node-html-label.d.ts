declare module 'cytoscape-node-html-label' {
  import { Core } from 'cytoscape';

  interface NodeHtmlLabelExtension {
    (cytoscape: (options?: Core.CytoscapeOptions) => Core): void;
  }

  const nodeHtmlLabel: NodeHtmlLabelExtension;

  export = nodeHtmlLabel;
}