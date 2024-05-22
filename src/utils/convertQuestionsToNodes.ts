import type { IEdge, INode } from "@/types/data/graph";
import type { IQuestion } from "@/types/data/questions";

/**
 * Этот метод конвертирует параметры пришедшие с формы в параметры валидные для библиотеки cytoscape.
 */
export const convertQuestionsToNodes = (
  questions: IQuestion[]
): {
  nodes: INode[];
  edges: IEdge[];
} => {
  const nodes: INode[] = [];
  const edges: IEdge[] = [];
  let yOffset = 0; // Смещение по X при отрисовки нового вопроса
  let xOffset = 0; // Смещение по Y при отрисовки нового вопроса

  questions.forEach((question) => {
    const parentId = `parent-${question.id}`;
    const questionXPosition = xOffset;
    const questionYPosition = yOffset;

    nodes.push({
      data: { id: parentId },
      classes: "parent",
    });

    /**
     * Создаём ноду вопроса и наполняем параметрами.
     */
    const questionNodeId = `question-${question.id}`;
    nodes.push({
      data: {
        id: questionNodeId,
        label: question.name,
        parent: parentId,
        classes: "question",
      },
      position: { x: questionXPosition, y: questionYPosition },
      classes: "question",
    });

    /**
     * Проходим по ответам вопроса и создаём ноды ответов.
     */
    question.choices.forEach((choice, index) => {
      const answerNodeId = `answer-${question.id}-${index}`;
      nodes.push({
        data: {
          id: answerNodeId,
          label: `${index + 1}. ${choice.value}`,
          parent: parentId,
        },
        position: {
          x: questionXPosition,
          y: questionYPosition + (index + 1) * 40,
        },
        classes: "answer",
      });

      const nextQuestionId = choice.next_question;
      if (
        !questions.find((q) => q.id === nextQuestionId) &&
        nextQuestionId !== null
      ) {
        return;
      }

      /**
       * Создаём связи(стрелочки) нод.
       */
      if (nextQuestionId !== null) {
        edges.push({
          data: {
            id: `edge-${question.id}-${index}`,
            source: answerNodeId,
            target: `parent-${nextQuestionId}`,
          },
        });
      }
    });

    yOffset += 100;
    xOffset += 600;
  });

  return { nodes, edges };
};
