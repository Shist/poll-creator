<template>
  <nav>
    <ul>
      <li
        v-for="nav in navLinks"
        :key="nav.name"
        :class="{ 'active active-color': nav.link === $route.path }"
      >
        <p :class="{ 'active-color': nav.link === $route.path }">
          {{ nav.name }}
        </p>
        <span v-if="nav.items">{{ nav.items }}</span>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const navLinks = ref([
  {
    name: "Параметры",
    link: "/parameters",
  },
  {
    name: "Вопросы",
    link: "/questions",
  },
  {
    name: "Логика",
    link: "/",
  },
  {
    name: "Условия",
    link: "/conditions",
    items: 3,
  },
  {
    name: "Респонденты",
    link: "/respondents",
    items: 3,
  },
]);
</script>

<style lang="scss" scoped>
@import "../styles/colors.scss";

ul {
  display: flex;

  li {
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 0.5rem;
    margin: 0 0.5rem 0 0;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: $white;
      background-color: $primary;

      p {
        color: $white;
      }

      span {
        color: $text;
        background-color: $white;
      }
    }

    p {
      font-size: 20px;
      @media (max-width: 864px) {
        font-size: 16px;
      }
    }

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      padding: 0 6px;
      margin-left: 0.5rem;
      border-radius: 50%;
      color: $white;
      background-color: $primary;
    }
  }

  .active {
    background-color: $primary;
  }

  .active-color {
    color: $white;
  }
}
</style>
