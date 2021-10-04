<template>
  <Dialog :title="t('Configurations')" :buttonIcon="CogIcon">
    <template v-slot:button>
      {{ t('See configurations') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-6 sm:space-y-6">
        <h4 class="pl-4 text-lg font-medium leading-6">
          {{ t('Units') }}
        </h4>
        <div class="space-y-4">
          <div
            v-for="unit in store.project?.units"
            :key="unit.name"
            class="space-y-1"
          >
            <h5 class="pl-4 font-medium text-gray-700">
              {{ t(unit.name) }}
            </h5>
            <div class="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
              <Input
                :id="`${unit.name} unit`"
                :label="t('Unit')"
                type="selectableString"
                @input="(value) => (unit.currentUnit = value as string)"
                :value="unit.currentUnit"
                :list="unit.possibleSettings.map((setting) => setting[0])"
                strict
              />
              <Input
                :id="`${unit.name} precision`"
                :label="t('Precision')"
                type="selectableString"
                @input="(value) => (unit.currentPrecision = Number(value))"
                :value="unit.currentPrecision"
                :list="unit.possiblePrecisions"
                strict
              />
            </div>
          </div>
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
  'Units': 'Units'
  'Unit': 'Unit'
  'Precision': 'Precision'
  'Deformation': 'Deformation'
  'Force': 'Force'
  'Temperature': 'Temperature'
fr:
  'Configurations': 'Configurations'
  'See configurations': 'Voir les configurations'
  'Units': 'Unités'
  'Unit': 'Unité'
  'Precision': 'Précision'
  'Deformation': 'Déflexion'
  'Force': 'Force'
  'Temperature': 'Température'
</i18n>
