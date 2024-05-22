<template>
  <div class="poll-wrapper">
    <h2 class="poll-wrapper__headline">Создание логики</h2>
    <p class="poll-wrapper__text">
      Пожалуйста, для успешной настройки логики заполните сценарии для всех
      вопросов и всех вариантов ответов.
    </p>
    <div class="poll-wrapper__poll-rows-wrapper">
      <PollRowComponent
        v-for="pollRow in pollRowsArr"
        :selectOptionsFirst="pollRow.selectOptionsFirst"
        :selectOptionsSecond="pollRow.selectOptionsSecond"
        :selectOptionsThird="pollRow.selectOptionsThird"
      />
      <button @click="addPollRow" class="poll-wrapper__add-poll-row-btn">
        + Добавить условие
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PollRowComponent from "@/components/dashboard/PollRowComponent.vue";
import type { IQuestion } from "@/types/data/questions";
import type { PollRowComponentProps } from "@/types/props";

const questions = ref<IQuestion[]>([]);

const pollRowsArr = ref<PollRowComponentProps[]>([]);
let currQuestionId = 1;
let nextQuestionId = 1;

const addPollRow = () => {
  const nextPollRow: PollRowComponentProps = {
    selectOptionsFirst: [],
    selectOptionsSecond: [],
    selectOptionsThird: [],
  };

  pollRowsArr.value.push(nextPollRow);
};

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
