import { defineModule } from "direct-vuex";
import {
  IQuestion,
  IPollRowStructure,
  IPollRowInfo,
} from "@/types/data/questions";
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
    getFreeQuestionsChoices(state): { [key: number]: number[] } {
      const freeChoices: { [key: number]: number[] } = {};

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

        if (serverQuestion) {
          serverQuestion.choices.forEach((serverChoice) => {
            if (!userChoicesSet.has(serverChoice.id)) {
              freeChoices[serverQuestion.id].push(serverChoice.id);
            }
          });
        }
      }

      return freeChoices;
    },
    areAllChoicesPresent(state, getters): boolean {
      return Object.values(getters.getFreeQuestionsChoices).every(
        (choicesIdsArr: number[]) => !choicesIdsArr.length
      );
    },
    initPollRowsStructure(state): IPollRowStructure[] {
      const result: IPollRowStructure[] = [];

      const qArr = state.serverQuestions;

      const nextQuestionsList = qArr.map((q) => q.name);
      nextQuestionsList.push("Завершено");

      qArr.forEach((q) => {
        const mapNextQuestionsChoices: IPollRowInfo = {};

        q.choices.forEach((qChoice) => {
          const nextQuestionIdStr = String(qChoice.next_question);

          if (mapNextQuestionsChoices[nextQuestionIdStr]) {
            mapNextQuestionsChoices[nextQuestionIdStr].choicesArr.push(
              qChoice.value
            );
          } else {
            mapNextQuestionsChoices[nextQuestionIdStr] = {
              rowId: `${q.id}|${uuidv4()}`,
              qName: q.name,
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
                  : qArr.find((q) => q.id === Number(nextQuestionIdStr))?.name,
              selectOptionsThird: nextQuestionsList,
            };

            result.push(nextPollRow);
          }
        );
      });

      return result;
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
