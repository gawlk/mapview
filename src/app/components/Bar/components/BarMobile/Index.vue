<template>
  <div class="flex-none p-2">
    <div
      v-if="!store.project"
      class="absolute inset-x-0 bottom-0 z-10 p-2 mb-20 bg-transparent"
    >
      <Initializer class="p-2 bg-white rounded-lg" />
    </div>
    <div class="relative flex items-center justify-around">
      <MenuWrapperMobile
        v-for="menu in props.menus"
        :key="menu.name"
        :name="menu.name"
        :icon="menu.icon"
        :opened="menu.openedOnMobile"
        :disabled="!store.project"
        @click="selectMenu(menu)"
      >
        <component :is="menu.component" />
      </MenuWrapperMobile>
    </div>
  </div>
</template>

<script setup lang="ts">
  import store from '/src/store'

  import Initializer from '../Initializer.vue'
  import MenuWrapperMobile from './components/MenuWrapperMobile.vue'

  const props = defineProps<{
    menus: MenuProp[]
  }>()

  props.menus?.map((menu: any) => {
    menu.openedOnMobile = false
  })

  const selectMenu = (menuToSelect: any) => {
    if (store.project) {
      props.menus?.forEach((menu: any) => {
        menu.openedOnMobile =
          menu === menuToSelect ? !menu.openedOnMobile : false
      })
    }
  }
</script>
