import { defineModule } from "direct-vuex";
import { IQuestion, ILeftQuestionsValuesIds } from "@/types/data/questions";

export interface IThemeState {
  questions: IQuestion[];
  leftQuestionsValuesIds: ILeftQuestionsValuesIds;
}

const pollDataModule = defineModule({
  state: (): IThemeState => ({
    questions: [],
    leftQuestionsValuesIds: {},
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
  },
  actions: {},
  namespaced: true,
});

export default pollDataModule;
