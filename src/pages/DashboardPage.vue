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

      <GraphComponent v-if="isLogicDiagram" />
      <PollComponent v-else />

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
  IPollRow,
  ILeftQuestionsValuesIds,
  INextQuestionsValuesIds,
} from "@/types/data/questions";
import { questionsFromServer } from "@/data";

const isLogicDiagram = ref<boolean>(false);

const store = useStore();
const leftQuestionsValuesIds: ComputedRef<ILeftQuestionsValuesIds> = computed(
  () => store.state.pollData.leftQuestionsValuesIds
);

onMounted(() => {
  const result: IPollRow[] = [];
  questionsFromServer.forEach((questionObj, questionIndex) => {
    const questionChains = {} as INextQuestionsValuesIds;
    questionObj.choices.forEach((choice) => {
      if (choice.next_question !== null) {
        questionChains[choice.next_question]
          ? questionChains[choice.next_question].push(choice.id)
          : (questionChains[choice.next_question] = [choice.id]);
      } else {
        questionChains["finish"]
          ? questionChains["finish"].push(choice.id)
          : (questionChains["finish"] = [choice.id]);
      }
    });
    Object.entries(questionChains).forEach(
      ([nextQuestionId, valuesIdsArr], chainIndex) => {
        const nextPollRow: IPollRow = {
          rowId: `${questionIndex}-${chainIndex}`,
          questionIds: [questionObj.id],
          selectedValuesIds: valuesIdsArr,
          nextQuestionIds: [
            nextQuestionId !== "finish"
              ? Number(nextQuestionId)
              : nextQuestionId,
          ],
        };
        result.push(nextPollRow);
      }
    );
  });
  store.commit("pollData/setQuestions", questionsFromServer);
  store.commit("pollData/setPollRows", result);
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
