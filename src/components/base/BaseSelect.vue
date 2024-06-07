<template>
  <div class="w-100">
    <label v-if="label" :for="label" class="form-label fw-bolder">
      {{ label }}
    </label>
    <v-select
      class="select"
      :modelValue="selectedValue"
      :multiple="multiple"
      :clearable="clearable"
      :label="objectLabel"
      :options="options"
      @update:modelValue="inputValue"
    ></v-select>
  </div>
</template>

<script lang="ts" setup>
import type { BaseSelectProps } from "@/types/props";

defineProps<BaseSelectProps<any>>();
const emit = defineEmits<{
  change: [newValue: string | string[]];
}>();

const inputValue = (newValue: string | string[]): void => {
  emit("change", newValue);
};
</script>

<style lang="scss">
@import "../../styles/colors.scss";

.select .vs__dropdown-toggle {
  width: 100%;
  min-height: 40px;
}

.vs__selected-options {
  padding: 2px 2px 2px 16px;
}
</style>
