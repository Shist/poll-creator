import { defineModule } from "direct-vuex";
import {
  IQuestion,
  IPollRow,
  ILeftQuestionsValuesIds,
} from "@/types/data/questions";

export interface IThemeState {
  questions: IQuestion[];
  pollRows: IPollRow[];
  leftQuestionsValuesIds: ILeftQuestionsValuesIds;
}

const pollDataModule = defineModule({
  state: (): IThemeState => ({
    questions: [],
    leftQuestionsValuesIds: {},
    pollRows: [],
  }),
  getters: {},
  mutations: {
    setQuestions(state, questions: IQuestion[]) {
      state.questions = questions;
    },
    setLeftQuestionsValuesIds(
      state,
      leftQuestionsValuesIds: ILeftQuestionsValuesIds
    ) {
      state.leftQuestionsValuesIds = leftQuestionsValuesIds;
    },
    setPollRows(state, pollRows: IPollRow[]) {
      state.pollRows = pollRows;
    },
  },
  actions: {},
  namespaced: true,
});

export default pollDataModule;
