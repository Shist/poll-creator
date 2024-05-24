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

const props = defineProps<Omit<IPollRowStructure, "rowId">>();

const stateFirstVal = ref(props.selectValFirst);
const stateFirstOptions = ref(props.selectOptionsFirst);
const stateSecondVals = ref(props.selectValsSecond);
const stateSecondOptions = ref(props.selectOptionsSecond);
const stateThirdVal = ref(props.selectValThird);
const stateThirdOptions = ref(props.selectOptionsThird);

const store = useStore();
const userQuestions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.userQuestions
);

const changeSelectedValFirst = (oldValue: string, newValue: string) => {
  stateFirstVal.value = newValue;

  const freeChoicesInfo: { [key: number]: number[] } =
    store.getters.getFreeQuestionsChoices;
  const filteredChoicesEntries = Object.entries(freeChoicesInfo).filter(
    ([questionId, choicesArr]) => choicesArr.length
  );
  const oldQuestion = userQuestions.value.find((question) => {
    if (question.name === oldValue) {
      return question;
    }
  });
  if (oldQuestion) {
    oldQuestion.choices.forEach((choice) => {
      choice;
    });
  }

  changeSelectedValsSecond(stateSecondVals.value, []);
  changeSelectedValThird(stateThirdVal.value, "");
};

const changeSelectedValsSecond = (oldValue: string[], newValue: string[]) => {
  stateSecondVals.value = newValue;
};

const changeSelectedValThird = (oldValue: string, newValue: string) => {
  stateThirdVal.value = newValue;
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
