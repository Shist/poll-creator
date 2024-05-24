<template>
  <div class="poll-row">
    <BaseSelect
      :selectedValue="selectedValFirst"
      :multiple="false"
      :clearable="false"
      :label="'Если'"
      :options="selectOptionsFirst"
      @change="changeSelectedValFirst"
    />
    <BaseSelect
      :selectedValue="selectedValsSecond"
      :multiple="true"
      :clearable="false"
      :label="'Ответ'"
      :options="selectOptionsSecond"
      @change="changeSelectedValsSecond"
    />
    <BaseSelect
      :selectedValue="selectedValThird"
      :multiple="false"
      :clearable="false"
      :label="'То перейти на'"
      :options="selectOptionsThird"
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
import { IQuestion, IPollRow } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";

const props = defineProps<Omit<IPollRow, "rowId">>();

const store = useStore();
const questions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.questions
);

let theOnlyQuestion: IQuestion | null = null;
if (props.questionIds.length === 1) {
  theOnlyQuestion = questions.value.find(
    (question) => question.id === props.questionIds[0]
  );
}

const selectedQuestion = ref<IQuestion | null>(
  theOnlyQuestion ? theOnlyQuestion : null
);
const selectedValFirst = ref<string>(
  theOnlyQuestion ? theOnlyQuestion.name : ""
);
const changeSelectedValFirst = (newValue: string) => {
  selectedValFirst.value = newValue;

  const newQuestion = questions.value.find((question) => {
    if (question.name === newValue) {
      return question;
    }
  });
  selectedQuestion.value = newQuestion ? newQuestion : null;

  changeSelectedValsSecond([]);
  changeSelectedValThird("");
};
const selectOptionsFirst: ComputedRef<string[]> = computed(() => {
  const selectOptionsFirstList = [];
  props.questionIds.forEach((questionId) => {
    questions.value.forEach((question) => {
      if (question.id === questionId) {
        selectOptionsFirstList.push(question.name);
      }
    });
  });
  return selectOptionsFirstList;
});

const selectedValsSecondList = [];
if (theOnlyQuestion) {
  props.selectedValuesIds.forEach((valueId) => {
    theOnlyQuestion.choices.forEach((choice) => {
      if (choice.id === valueId) {
        selectedValsSecondList.push(choice.value);
      }
    });
  });
}
const selectedValsSecond = ref<string[]>(selectedValsSecondList);
const changeSelectedValsSecond = (newValue: string[]) => {
  selectedValsSecond.value = newValue;
};
const selectOptionsSecond: ComputedRef<string[]> = computed(() => {
  if (selectedQuestion.value) {
    return selectedQuestion.value.choices.map((choice) => choice.value);
  } else {
    return [];
  }
});

let theOnlyNextQuestion: IQuestion | null = null;
if (props.nextQuestionIds.length === 1) {
  if (props.nextQuestionIds[0] !== "finish") {
    theOnlyNextQuestion = questions.value.find(
      (question) => question.id === props.nextQuestionIds[0]
    );
  }
}

const selectedValThird = ref<string>(
  theOnlyNextQuestion ? theOnlyNextQuestion.name : "Завершено"
);
const changeSelectedValThird = (newValue: string) => {
  selectedValThird.value = newValue;
};
const selectOptionsThird: ComputedRef<string[]> = computed(() => {
  const selectOptionsThirdList = [];
  props.nextQuestionIds.forEach((nextQuestionId) => {
    questions.value.forEach((question) => {
      if (nextQuestionId === question.id) {
        selectOptionsThirdList.push(question.name);
      }
    });
  });
  selectOptionsThirdList.push("Завершено");
  return selectOptionsThirdList;
});
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
