<script setup lang="ts">
  import store from '/src/store'

  import Initializer from '../Initializer.vue'
  import Footer from './components/Footer.vue'
  import Logo from './components/Logo.vue'
  import MenuWrapperDesktop from './components/MenuWrapperDesktop.vue'

  const props = defineProps<{
    menus: MenuProp[]
  }>()
</script>

<template>
  <div class="w-[480px] flex-none space-y-8 overflow-scroll py-8 px-2">
    <Logo />

    <Initializer v-if="!store.selectedProject" />
    <div v-else class="space-y-8">
      <div v-for="menu in props.menus" :key="menu.name">
        <MenuWrapperDesktop
          v-if="store.selectedProject?.reports.length > 0 || !menu.needsReport"
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
