<template>
  <main class="w-100 h-100 d-flex">
    <AsideNavigation />

    <div class="main-block">
      <h1 class="px-5">Создание опроса</h1>
      <div class="logic">
        <TabsNavigation />

        <div class="d-flex align-items-center">
          <BaseSwitcher v-model="isLogicDiagram" />
          <p class="switch-label">Схема логики</p>
        </div>
      </div>

      <GraphComponent v-if="isLogicDiagram" :questions="questions" />
      <PollComponent
        v-else
        :questions="questions"
        :areLeftQuestionsValues="Object.keys(leftQuestionsValuesIds).length > 0"
        @changed="handleQuestionsChange"
      />

      <div class="logic-buttons">
        <BaseButton
          name="Публикация опроса"
          class="btn-primary btn-width me-4"
          :disabled="Object.keys(leftQuestionsValuesIds).length > 0"
        />
        <BaseButton name="Отмена" class="btn-width" />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, ComputedRef } from "vue";
import { useStore } from "vuex";
import BaseButton from "@/components/base/BaseButton.vue";
import AsideNavigation from "@/components/AsideNavigation.vue";
import TabsNavigation from "@/components/TabsNavigation.vue";
import BaseSwitcher from "@/components/base/BaseSwitcher.vue";
import PollComponent from "@/components/dashboard/PollComponent.vue";
import GraphComponent from "@/components/dashboard/GraphComponent.vue";
import type {
  IQuestion,
  ILeftQuestionsValuesIds,
} from "@/types/data/questions";
import { questionsFromServer } from "@/data";

const isLogicDiagram = ref<boolean>(false);

const store = useStore();

const questions: ComputedRef<IQuestion[]> = computed(
  () => store.state.pollData.questions
);
const leftQuestionsValuesIds: ComputedRef<ILeftQuestionsValuesIds> = computed(
  () => store.state.pollData.leftQuestionsValuesIds
);

const handleQuestionsChange = (newQuestions: IQuestion[]) => {};

onMounted(() => {
  store.commit("pollData/setQuestions", questionsFromServer);
});
</script>

<style lang="scss" scoped>
@import "../styles/colors.scss";

.main-block {
  width: 100%;
  margin: 0;
  padding: 2.5rem 0 103px 17.5rem;
  @media (max-width: 1280px) {
    padding: 2.5rem 0 103px 0;
  }
}

.logic {
  display: flex;
  justify-content: space-between;
  padding: 2.25rem;
  @media (max-width: 1280px) {
    padding: 1.5rem;
  }
}

.switch-label {
  margin-left: 8px;
  font-size: 20px;
  @media (max-width: 1024px) {
    font-size: 18px;
  }
  @media (max-width: 864px) {
    font-size: 16px;
  }
}

.logic-buttons {
  width: 100%;
  height: 103px;
  display: flex;
  position: fixed;
  bottom: 0;
  border-top: 1px solid $border;
  background-color: $white;
  padding: 2rem 3rem;
}

.btn-width {
  min-width: 12rem;
}
</style>
