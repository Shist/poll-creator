<template>
  <main class="w-100 h-100 d-flex">
    <AsideNavigation />

    <div class="main-block">
      <h1 class="px-5">Создание опроса</h1>
      <div class="logic px-5">
        <TabsNavigation />

        <div class="d-flex align-items-center">
          <BaseSwitcher v-model="isLogicDiagram" />
          <p class="ms-3 fs-5">Схема логики</p>
        </div>
      </div>

      <!-- Тут нужно добавить компоненту для отображения формы и графа -->

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
import { ref } from "vue";

import BaseButton from "@/components/base/BaseButton.vue";
import AsideNavigation from "@/components/AsideNavigation.vue";
import TabsNavigation from "@/components/TabsNavigation.vue";
import BaseSwitcher from "@/components/base/BaseSwitcher.vue";

const isLogicDiagram = ref<boolean>(false);
</script>

<style lang="scss" scoped>
@import "../styles/colors.scss";

.main-block {
  width: 100%;
  margin: 0;
  padding: 2.5rem 0 2.5rem 17.5rem;
}

.logic {
  display: flex;
  justify-content: space-between;
  padding: 2.25rem 0;
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
