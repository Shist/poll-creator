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
import { ref } from "vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { IQuestion } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";

const props = defineProps<{
  questions: IQuestion[];
  currQuestionId: number;
  selectOptionsFirst: string[];
  selectOptionsSecond: string[];
  selectOptionsThird: string[];
}>();

const emit = defineEmits<{ changed: [value: IQuestion[]] }>();

const selectedValFirst = ref<string>(
  props.selectOptionsFirst.length === 1 ? props.selectOptionsFirst[0] : ""
);
const changeSelectedValFirst = (newValue: string) => {
  selectedValFirst.value = newValue;
  changeSelectedValsSecond([]);
  changeSelectedValThird("");
};

const selectedValsSecond = ref<string[]>(
  props.selectOptionsSecond.length ? props.selectOptionsSecond : []
);
const changeSelectedValsSecond = (newValue: string[]) => {
  selectedValsSecond.value = newValue;
};

const selectedValThird = ref<string>(
  props.selectOptionsThird.length === 1 ? props.selectOptionsThird[0] : ""
);
const changeSelectedValThird = (newValue: string) => {
  selectedValThird.value = newValue;

  const newQuestions: IQuestion[] = JSON.parse(JSON.stringify(props.questions));

  newQuestions[props.currQuestionId].choices.forEach((choice) => {
    delete choice.next_question;
  });

  emit("changed", newQuestions);
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
