<template>
  <div class="flex-none flex justify-around items-center relative">
    <MenuMobile
      v-for="menu in props.menus"
      :key="menu.name"
      :name="menu.name"
      :icon="menu.icon"
      :opened="menu.opened"
      @click="selectMenu(menu)"
    >
      <component :is="menu.component" />
    </MenuMobile>
  </div>
</template>

<script setup>
  import { defineProps, reactive } from 'vue'

  import MenuMobile from './components/MenuMobile.vue'

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
