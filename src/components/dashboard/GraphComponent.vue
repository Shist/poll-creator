<template>
  <div id="cytoscape-graph"></div>
</template>

<script lang="ts" setup>
import { onMounted, ComputedRef, computed } from "vue";
import { useStore } from "vuex";
import { useGraph } from "@/composables/useGraph";
import type { IQuestion } from "@/types/data/questions";

const { initCytoscapeGraph } = useGraph();

const store = useStore();

const questions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.questions
);

onMounted(() => {
  initCytoscapeGraph(questions.value);
});
</script>

<style lang="scss">
@import "../../styles/colors.scss";

#cytoscape-graph {
  height: 60vh;
  width: 100%;
  border: 1px solid $border;
}

.label {
  display: flex;
  align-items: center;
  font-family: "Inter", sans-serif;
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 10px;
  color: #7a7a7a;
  cursor: pointer;
}

.question {
  font-weight: 600;
  color: $primary;
}

.question-icon {
  width: 20px;
  height: 20px;
  background-image: url("@/assets/ellipse.svg");
  background-position: center;
  background-size: contain;
  margin-right: 10px;
}
</style>
