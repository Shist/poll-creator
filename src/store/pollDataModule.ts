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
    areAllChoicesPresent(state): boolean {
      for (const serverQuestion of state.serverQuestions) {
        const serverChoicesSet = new Set(
          serverQuestion.choices.map((choice) => choice.value)
        );

        const userQuestion = state.userQuestions.find(
          (uq) => uq.id === serverQuestion.id
        );

        if (
          userQuestion &&
          userQuestion.choices.every((userChoice) =>
            serverChoicesSet.has(userChoice.value)
          )
        ) {
          continue;
        } else {
          return false;
        }
      }

      return true;
    },
    getPollRowsStructure: (state) => (type: "init" | "current") => {
      const result: IPollRowStructure[] = [];

      if (type === "init") {
        const qArr = state.serverQuestions;

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
                selectOptionsFirst: [rowInfoObj.qName],
                selectValsSecond: rowInfoObj.choicesArr,
                selectOptionsSecond: q.choices.map((choice) => choice.value),
                selectValThird:
                  nextQuestionIdStr === "null"
                    ? "Завершено"
                    : qArr.find((q) => q.id === Number(nextQuestionIdStr))
                        ?.name,
                selectOptionsThird: [
                  nextQuestionIdStr === "null"
                    ? "Завершено"
                    : qArr.find((q) => q.id === Number(nextQuestionIdStr))
                        ?.name,
                ],
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
