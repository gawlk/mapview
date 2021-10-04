<template>
  <div class="flex-none w-[480px] px-2 py-8 space-y-8 overflow-scroll">
    <Logo />

    <Initializer v-if="!store.project" />
    <div v-else class="space-y-8">
      <div v-for="menu in props.menus" :key="menu.name">
        <MenuWrapperDesktop
          v-if="store.project?.reports.length > 0 || !menu.needsReport"
          :name="menu.name"
          :icon="menu.icon"
        >
          <component :is="menu.component" />
        </MenuWrapperDesktop>
        <Button v-else disabled full :leftIcon="menu.icon">
          {{ menu.name }}
        </Button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
  import store from '/src/store'

  import Initializer from '../Initializer.vue'
  import Footer from './components/Footer.vue'
  import Logo from './components/Logo.vue'
  import MenuWrapperDesktop from './components/MenuWrapperDesktop.vue'

  import { Button } from '/src/components'

  const props = defineProps<{
    menus: MenuProp[]
  }>()
</script>
