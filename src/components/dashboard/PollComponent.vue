<template>
  <div></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import type { IQuestion } from "@/types/data/questions";

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
