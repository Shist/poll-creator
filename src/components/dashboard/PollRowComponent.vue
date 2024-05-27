<template>
  <div class="poll-row">
    <BaseSelect
      :selectedValue="stateFirstVal"
      :multiple="false"
      :clearable="false"
      :label="'Если'"
      :options="stateFirstOptions"
      @change="changeSelectedValFirst"
    />
    <BaseSelect
      :selectedValue="stateSecondVals"
      :multiple="true"
      :clearable="false"
      :label="'Ответ'"
      :options="stateSecondOptions"
      @change="changeSelectedValsSecond"
    />
    <BaseSelect
      :selectedValue="stateThirdVal"
      :multiple="false"
      :clearable="false"
      :label="'То перейти на'"
      :options="stateThirdOptions"
      @change="changeSelectedValThird"
    />
    <button class="poll-row__cross-btn">
      <CrossIcon class="poll-row__cross-btn-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, ComputedRef, computed } from "vue";
import { useStore } from "vuex";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { IPollRowStructure, IQuestion } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";

const props = defineProps<IPollRowStructure>();

const stateFirstVal = ref(props.selectValFirst);
const stateFirstOptions = ref(props.selectOptionsFirst);
console.log(props.selectValsSecond);
const stateSecondVals = ref(props.selectValsSecond);
const stateSecondOptions = ref(props.selectOptionsSecond);
const stateThirdVal = ref(props.selectValThird);
const stateThirdOptions = ref(props.selectOptionsThird);

const store = useStore();
const userQuestions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.userQuestions
);
const pollRows: ComputedRef<IPollRowStructure[]> = computed(
  () => store.state.pollData.pollRows
);

const changeSelectedValFirst = (oldValue: string, newValue: string) => {
  const newUserQuestions = [...userQuestions.value];
  const oldQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === oldValue) {
      return question;
    }
  });
  const currQuestion = newUserQuestions.find((question) => {
    if (question.name === newValue) {
      return question;
    }
  });

  if (oldQuestionIndex !== -1) {
    newUserQuestions[oldQuestionIndex].choices.forEach((choice) => {
      delete choice.next_question;
    });
  }

  store.commit("pollData/setUserQuestions", newUserQuestions);

  const newPollRows = [...pollRows.value];
  const currPollRowIndex = newPollRows.findIndex((pollRow) => {
    if (pollRow.rowId === props.rowId) {
      return pollRow;
    }
  });

  newPollRows[currPollRowIndex].selectValFirst = newValue;

  const allFreeChoices = store.getters["pollData/getFreeQuestionsChoices"];
  const currQuestionFreeChoices = allFreeChoices[currQuestion.id];
  const freeChoicesValues = currQuestionFreeChoices.map((choiceId: number) => {
    return currQuestion.choices.find((choice) => choice.id === choiceId)?.value;
  });

  newPollRows.forEach((pollRow) => {
    if (pollRow.rowId.split("-")[0] === currQuestion.id.toString()) {
      pollRow.selectOptionsFirst = freeChoicesValues;
    }
  });

  store.commit("pollData/setPollRows", newPollRows);

  changeSelectedValsSecond(stateSecondVals.value, []);
  changeSelectedValThird(stateThirdVal.value, "");
};

const changeSelectedValsSecond = (oldValue: string[], newValue: string[]) => {
  const newUserQuestions = [...userQuestions.value];
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === stateFirstVal.value) {
      return question;
    }
  });

  if (currQuestionIndex === -1) {
    return;
  }

  const nextQuestionId =
    stateThirdVal.value !== "Завершено"
      ? newUserQuestions.find(
          (question) => question.name === stateThirdVal.value
        )?.id
      : "Завершено";

  newUserQuestions[currQuestionIndex].choices.forEach((choice) => {
    oldValue.forEach((oldChoice) => {
      if (choice.value === oldChoice) {
        delete choice.next_question;
      }
    });

    if (nextQuestionId) {
      newValue.forEach((newChoice) => {
        if (choice.value === newChoice) {
          choice.next_question =
            nextQuestionId !== "Завершено" ? nextQuestionId : null;
        }
      });
    }
  });

  store.commit("pollData/setUserQuestions", newUserQuestions);

  const newPollRows = [...pollRows.value];
  const currPollRowIndex = newPollRows.findIndex((pollRow) => {
    if (pollRow.rowId === props.rowId) {
      return pollRow;
    }
  });

  newPollRows[currPollRowIndex].selectValsSecond = newValue;

  const allFreeChoices = store.getters["pollData/getFreeQuestionsChoices"];
  const currQuestionFreeChoices =
    allFreeChoices[newUserQuestions[currQuestionIndex].id];
  const freeChoicesValues = currQuestionFreeChoices.map((choiceId: number) => {
    return newUserQuestions[currQuestionIndex].choices.find(
      (choice) => choice.id === choiceId
    )?.value;
  });

  newPollRows.forEach((pollRow) => {
    if (
      pollRow.rowId.split("-")[0] ===
      newUserQuestions[currQuestionIndex].id.toString()
    ) {
      pollRow.selectOptionsSecond = freeChoicesValues;
    }
  });

  store.commit("pollData/setPollRows", newPollRows);
};

const changeSelectedValThird = (oldValue: string, newValue: string) => {
  const newUserQuestions = [...userQuestions.value];
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === stateFirstVal.value) {
      return question;
    }
  });

  if (currQuestionIndex === -1) {
    return;
  }

  const nextQuestionId = newUserQuestions.find(
    (question) => question.name === newValue
  )?.id;

  newUserQuestions[currQuestionIndex].choices.forEach((choice) => {
    if (nextQuestionId) {
      choice.next_question = nextQuestionId;
    }
  });

  store.commit("pollData/setUserQuestions", newUserQuestions);

  const newPollRows = [...pollRows.value];
  const currPollRowIndex = newPollRows.findIndex((pollRow) => {
    if (pollRow.rowId === props.rowId) {
      return pollRow;
    }
  });

  newPollRows[currPollRowIndex].selectValThird = newValue;

  store.commit("pollData/setPollRows", newPollRows);
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
