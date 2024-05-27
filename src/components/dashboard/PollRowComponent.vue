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
import { ComputedRef, computed } from "vue";
import { useStore } from "vuex";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { IPollRowStructure, IQuestion } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{ rowId: string; pollRows: IPollRowStructure[] }>();
const emit = defineEmits<{
  updatePollRows: [value: IPollRowStructure[]];
  removePollRow: [value: IPollRowStructure];
}>();

const currRow = computed<IPollRowStructure>(() => {
  return props.pollRows.find(
    (row: IPollRowStructure) => row.rowId === props.rowId
  );
});

const store = useStore();

const userQuestions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.userQuestions
);

const changeSelectedValFirst = (oldValue: string, newValue: string) => {
  const newUserQuestions = [...userQuestions.value];
  const oldQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === oldValue) {
      return question;
    }
  });
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === newValue) {
      return question;
    }
  });

  if (oldQuestionIndex !== -1) {
    newUserQuestions[oldQuestionIndex].choices.forEach((choice) => {
      if (currRow.value.selectValsSecond.includes(choice.value)) {
        delete choice.next_question;
      }
    });
  }

  store.commit("pollData/setUserQuestions", newUserQuestions);

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex = updatedPollRows.findIndex(
    (pollRow: IPollRowStructure) => pollRow.rowId === props.rowId
  );

  if (currPollRowIndex === -1) {
    return;
  }

  updatedPollRows[currPollRowIndex].selectValFirst = newValue;
  updatedPollRows[currPollRowIndex].rowId = `${
    newUserQuestions[currQuestionIndex].id
  }|${uuidv4()}`;

  const allFreeChoices: { [key: number]: number[] } =
    store.getters["pollData/getFreeQuestionsChoices"];
  const currQuestionFreeChoicesIds =
    allFreeChoices[newUserQuestions[currQuestionIndex].id];
  const currQuestionFreeChoices = currQuestionFreeChoicesIds.map(
    (choiceId: number) => {
      return newUserQuestions[currQuestionIndex].choices.find(
        (choice) => choice.id === choiceId
      )?.value;
    }
  );
  updatedPollRows[currPollRowIndex].selectOptionsSecond =
    currQuestionFreeChoices;

  emit("updatePollRows", updatedPollRows);
};

const changeSelectedValsSecond = (oldValue: string[], newValue: string[]) => {
  const newUserQuestions = [...userQuestions.value];
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === currRow.value.selectValFirst) {
      return question;
    }
  });

  if (currQuestionIndex === -1) {
    return;
  }

  const nextQuestionId =
    currRow.value.selectValThird !== "Завершено"
      ? newUserQuestions.find(
          (question) => question.name === currRow.value.selectValThird
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

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex = updatedPollRows.findIndex(
    (pollRow: IPollRowStructure) => pollRow.rowId === props.rowId
  );

  if (currPollRowIndex === -1) {
    return;
  }

  updatedPollRows[currPollRowIndex].selectValsSecond = newValue;

  const allFreeChoices: { [key: number]: number[] } =
    store.getters["pollData/getFreeQuestionsChoices"];
  const questionsWithFreeChoices = Object.entries(allFreeChoices)
    .filter(([questionId, freeChoicesIds]) => {
      return freeChoicesIds.length > 0;
    })
    .map(([questionId, freeChoicesIds]) => {
      return newUserQuestions.find(
        (question) => question.id === Number(questionId)
      ).name;
    });
  const currQuestionFreeChoicesIds =
    allFreeChoices[newUserQuestions[currQuestionIndex].id];
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

  emit("updatePollRows", updatedPollRows);
};

const changeSelectedValThird = (oldValue: string, newValue: string) => {
  const newUserQuestions = [...userQuestions.value];
  const currQuestionIndex = newUserQuestions.findIndex((question) => {
    if (question.name === currRow.value.selectValFirst) {
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

  const updatedPollRows = [...props.pollRows];

  const currPollRowIndex = updatedPollRows.findIndex(
    (pollRow: IPollRowStructure) => pollRow.rowId === props.rowId
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
