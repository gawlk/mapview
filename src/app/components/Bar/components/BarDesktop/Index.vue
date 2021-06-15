<template>
  <div class="flex-none w-[480px] px-2 py-8 space-y-8 overflow-scroll">
    <Logo />

    <div class="space-y-8">
      <MenuDesktop
        v-for="menu in props.menus"
        :key="menu.name"
        :name="menu.name"
        :icon="menu.icon"
      >
        <component :is="menu.component" />
      </MenuDesktop>
    </div>

    <Footer />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'

  import Footer from './components/Footer.vue'
  import Logo from './components/Logo.vue'
  import MenuDesktop from './components/MenuDesktop.vue'

  const props = defineProps({
    menus: Array,
  })
</script>
