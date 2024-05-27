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
        :selectValFirst="pollRow.selectValFirst"
        :selectOptionsFirst="pollRow.selectOptionsFirst"
        :selectValsSecond="pollRow.selectValsSecond"
        :selectOptionsSecond="pollRow.selectOptionsSecond"
        :selectValThird="pollRow.selectValThird"
        :selectOptionsThird="pollRow.selectOptionsThird"
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

const store = useStore();
const pollRows: ComputedRef<IPollRowStructure[]> = computed(
  () => store.state.pollData.pollRows
);

const addPollRow = () => {
  // do something
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
