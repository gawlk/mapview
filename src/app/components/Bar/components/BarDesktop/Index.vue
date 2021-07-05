<template>
  <div class="flex-none w-[480px] px-2 py-8 space-y-8 overflow-scroll">
    <Logo />

    <div class="space-y-8">
      <MenuWrapperDesktop
        v-for="menu in props.menus"
        :key="menu.name"
        :name="menu.name"
        :icon="menu.icon"
      >
        <component :is="menu.component" />
      </MenuWrapperDesktop>
    </div>

    <Footer />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'

  import Footer from './components/Footer.vue'
  import Logo from './components/Logo.vue'
  import MenuWrapperDesktop from './components/MenuWrapperDesktop.vue'

  const props = defineProps({
    menus: Array,
  })
</script>
