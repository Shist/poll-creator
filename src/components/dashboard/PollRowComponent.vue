<template>
  <div class="poll-row">
    <BaseSelect
      :selectedValue="props.selectValFirst"
      :multiple="false"
      :clearable="false"
      :label="'Если'"
      :options="selectOptionsFirst"
      @change="changeSelectedValFirst"
    />
    <BaseSelect
      :selectedValue="props.selectValsSecond"
      :multiple="true"
      :clearable="false"
      :label="'Ответ'"
      :options="selectOptionsSecond"
      @change="changeSelectedValsSecond"
    />
    <BaseSelect
      :selectedValue="props.selectValThird"
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
import BaseSelect from "@/components/base/BaseSelect.vue";
import { IPollRowStructure } from "@/types/data/questions";
import CrossIcon from "../icons/CrossIcon.vue";

const props = defineProps<Omit<IPollRowStructure, "rowId">>();

const changeSelectedValFirst = (newValue: string) => {
  // selectedValFirst.value = newValue;

  // const newQuestion = questions.value.find((question) => {
  //   if (question.name === newValue) {
  //     return question;
  //   }
  // });
  // selectedQuestion.value = newQuestion ? newQuestion : null;

  changeSelectedValsSecond([]);
  changeSelectedValThird("");
};

const changeSelectedValsSecond = (newValue: string[]) => {
  //selectedValsSecond.value = newValue;
};

const changeSelectedValThird = (newValue: string) => {
  //selectedValThird.value = newValue;
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
