<template>
  <div class="poll-wrapper">
    <h2 class="poll-wrapper__headline">Создание логики</h2>
    <p class="poll-wrapper__text">
      Пожалуйста, для успешной настройки логики заполните сценарии для всех
      вопросов и всех вариантов ответов.
    </p>
    <div class="poll-wrapper__poll-rows-wrapper">
      <PollRowComponent
        v-for="pollRow in pollRowsArr"
        :key="pollRow.rowId"
        :questions="questions"
        :currQuestionId="pollRow.currQuestionId"
        :selectOptionsFirst="pollRow.selectOptionsFirst"
        :selectOptionsSecond="pollRow.selectOptionsSecond"
        :selectOptionsThird="pollRow.selectOptionsThird"
      />
      <button
        @click="addPollRow"
        class="poll-wrapper__add-poll-row-btn"
        v-show="Object.keys(leftQuestionsValuesIds).length > 0"
      >
        + Добавить условие
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, computed } from "vue";
import { useStore } from "vuex";
import PollRowComponent from "@/components/dashboard/PollRowComponent.vue";
import {
  IQuestion,
  IPollRow,
  ILeftQuestionsValuesIds,
  INextQuestionsValuesIds,
} from "@/types/data/questions";

const store = useStore();
const questions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.questions
);
const pollRows: ComputedRef<IPollRow[]> = computed(
  () => store.state.pollData.pollRows
);
const leftQuestionsValuesIds: ComputedRef<ILeftQuestionsValuesIds> = computed(
  () => store.state.pollData.leftQuestionsValuesIds
);

const addPollRow = () => {
  // do something
};

const pollRowsArr = computed(() => {
  const result = [];
  questions.value.forEach((questionObj, questionIndex) => {
    const questionChains = {} as INextQuestionsValuesIds;
    questionObj.choices.forEach((choice) => {
      questionChains[choice.next_question]
        ? questionChains[choice.next_question].push(choice.id)
        : (questionChains[choice.next_question] = [choice.id]);
    });
    Object.entries(questionChains).forEach(
      ([nextQuestionId, valuesIdsArr], chainIndex) => {
        const nextQuestion = questions.value.find(
          (question) => question.id === Number(nextQuestionId)
        );
        const nextPollRow = {
          rowId: `${questionIndex}-${chainIndex}`,
          currQuestionId: questionIndex,
          selectOptionsFirst: [questionObj.name],
          selectOptionsSecond: valuesIdsArr,
          selectOptionsThird: [nextQuestion ? nextQuestion.name : "Завершено"],
        };
        result.push(nextPollRow);
      }
    );
  });
  return result;
});
</script>

<style lang="scss">
@import "../../styles/colors.scss";

.poll-wrapper {
  padding-inline: 2.25rem;
  @media (max-width: 1280px) {
    padding: 1.5rem;
  }
  &__headline {
    margin-bottom: 20px;
  }
  &__text {
    margin-bottom: 15px;
  }
  &__poll-rows-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    .poll-wrapper__add-poll-row-btn {
      padding: 5px;
      align-self: flex-start;
      border: none;
      background-color: $white;
      color: $text;
    }
  }
}
</style>
