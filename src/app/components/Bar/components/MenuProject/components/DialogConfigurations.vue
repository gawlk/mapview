<script setup lang="ts">
  import store from '/src/store'

  import IconCog from '~icons/heroicons-solid/cog'

  const { t } = useI18n()
</script>

<template>
  <Dialog :title="t('Configurations')" :buttonIcon="IconCog">
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
            v-for="unit in store.projects.selected?.units"
            :key="unit.name"
            class="space-y-1"
          >
            <h5 class="pl-4 font-medium text-gray-700">
              {{ t(unit.name) }}
            </h5>
            <div class="space-y-2 sm:flex sm:space-y-0 sm:space-x-2">
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

<i18n lang="yaml">
en:
  'See configurations': 'See configurations'
fr:
  'See configurations': 'Voir les configurations'
</i18n>
