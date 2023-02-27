<script setup lang="ts">
  import store from '/src/store'

  import { createMathNumber } from '/src/scripts'

  const { t } = useI18n()

  const props = defineProps<{
    readonly points: BasePoint[]
  }>()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const dataLabels = computed(() => selectedReport.value?.dataLabels)

  const selectedTableDataLabelsParameters = computed(
    () => dataLabels.value?.table?.selected
  )

  const groupFrom = computed(
    () => selectedTableDataLabelsParameters.value?.group.from
  )

  const filteredPoints = computed(() =>
    props.points.filter((point) => point.settings.isVisible)
  )

  const getValuesFromPoints = (
    points: BasePoint[],
    dataLabel: DataLabel<string>
  ) =>
    points.map(
      (point) =>
        (groupFrom &&
          point.getSelectedMathNumber(
            groupFrom.value || 'Drop',
            dataLabel,
            selectedTableDataLabelsParameters.value?.index
          )?.value) ||
        0
    )
</script>

<template>
  <td
    class="w-12 border-2 border-gray-100 bg-gray-100 text-right font-semibold"
    v-if="selectedReport?.settings.groupBy === 'Number'"
  ></td>
  <td
    class="w-[8rem] min-w-[8rem] border-2 border-gray-100 bg-gray-100 pl-3 font-semibold text-gray-600"
    v-if="selectedReport?.zones && selectedReport.zones.length > 1"
  >
    {{ t('Zone') }}
  </td>
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
    } of selectedTableDataLabelsParameters?.dataLabels.map((dataLabel) => {
      return {
        mathNumber: createMathNumber(
          dataLabel.unit.getAverage(
            getValuesFromPoints(filteredPoints, dataLabel)
          ),
          dataLabel.unit
        ),
        dataLabel,
      }
    })"
  >
    <p class="font-semibold">{{ dataLabel.getDisplayedName() }}</p>
    <p class="whitespace-nowrap text-xs">
      {{ t(dataLabel.unit.currentUnit) }}
    </p>
    <p class="whitespace-nowrap font-semibold text-black">
      {{ mathNumber.displayedString }}
    </p>
  </td>
  <td class="w-12 border-2 border-gray-100 bg-gray-100" />
</template>
