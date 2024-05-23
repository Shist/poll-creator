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

      <!-- Тут нужно добавить компоненту для отображения формы и графа -->
      <keep-alive>
        <component
          :is="isLogicDiagram ? PollComponent : GraphComponent"
          :questions="questions"
        ></component>
      </keep-alive>

      <div class="logic-buttons">
        <BaseButton
          name="Публикация опроса"
          class="btn-primary btn-width me-4"
        />
        <BaseButton name="Отмена" class="btn-width" />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import BaseButton from "@/components/base/BaseButton.vue";
import AsideNavigation from "@/components/AsideNavigation.vue";
import TabsNavigation from "@/components/TabsNavigation.vue";
import BaseSwitcher from "@/components/base/BaseSwitcher.vue";
import PollComponent from "@/components/dashboard/PollComponent.vue";
import GraphComponent from "@/components/dashboard/GraphComponent.vue";
import type { IQuestion } from "@/types/data/questions";

const isLogicDiagram = ref<boolean>(true);

const questions = ref<IQuestion[]>([]);

onMounted(() => {
  questions.value = [
    {
      id: 1,
      name: "Какие языки вы знаете?",
      choices: [
        {
          id: 1,
          value: "JS",
          next_question: 2,
        },
        {
          id: 2,
          value: "NodeJS",
          next_question: 2,
        },
        {
          id: 3,
          value: "TS",
          next_question: 2,
        },
      ],
    },
    {
      id: 2,
      name: "Какие фреймворки вы знаете/изучали?",
      choices: [
        {
          id: 4,
          value: "Vue",
          next_question: 3,
        },
        {
          id: 5,
          value: "React",
          next_question: 3,
        },
        {
          id: 6,
          value: "Angular",
          next_question: 3,
        },
        {
          id: 7,
          value: "Express",
          next_question: null,
        },
        {
          id: 8,
          value: "Nest",
          next_question: null,
        },
      ],
    },
    {
      id: 3,
      name: "Какие паттерны проектирования вы применяли на проектах?",
      choices: [
        {
          id: 9,
          value: "Фабричный",
          next_question: 4,
        },
        {
          id: 10,
          value: "Строитель",
          next_question: 4,
        },
        {
          id: 11,
          value: "Стратегия",
          next_question: 4,
        },
        {
          id: 12,
          value: "Модуль",
          next_question: 4,
        },
      ],
    },
    {
      id: 4,
      name: "Какие бенефиты вы бы хотели иметь?",
      choices: [
        {
          id: 13,
          value: "Тренажерный зал",
          next_question: null,
        },
        {
          id: 14,
          value: "Курсы англиского",
          next_question: null,
        },
      ],
    },
  ];
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
