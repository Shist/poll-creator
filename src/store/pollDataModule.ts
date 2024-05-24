import { defineModule } from "direct-vuex";
import {
  IQuestion,
  IPollRowStructure,
  IPollRowInfo,
} from "@/types/data/questions";

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
          userQuestion.choices.map((choice) => choice.id)
        );

        const serverQuestion = state.serverQuestions.find(
          (uq) => uq.id === userQuestion.id
        );

        if (serverQuestion) {
          serverQuestion.choices.forEach((serverChoice) => {
            if (!userChoicesSet.has(serverChoice.id)) {
              freeChoices[serverChoice.id].push(serverChoice.id);
            }
          });
          continue;
        }
      }

      return freeChoices;
    },
    areAllChoicesPresent(state, getters): boolean {
      return Object.values(getters.getFreeQuestionsChoices).every(
        (choicesIdsArr: number[]) => !choicesIdsArr.length
      );
    },
    getPollRowsStructure: (state) => (type: "init" | "current") => {
      const result: IPollRowStructure[] = [];

      if (type === "init") {
        const qArr = state.serverQuestions;

        const nextQuestionsList = qArr.map((q) => q.name);
        nextQuestionsList.push("Завершено");

        qArr.forEach((q, qIndex) => {
          const mapNextQuestionsChoices: IPollRowInfo = {};

          q.choices.forEach((qChoice, qChoiceIndex) => {
            const nextQuestionIdStr = String(qChoice.next_question);

            if (mapNextQuestionsChoices[nextQuestionIdStr]) {
              mapNextQuestionsChoices[nextQuestionIdStr].choicesArr.push(
                qChoice.value
              );
            } else {
              mapNextQuestionsChoices[nextQuestionIdStr] = {
                rowId: `${qIndex}-${qChoiceIndex}`,
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
                    : qArr.find((q) => q.id === Number(nextQuestionIdStr))
                        ?.name,
                selectOptionsThird: nextQuestionsList,
              };

              result.push(nextPollRow);
            }
          );
        });

        return result;
      } else {
        // todo
        return result;
      }
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
