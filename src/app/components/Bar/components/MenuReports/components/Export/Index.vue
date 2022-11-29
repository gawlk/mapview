<script setup lang="ts">
  import { type Component } from 'vue'

  import IconHeroiconsSolidChevronLeft from '~icons/heroicons-solid/chevron-left'
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'

  import Home from './components/Home.vue'

  const state = shallowReactive({
    components: shallowReactive([] as Component[]),
    isOpen: false,
  })

  const { t } = useI18n()
</script>

<template>
  <Dialog
    :isOpen="state.isOpen"
    :title="t('Export')"
    full
    :leftIcon="IconCloudDownload"
    orange
    @open="() => (state.isOpen = true)"
    @close="() => (state.isOpen = false)"
  >
    <template v-slot:button>
      {{ t('Export report') }}
    </template>
    <template v-slot:dialog>
      <div class="-mb-8 space-y-8" v-if="state.components.length">
        <component :is="state.components[state.components.length - 1]" />
        <Button
          class="z-20"
          :leftIcon="IconHeroiconsSolidChevronLeft"
          @click="() => state.components.pop()"
        >
          {{ t('Back') }}
        </Button>
      </div>
      <Home
        v-else
        @component="(component) => state.components.push(component)"
      />
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export report': 'Exporter le rapport'
</i18n>
