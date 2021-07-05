<template>
  <div class="flex-none flex justify-around items-center relative">
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
</template>

<script setup>
  import { defineProps, reactive } from 'vue'

  import MenuWrapperMobile from './components/MenuWrapperMobile.vue'

  const props = defineProps({
    menus: Array,
  })

  props.menus.map((menu) => {
    menu.opened = false
  })

  const selectMenu = (menu) => {
    props.menus.forEach((_menu) => {
      _menu.opened = menu === _menu ? !_menu.opened : false
    })
  }
</script>
