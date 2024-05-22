import cytoscape from "cytoscape";

import { convertQuestionsToNodes } from "@/utils/convertQuestionsToNodes";

import type { ICytoscapeHtmlTemplate } from "@/types/data/graph";
import type { IQuestion } from "@/types/data/questions";

interface IGraphModule {
  initCytoscapeGraph: (el: IQuestion[]) => void;
}

export const useGraph: () => IGraphModule = () => {
  let cytoscapGraph = null;

  /**
   * Инициализация библиотеки Cytoscape.js для отрисовки схемы
   */
  const initCytoscapeGraph = (el: IQuestion[]) => {
    const { nodes, edges } = convertQuestionsToNodes(el);

    cytoscapGraph = cytoscape({
      container: document.getElementById("cytoscape-graph"),
      boxSelectionEnabled: false,
      style: [
        {
          selector: "node",
          style: {
            width: "450px",
            height: "40px",
            shape: "rectangle",
            "background-color": "#F8F8F8",
            "border-width": 1,
            "border-color": "#D8D8D8",
          },
        },
        {
          selector: "node.parent",
          style: {
            width: "100%",
            "z-compound-depth": "top",
            "background-opacity": 0,
            shape: "round-rectangle",
            "border-width": 0,
            "padding-bottom": "0",
            "padding-left": "0",
            "padding-right": "0",
            "padding-top": "0",
          },
        },
        {
          selector: ".question",
          style: {
            "background-color": "#F5FFEE",
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "taxi",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#5faf2d",
            "line-color": "#A1A1A1",
          },
        },
      ],

      elements: {
        nodes,
        edges,
      },

      layout: {
        name: "preset",
      },
    });

    //@ts-ignore
    cytoscapGraph.nodeHtmlLabel([
      {
        query: "node",
        "text-align": "left",
        width: "100%",
        tpl(data: ICytoscapeHtmlTemplate) {
          return data.label
            ? `<span class='label ${data.classes}'>${
                data.classes ? '<div class="question-icon"></div>' : ""
              }${data.label}</span>`
            : "";
        },
      },
    ]);
  };

  return { initCytoscapeGraph };
};
