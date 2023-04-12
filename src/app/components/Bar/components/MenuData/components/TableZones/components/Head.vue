<script setup lang="ts">
  import store from '/src/store'

  import { createMathNumber } from '/src/scripts'

  const { t } = useI18n()

  const props = defineProps<{
    readonly zones: BaseZone[]
  }>()

  const dataLabels = computed(() => store.selectedReport?.dataLabels)

  const getValuesFromZones = (dataLabel: DataLabel<string>) =>
    props.zones
      .map((zone) =>
        zone.data.find((data) => data.label === dataLabel)?.getRawValue()
      )
      .filter((value) => typeof value === 'number') as number[]
</script>

<template>
  <td
    class="border-2 border-gray-100 px-2 text-right font-semibold text-gray-600"
  >
    <p class="font-semibold">{{ t('Nom') }}</p>
    <p class="text-xs">
      {{ t('Unit') }}
    </p>
    <p class="font-semibold text-black">
      {{ t('Average') }}
    </p>
  </td>
  <td
    class="min-w-[4rem] border-2 border-gray-100 px-2 text-right text-gray-600"
    v-for="{
      mathNumber,
      dataLabel,
    } of dataLabels?.table.selected?.dataLabels.map((dataLabel) => {
      return {
        mathNumber: createMathNumber(
          dataLabel.unit.getAverage(getValuesFromZones(dataLabel)),
          dataLabel.unit
        ),
        dataLabel,
      }
    })"
  >
    <p class="font-semibold">{{ dataLabel.getDisplayedName() }}</p>
    <p class="whitespace-nowrap text-xs">
      {{ t(dataLabel.unit.currentUnit || '') }}
    </p>
    <p class="whitespace-nowrap font-semibold text-black">
      {{ mathNumber.displayedString }}
    </p>
  </td>
  <td class="w-12 border-2 border-gray-100 bg-gray-100" />
</template>
