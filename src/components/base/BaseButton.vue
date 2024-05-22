<template>
  <button
    class="btn d-flex align-items-center justify-content-center"
    :disabled="disabled"
  >
    {{ name }}
  </button>
</template>

<script lang="ts" setup>
import type { BaseButtonProps } from "@/types/props";

withDefaults(defineProps<BaseButtonProps>(), {
  name: "",
});
</script>
