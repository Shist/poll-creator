<template>
  <div class="poll-wrapper">
    <h2 class="poll-wrapper__headline">Создание логики</h2>
    <p class="poll-wrapper__text">
      Пожалуйста, для успешной настройки логики заполните сценарии для всех
      вопросов и всех вариантов ответов.
    </p>
    <div class="poll-wrapper__poll-rows-wrapper">
      <PollRowComponent
        v-for="pollRow in pollRows"
        :key="pollRow.rowId"
        :rowId="pollRow.rowId"
        :pollRows="pollRows"
        @updatePollRows="handlePollRowsUpdate"
      />
      <button
        @click="addPollRow"
        class="poll-wrapper__add-poll-row-btn"
        v-show="!store.getters['pollData/areAllChoicesPresent']"
      >
        + Добавить условие
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, computed } from "vue";
import { useStore } from "vuex";
import PollRowComponent from "@/components/dashboard/PollRowComponent.vue";
import { IPollRowStructure } from "@/types/data/questions";
import { v4 as uuidv4 } from "uuid";

const store = useStore();
const pollRows: ComputedRef<IPollRowStructure[]> = computed(
  () => store.state.pollData.pollRows
);

const handlePollRowsUpdate = (updatedPollRows: IPollRowStructure[]) => {
  store.commit("pollData/setPollRows", updatedPollRows);
};

const addPollRow = () => {
  // const updatedPollRows = [...pollRows.value];
  // const newPollRow: IPollRowStructure = {
  // rowId: `${q.id}|${uuidv4()}`;
  // selectValFirst: string;
  // selectOptionsFirst: string[];
  // selectValsSecond: string[];
  // selectOptionsSecond: string[];
  // selectValThird: string;
  // selectOptionsThird: string[];
};
</script>

<style lang="scss">
@import "../../styles/colors.scss";

.poll-wrapper {
  padding-inline: 2.25rem;
  @media (max-width: 1280px) {
    padding: 1.5rem;
  }
  &__headline {
    margin-bottom: 20px;
  }
  &__text {
    margin-bottom: 15px;
  }
  &__poll-rows-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    .poll-wrapper__add-poll-row-btn {
      padding: 5px;
      align-self: flex-start;
      border: none;
      background-color: $white;
      color: $text;
    }
  }
}
</style>
