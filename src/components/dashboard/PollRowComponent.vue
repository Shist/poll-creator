<template>
  <div class="poll-row">
    <BaseSelect
      :selectedValue="currRow.selectValFirst"
      :multiple="false"
      :clearable="false"
      :label="'Если'"
      :options="currRow.selectOptionsFirst"
      @change="changeSelectedValFirst"
    />
    <BaseSelect
      :selectedValue="currRow.selectValsSecond"
      :multiple="true"
      :clearable="false"
      :label="'Ответ'"
      :options="currRow.selectOptionsSecond"
      @change="changeSelectedValsSecond"
    />
    <BaseSelect
      :selectedValue="currRow.selectValThird"
      :multiple="false"
      :clearable="false"
      :label="'То перейти на'"
      :options="currRow.selectOptionsThird"
      @change="changeSelectedValThird"
    />
    <button
      class="poll-row__cross-btn"
      @click="$emit('removePollRow', currRow)"
    >
      <CrossIcon class="poll-row__cross-btn-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { IPollRowStructure, IQuestion } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{
  rowId: string;
  userQuestions: IQuestion[];
  pollRows: IPollRowStructure[];
}>();

const emit = defineEmits<{
  updateUserQuestions: [value: IQuestion[]];
  updatePollRows: [value: IPollRowStructure[]];
  removePollRow: [value: IPollRowStructure];
}>();

const currRow = computed<IPollRowStructure>(() => {
  return props.pollRows.find(
    (row: IPollRowStructure) => row.rowId === props.rowId
  );
});

const store = useStore();

const changeSelectedValFirst = (newValue: string) => {
  const updatedUserQuestions = [...props.userQuestions];

  const oldQuestionIndex: number = store.getters[
    "pollData/questionIndexByName"
  ](currRow.value.selectValFirst);

  if (oldQuestionIndex === -1) {
    return;
  }

  const currQuestionIndex: number =
    store.getters["pollData/questionIndexByName"](newValue);

  if (currQuestionIndex === -1) {
    return;
  }

  updatedUserQuestions[oldQuestionIndex].choices.forEach((choice) => {
    if (currRow.value.selectValsSecond.includes(choice.value)) {
      delete choice.next_question;
    }
  });

  emit("updateUserQuestions", updatedUserQuestions);

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex: number = store.getters["pollData/pollRowIndexByName"](
    currRow.value.rowId
  );

  if (currPollRowIndex === -1) {
    return;
  }

  updatedPollRows[currPollRowIndex].selectValFirst = newValue;

  updatedPollRows[currPollRowIndex].rowId = `${
    updatedUserQuestions[currQuestionIndex].id
  }|${uuidv4()}`;

  const currQuestionFreeChoices = store.getters[
    "pollData/questionFreeChoicesById"
  ](updatedUserQuestions[currQuestionIndex].id);

  updatedPollRows[currPollRowIndex].selectValsSecond = [];

  updatedPollRows[currPollRowIndex].selectOptionsSecond =
    currQuestionFreeChoices;

  emit("updatePollRows", updatedPollRows);
};

const changeSelectedValsSecond = (newValue: string[]) => {
  const updatedUserQuestions = [...props.userQuestions];

  const currQuestionIndex: number = store.getters[
    "pollData/questionIndexByName"
  ](currRow.value.selectValFirst);

  if (currQuestionIndex === -1) {
    return;
  }

  const nextQuestionId =
    currRow.value.selectValThird !== "Завершено"
      ? updatedUserQuestions.find(
          (question) => question.name === currRow.value.selectValThird
        )?.id
      : "Завершено";

  updatedUserQuestions[currQuestionIndex].choices.forEach((choice) => {
    if (currRow.value.selectValsSecond.includes(choice.value)) {
      delete choice.next_question;
    }

    newValue.forEach((newChoice) => {
      if (choice.value === newChoice) {
        choice.next_question =
          nextQuestionId !== "Завершено" ? nextQuestionId : null;
      }
    });
  });

  emit("updateUserQuestions", updatedUserQuestions);

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex: number = store.getters["pollData/pollRowIndexByName"](
    currRow.value.rowId
  );

  if (currPollRowIndex === -1) {
    return;
  }

  updatedPollRows[currPollRowIndex].selectValsSecond = newValue;

  const questionsWithFreeChoices: string[] =
    store.getters["pollData/questionsWithFreeChoices"];

  const currQuestionFreeChoices = store.getters[
    "pollData/questionFreeChoicesById"
  ](updatedUserQuestions[currQuestionIndex].id);

  updatedPollRows.forEach((pollRow) => {
    pollRow.selectOptionsFirst = questionsWithFreeChoices;
  });

  updatedPollRows.forEach((pollRow) => {
    if (
      pollRow.rowId.split("|")[0] ===
      updatedUserQuestions[currQuestionIndex].id.toString()
    ) {
      pollRow.selectOptionsSecond = currQuestionFreeChoices;
    }
  });

  emit("updatePollRows", updatedPollRows);
};

const changeSelectedValThird = (newValue: string) => {
  const updatedUserQuestions = [...props.userQuestions];

  const currQuestionIndex: number = store.getters[
    "pollData/questionIndexByName"
  ](currRow.value.selectValFirst);

  if (currQuestionIndex === -1) {
    return;
  }

  const nextQuestionId = updatedUserQuestions.find(
    (question) => question.name === newValue
  )?.id;

  updatedUserQuestions[currQuestionIndex].choices.forEach((choice) => {
    if (currRow.value.selectValsSecond.includes(choice.value)) {
      choice.next_question = nextQuestionId;
    }
  });

  emit("updateUserQuestions", updatedUserQuestions);

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex: number = store.getters["pollData/pollRowIndexByName"](
    currRow.value.rowId
  );

  if (currPollRowIndex === -1) {
    return;
  }

  updatedPollRows[currPollRowIndex].selectValThird = newValue;

  emit("updatePollRows", updatedPollRows);
};
</script>

<style lang="scss">
.poll-row {
  display: flex;
  &__cross-btn {
    margin-top: 35px;
    margin-left: 15px;
    height: 30px;
    width: 30px;
    min-width: 30px;
    border: none;
    .poll-row__cross-btn-icon {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
