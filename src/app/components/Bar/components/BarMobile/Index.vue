<template>
  <div class="flex-none p-2">
    <Initializer v-if="!store.project" />
    <div v-else class="relative flex items-center justify-around">
      <MenuWrapperMobile
        v-for="menu in props.menus"
        :key="menu.name"
        :name="menu.name"
        :icon="menu.icon"
        :opened="menu.opened"
        @click="selectMenu(menu)"
      >
        <component :is="menu.component" />
      </MenuWrapperMobile>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, reactive } from 'vue'

  import store from '/src/store'

  import Initializer from '../Initializer.vue'
  import MenuWrapperMobile from './components/MenuWrapperMobile.vue'

  const props = defineProps({
    menus: Array,
  })

  props.menus?.map((menu: any) => {
    menu.opened = false
  })

  const selectMenu = (menuToSelect: any) => {
    props.menus?.forEach((menu: any) => {
      menu.opened = menu === menuToSelect ? !menu.opened : false
    })
  }
</script>
