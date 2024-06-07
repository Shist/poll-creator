import { defineModule } from "direct-vuex";
import {
  IQuestion,
  IPollRowStructure,
  IPollRowInfo,
} from "@/types/data/questions";
import { IFreeChoices } from "@/types/data/questions";
import { v4 as uuidv4 } from "uuid";

export interface IThemeState {
  serverQuestions: IQuestion[];
  userQuestions: IQuestion[];
  pollRows: IPollRowStructure[];
}

const pollDataModule = defineModule({
  state: (): IThemeState => ({
    serverQuestions: [],
    userQuestions: [],
    pollRows: [],
  }),

  getters: {
    // returns an object, keys - questions IDs, values - arrays of IDs of free choices
    freeQuestionsChoices(state): IFreeChoices {
      const freeChoices: IFreeChoices = {};

      for (const serverQuestion of state.serverQuestions) {
        freeChoices[serverQuestion.id] = [];
      }

      for (const userQuestion of state.userQuestions) {
        const userChoicesSet = new Set(
          userQuestion.choices
            .filter((choice) => "next_question" in choice)
            .map((choice) => choice.id)
        );

        const serverQuestion = state.serverQuestions.find(
          (serverQuestion) => serverQuestion.id === userQuestion.id
        );

        if (!serverQuestion) {
          return;
        }

        serverQuestion.choices.forEach((serverChoice) => {
          if (!userChoicesSet.has(serverChoice.id)) {
            freeChoices[serverQuestion.id].push(serverChoice.id);
          }
        });
      }

      return freeChoices;
    },
    // Returns true if all choices of all questions are used, otherwise - false
    areAllChoicesPresent(state, getters): boolean {
      return Object.values(getters.freeQuestionsChoices).every(
        (choicesIdsArr: number[]) => !choicesIdsArr.length
      );
    },
    // Returns init structure of poll rows based on the data from server
    initPollRowsStructure(state): IPollRowStructure[] {
      const result: IPollRowStructure[] = [];

      const serverQuestions = state.serverQuestions;

      const nextQuestionsList = serverQuestions.map(
        (question) => question.name
      );
      nextQuestionsList.push("Завершено");

      serverQuestions.forEach((question) => {
        const mapNextQuestionsChoices: IPollRowInfo = {};

        question.choices.forEach((qChoice) => {
          const nextQuestionIdStr = String(qChoice.next_question);

          if (mapNextQuestionsChoices[nextQuestionIdStr]) {
            mapNextQuestionsChoices[nextQuestionIdStr].choicesArr.push(
              qChoice.value
            );
          } else {
            mapNextQuestionsChoices[nextQuestionIdStr] = {
              rowId: `${question.id}|${uuidv4()}`,
              qName: question.name,
              choicesArr: [qChoice.value],
            };
          }
        });

        Object.entries(mapNextQuestionsChoices).forEach(
          ([nextQuestionIdStr, rowInfoObj]) => {
            const nextPollRow: IPollRowStructure = {
              rowId: rowInfoObj.rowId,
              selectValFirst: rowInfoObj.qName,
              selectOptionsFirst: [],
              selectValsSecond: rowInfoObj.choicesArr,
              selectOptionsSecond: [],
              selectValThird:
                nextQuestionIdStr === "null"
                  ? "Завершено"
                  : serverQuestions.find(
                      (question) => question.id === Number(nextQuestionIdStr)
                    )?.name,
              selectOptionsThird: nextQuestionsList,
            };

            result.push(nextPollRow);
          }
        );
      });

      return result;
    },
    // Returns the ID of the question from userQuestions by its name
    questionIndexByName:
      (state) =>
      (questionName: string): number => {
        return state.userQuestions.findIndex((question) => {
          if (question.name === questionName) {
            return question;
          }
        });
      },
    // Returns the ID of the poll row from pollRows by its rowId
    pollRowIndexByName:
      (state) =>
      (rowId: string): number => {
        return state.pollRows.findIndex((pollRow) => {
          if (pollRow.rowId === rowId) {
            return pollRow;
          }
        });
      },
    // Returns an array of IDs of questions that have some free choices to choose
    questionsIdsWithFreeChoices(state, getters): number[] {
      const allFreeChoices: IFreeChoices = getters.freeQuestionsChoices;

      return Object.entries(allFreeChoices)
        .filter(([questionId, freeChoicesIds]) => {
          return freeChoicesIds.length;
        })
        .map(([questionId, freeChoicesIds]) => {
          return Number(questionId);
        });
    },
    // Returns an array of the names of questions that have some free choices to choose
    questionsWithFreeChoices(state, getters): string[] {
      const questionsIdsWithFreeChoices: number[] =
        getters.questionsIdsWithFreeChoices;

      return questionsIdsWithFreeChoices.map((questionId) => {
        return state.userQuestions.find(
          (question) => question.id === questionId
        )?.name;
      });
    },
    // Returns an array of the values of free choices for the question with specified ID
    questionFreeChoicesById:
      (state, getters) =>
      (questionId: number): string[] => {
        const allFreeChoices: IFreeChoices = getters.freeQuestionsChoices;

        const currQuestion = state.userQuestions.find(
          (question) => question.id === questionId
        );

        return allFreeChoices[questionId].map((choiceId) => {
          const currChoice = currQuestion?.choices.find(
            (choice) => choice.id === choiceId
          );
          return currChoice?.value;
        });
      },
  },

  mutations: {
    setServerQuestions(state, serverQuestions: IQuestion[]) {
      state.serverQuestions = serverQuestions;
    },
    setUserQuestions(state, userQuestions: IQuestion[]) {
      state.userQuestions = userQuestions;
    },
    setPollRows(state, pollRows: IPollRowStructure[]) {
      state.pollRows = pollRows;
    },
  },

  actions: {},

  namespaced: true,
});

export default pollDataModule;
