<script setup lang="ts">
  import store from '/src/store'

  import Button from '/src/components/Button.vue'

  import Initializer from '../Initializer.vue'
  import Footer from './components/Footer.vue'
  import Logo from './components/Logo.vue'
  import MenuWrapperDesktop from './components/MenuWrapperDesktop.vue'

  const props = defineProps<{
    readonly menus: Menu[]
  }>()
</script>

<template>
  <div class="w-[520px] flex-none space-y-8 overflow-scroll py-8 px-2">
    <Logo />

    <Initializer v-if="!store.projects.selected" />
    <div v-else class="space-y-8">
      <div v-for="menu in props.menus" :key="menu.name">
        <MenuWrapperDesktop
          v-if="
            store.projects.selected?.reports.list.length > 0 ||
            !menu.needsReport
          "
          :name="menu.name"
          :icon="menu.icon"
          :menuProps="menu.props"
        >
          <component :is="menu.component" :menu="menu.props" />
        </MenuWrapperDesktop>
        <Button v-else disabled full :leftIcon="menu.icon">
          {{ menu.name }}
        </Button>
      </div>
    </div>

    <Footer />
  </div>
</template>
