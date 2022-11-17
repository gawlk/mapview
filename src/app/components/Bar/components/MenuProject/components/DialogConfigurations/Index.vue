<script setup lang="ts">
  import { numberToLocaleString } from '/src/locales'

  import store from '/src/store'

  import { convertValueFromUnitAToUnitB } from '/src/scripts'

  import IconCog from '~icons/heroicons-solid/cog'

  import Dialog from '/src/components/Dialog.vue'
  import Input from '/src/components/Input.vue'

  const { t } = useI18n()

  const state = reactive({
    isOpen: false,
  })

  const convertValue = (value: number, unit: MathUnit<string>) =>
    Math.round(
      convertValueFromUnitAToUnitB(value, unit.baseUnit, unit.currentUnit) *
        100000
    ) / 100000
</script>

<template>
  <Dialog
    :isOpen="state.isOpen"
    :title="t('Configurations')"
    :leftIcon="IconCog"
    full
    @open="() => (state.isOpen = true)"
    @close="() => (state.isOpen = false)"
  >
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
            v-for="unit in (Object.values(
              store.projects.selected?.units || {}
            ).filter((unit) => !unit.readOnly) as MathUnit<string>[])"
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
            <div class="space-y-2 sm:flex sm:space-y-0 sm:space-x-2">
              <Input
                :id="`${unit.name}-min`"
                :label="`Minimum (${unit.currentUnit})`"
                :value="convertValue(unit.min, unit)"
                type="number"
                :step="0.00001"
                @input="
                  (value) => {
                    unit.min = convertValueFromUnitAToUnitB(
                      Number(value),
                      unit.currentUnit,
                      unit.baseUnit
                    )
                  }
                "
              />
              <Input
                :id="`${unit.name}-max`"
                :label="`Maximum (${unit.currentUnit})`"
                :value="convertValue(unit.max, unit)"
                :step="0.00001"
                type="number"
                @input="
                  (value) => {
                    unit.max = convertValueFromUnitAToUnitB(
                      Number(value),
                      unit.currentUnit,
                      unit.baseUnit
                    )
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'See configurations': 'Voir les configurations'
</i18n>
