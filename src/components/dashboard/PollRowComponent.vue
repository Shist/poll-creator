<template>
  <div class="poll-row">
    <BaseSelect
      :selectedValue="selectedValFirst"
      :multiple="false"
      :clearable="false"
      :label="'Если'"
      :options="optionsFirst"
      @change="changeSelectedValFirst"
    />
    <BaseSelect
      :selectedValue="selectedValsSecond"
      :multiple="true"
      :clearable="false"
      :label="'Ответ'"
      :options="optionsSecond"
      @change="changeSelectedValsSecond"
    />
    <BaseSelect
      :selectedValue="selectedValThird"
      :multiple="false"
      :clearable="false"
      :label="'То перейти на'"
      :options="optionsThird"
      @change="changeSelectedValThird"
    />
    <button class="poll-row__cross-btn">
      <CrossIcon class="poll-row__cross-btn-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import CrossIcon from "../icons/CrossIcon.vue";
import type { PollRowComponentProps } from "@/types/props";

const props = defineProps<PollRowComponentProps>();

const selectedValFirst = ref<string>("");
const changeSelectedValFirst = (newValue: string) => {
  selectedValFirst.value = newValue;
};
const optionsFirst = computed(() => {
  const newOptionsArr = props.questions.map((question) => question.name);
  const currThirdQuestion = props.questions.find(
    (question) => question.name === selectedValThird.value
  );
  if (currThirdQuestion) {
    const indexOfThird = newOptionsArr.indexOf(selectedValThird.value);
    if (indexOfThird !== -1) {
      newOptionsArr.splice(indexOfThird, 1);
    }
  }
  return newOptionsArr;
});

const selectedValsSecond = ref<string[]>([]);
const changeSelectedValsSecond = (newValue: string[]) => {
  selectedValsSecond.value = newValue;
};
const optionsSecond = computed(() => {
  const currFirstQuestion = props.questions.find(
    (question) => question.name === selectedValFirst.value
  );
  selectedValsSecond.value = [];
  return currFirstQuestion
    ? currFirstQuestion.choices.map((choice) => choice.value)
    : [];
});

const selectedValThird = ref<string>("");
const changeSelectedValThird = (newValue: string) => {
  selectedValThird.value = newValue;
};
const optionsThird = computed(() => {
  const currFirstQuestion = props.questions.find(
    (question) => question.name === selectedValFirst.value
  );
  const newOptionsArr = props.questions.map((question) => question.name);
  const indexOfFirst = newOptionsArr.indexOf(selectedValFirst.value);
  if (indexOfFirst !== -1) {
    newOptionsArr.splice(indexOfFirst, 1);
  }
  newOptionsArr.push("Завершено");
  return currFirstQuestion ? newOptionsArr : [];
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
