<script setup lang="ts">
  import store from '/src/store'

  import MenuWrapperMobile from './components/MenuWrapperMobile.vue'

  import Initializer from '../Initializer.vue'

  const props = defineProps<{
    readonly menus: Menu[]
  }>()

  props.menus?.map((menu) => {
    menu.openedOnMobile = false
  })

  const selectMenu = (menuToSelect: Menu) => {
    if (store.projects.selected) {
      props.menus?.forEach((menu) => {
        menu.openedOnMobile =
          menu === menuToSelect ? !menu.openedOnMobile : false
      })
    }
  }
</script>

<template>
  <div class="flex-none p-2">
    <div
      class="absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent p-2"
      v-if="!store.projects.selected"
    >
      <Initializer class="rounded-lg bg-white p-2" />
    </div>
    <div class="relative flex items-center justify-around">
      <MenuWrapperMobile
        v-for="menu in props.menus"
        :key="menu.name"
        :name="menu.name"
        :icon="menu.icon"
        :style="menu.style"
        :class="menu.class"
        :opened="menu.openedOnMobile"
        :disabled="!store.projects.selected"
        @click="selectMenu(menu)"
      >
        <component :is="menu.component" :menu="menu.props" />
      </MenuWrapperMobile>
    </div>
  </div>
</template>
