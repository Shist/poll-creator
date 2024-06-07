<template>
  <label class="switch">
    <input
      :type="INPUT_TYPE.CHECKBOX"
      :checked="modelValue"
      @change="inputValue"
    />
    <span class="slider round"></span>
  </label>
</template>

<script lang="ts" setup>
import { INPUT_TYPE } from "@/types/enums";
import type { BaseSwitcherProps } from "@/types/props";

defineProps<BaseSwitcherProps>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const inputValue = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
};
</script>

<style lang="scss" scoped>
@import "../../styles/colors.scss";

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  min-width: 60px;
  height: 32px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 2px;
  background-color: $secondary;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: $primary;
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(24px);
  background-color: $white;
}

.slider.round {
  border-radius: 34px;
  border: 1px solid $secondary;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
