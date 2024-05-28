<template>
  <div class="poll-wrapper">
    <h2 class="poll-wrapper__headline">Создание логики</h2>
    <p class="poll-wrapper__text">
      Пожалуйста, для успешной настройки логики заполните сценарии для всех
      вопросов и всех вариантов ответов.
    </p>
    <div class="poll-wrapper__poll-rows-wrapper">
      <PollRowComponent
        v-for="pollRow in pollRows"
        :key="pollRow.rowId"
        :rowId="pollRow.rowId"
        :userQuestions="userQuestions"
        @updateUserQuestions="handleUserQuestionsUpdate"
        :pollRows="pollRows"
        @updatePollRows="handlePollRowsUpdate"
        @removePollRow="removePollRow"
      />
      <button
        @click="addPollRow"
        class="poll-wrapper__add-poll-row-btn"
        v-show="!store.getters['pollData/areAllChoicesPresent']"
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
  IPollRowStructure,
  IQuestion,
  IFreeChoices,
} from "@/types/data/questions";
import { v4 as uuidv4 } from "uuid";

const store = useStore();
const userQuestions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.userQuestions
);
const pollRows: ComputedRef<IPollRowStructure[]> = computed(
  () => store.state.pollData.pollRows
);

const handleUserQuestionsUpdate = (updatedUserQuestions: IQuestion[]) => {
  store.commit("pollData/setUserQuestions", updatedUserQuestions);
};

const handlePollRowsUpdate = (updatedPollRows: IPollRowStructure[]) => {
  store.commit("pollData/setPollRows", updatedPollRows);
};

const addPollRow = () => {
  const updatedPollRows = [...pollRows.value];

  const allFreeChoices: IFreeChoices =
    store.getters["pollData/freeQuestionsChoices"];
  const questionsIdsWithFreeChoices = Object.entries(allFreeChoices)
    .filter(([questionId, freeChoicesIds]) => {
      return freeChoicesIds.length;
    })
    .map(([questionId, freeChoicesIds]) => {
      return Number(questionId);
    });
  const questionsWithFreeChoices = questionsIdsWithFreeChoices.map(
    (questionId) => {
      return userQuestions.value.find((question) => question.id === questionId)
        ?.name;
    }
  );
  const currQuestion = userQuestions.value.find(
    (question) => question.id === questionsIdsWithFreeChoices[0]
  );
  const questionChoices = allFreeChoices[questionsIdsWithFreeChoices[0]].map(
    (choiceId) => {
      const currChoice = currQuestion?.choices.find(
        (choice) => choice.id === choiceId
      );
      return currChoice?.value;
    }
  );
  const nextQuestionsList = userQuestions.value.map(
    (question) => question.name
  );
  nextQuestionsList.push("Завершено");

  const newPollRow: IPollRowStructure = {
    rowId: `${questionsIdsWithFreeChoices[0]}|${uuidv4()}`,
    selectValFirst: questionsWithFreeChoices[0],
    selectOptionsFirst: questionsWithFreeChoices,
    selectValsSecond: [],
    selectOptionsSecond: questionChoices,
    selectValThird: "Завершено",
    selectOptionsThird: nextQuestionsList,
  };

  updatedPollRows.push(newPollRow);
  store.commit("pollData/setPollRows", updatedPollRows);
};

const removePollRow = (currRow: IPollRowStructure) => {
  const newUserQuestions = [...userQuestions.value];
  const questionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === currRow.selectValFirst) {
      return question;
    }
  });

  if (questionIndex === -1) {
    return;
  }

  newUserQuestions[questionIndex].choices.forEach((choice) => {
    if (currRow.selectValsSecond.includes(choice.value)) {
      delete choice.next_question;
    }
  });

  store.commit("pollData/setUserQuestions", newUserQuestions);

  const pollRowsCopy = [...pollRows.value];
  const updatedPollRows = pollRowsCopy.filter(
    (pollRow) => pollRow.rowId !== currRow.rowId
  );
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === currRow.selectValFirst) {
      return question;
    }
  });

  if (currQuestionIndex === -1) {
    return;
  }

  const allFreeChoices: IFreeChoices =
    store.getters["pollData/freeQuestionsChoices"];
  const questionsWithFreeChoices = Object.entries(allFreeChoices)
    .filter(([questionId, freeChoicesIds]) => {
      return freeChoicesIds.length > 0;
    })
    .map(([questionId, freeChoicesIds]) => {
      return newUserQuestions.find(
        (question) => question.id === Number(questionId)
      )?.name;
    });
  const currQuestionFreeChoicesIds =
    allFreeChoices[userQuestions.value[currQuestionIndex].id];
  const currQuestionFreeChoices = currQuestionFreeChoicesIds.map(
    (choiceId: number) => {
      return newUserQuestions[currQuestionIndex].choices.find(
        (choice) => choice.id === choiceId
      )?.value;
    }
  );

  updatedPollRows.forEach((pollRow) => {
    pollRow.selectOptionsFirst = questionsWithFreeChoices;
  });

  updatedPollRows.forEach((pollRow) => {
    if (
      pollRow.rowId.split("|")[0] ===
      newUserQuestions[currQuestionIndex].id.toString()
    ) {
      pollRow.selectOptionsSecond = currQuestionFreeChoices;
    }
  });

  store.commit("pollData/setPollRows", updatedPollRows);
};
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
