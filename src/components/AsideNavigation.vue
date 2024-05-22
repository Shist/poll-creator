<template>
  <aside>
    <nav class="w-100">
      <ul>
        <li
          v-for="nav in navLinks"
          :key="nav.name"
          :class="{ 'active active-color': nav.link === $route.path }"
        >
          <component :is="nav.icon" class="me-2" />
          <p :class="{ 'active-color': nav.link === $route.path }">
            {{ nav.name }}
          </p>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";

import BlackListsIcon from "@/components/icons/BlackListsIcon.vue";
import QuestionsIcon from "@/components/icons/QuestionsIcon.vue";
import UsersIcon from "@/components/icons/UsersIcon.vue";

const navLinks = shallowRef([
  {
    name: "Опросы",
    icon: QuestionsIcon,
    link: "/",
  },
  {
    name: "Пользователи",
    icon: UsersIcon,
    link: "/users",
  },
  {
    name: "Черные списки",
    icon: BlackListsIcon,
    link: "/black-lists",
  },
]);
</script>

<style lang="scss" scoped>
@import "../styles/colors.scss";

aside {
  position: fixed;
  width: 280px;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid $border;
  padding: 2rem 1.5rem;
  background-color: $sidebarColor;

  li {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: $white;
      background-color: $primary;

      p {
        color: $white;
      }
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
