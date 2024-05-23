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
        :selectOptionsFirst="pollRow.selectOptionsFirst"
        :selectOptionsSecond="pollRow.selectOptionsSecond"
        :selectOptionsThird="pollRow.selectOptionsThird"
      />
      <button @click="addPollRow" class="poll-wrapper__add-poll-row-btn">
        + Добавить условие
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import PollRowComponent from "@/components/dashboard/PollRowComponent.vue";
import type { PollRowComponentProps } from "@/types/props";
import { IQuestion } from "@/types/data/questions";

const props = defineProps<{ questions: IQuestion[] }>();

const emit = defineEmits<{ changed: [value: IQuestion[]] }>();

const addPollRow = () => {
  // do something
};

const pollRowsArr = computed(() => {
  const result: PollRowComponentProps[] = [];
  props.questions.forEach((questionObj) => {
    const questionChains = {} as { [key: number]: string[] };
    questionObj.choices.forEach((choice) => {
      questionChains[choice.next_question]
        ? questionChains[choice.next_question].push(choice.value)
        : (questionChains[choice.next_question] = [choice.value]);
    });
    Object.entries(questionChains).forEach(([nextQuestionId, valuesArr]) => {
      const nextQuestion = props.questions.find(
        (question) => question.id === Number(nextQuestionId)
      );
      const nextPollRow: PollRowComponentProps = {
        selectOptionsFirst: [questionObj.name],
        selectOptionsSecond: valuesArr,
        selectOptionsThird: [nextQuestion ? nextQuestion.name : "Завершено"],
      };
      result.push(nextPollRow);
    });
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
