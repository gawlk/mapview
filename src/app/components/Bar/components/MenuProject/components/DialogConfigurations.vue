<template>
  <Dialog :title="t('Configurations')" :buttonIcon="CogIcon">
    <template v-slot:button>
      {{ t('See configurations') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-2">
        <div
          v-for="unit in store.project?.units"
          :key="unit.name"
          class="flex space-x-2"
        >
          <Input
            :id="`${unit.name} unit`"
            :label="`${unit.name} unit`"
            type="selectableString"
            @input="(value) => (unit.currentUnit = value)"
            :value="unit.currentUnit"
            :list="unit.possibleSettings.map((setting) => setting[0])"
            strict
          />
          <Input
            :id="`${unit.name} precision`"
            :label="`${unit.name} precision`"
            type="selectableString"
            @input="(value) => (unit.currentPrecision = Number(value))"
            :value="unit.currentPrecision"
            :list="unit.possiblePrecisions"
            strict
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { CogIcon } from '@heroicons/vue/solid'

  import { Dialog, Input } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Configurations': 'Configurations'
  'See configurations': 'See configurations'
  'Deformation:': 'Deformation:'
fr:
  'Configurations': 'Configurations'
  'See configurations': 'Voir les configurations'
  'Deformation:': 'Déflexion:'
</i18n>
