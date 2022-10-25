<script setup lang="ts">
  import { createMathNumber } from '/src/scripts'
  import store from '/src/store'

  const { t } = useI18n()

  const props = defineProps<{
    readonly points: MachinePoint[]
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
    (props.points as MachinePoint[]).filter((point) => point.settings.isVisible)
  )

  const getBasicAverage = (values: number[]) =>
    values.reduce((total, currentValue) => total + currentValue, 0) /
    values.length

  const getValuesFromPoints = (
    points: MachinePoint[],
    dataLabel: DataLabel<string>
  ) =>
    points.map(
      (point) =>
        (groupFrom &&
          point.getSelectedMathNumber(
            groupFrom.value as DataLabelsFrom,
            dataLabel,
            selectedTableDataLabelsParameters.value?.index
          )?.value) ||
        0
    )
</script>

<template>
  <td
    v-if="selectedReport?.settings.groupBy === 'Number'"
    class="w-12 border-2 border-gray-100 bg-gray-100 text-right font-semibold"
  ></td>
  <td
    v-if="selectedReport?.zones && selectedReport.zones.length > 1"
    class="w-[8rem] min-w-[8rem] border-2 border-gray-100 bg-gray-100 pl-3 font-semibold text-gray-600"
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
    v-for="{
      mathNumber,
      dataLabel,
    } of selectedTableDataLabelsParameters?.dataLabels.map((dataLabel) => {
      return {
        mathNumber: createMathNumber(
          typeof dataLabel.unit === 'string'
            ? getBasicAverage(getValuesFromPoints(filteredPoints, dataLabel))
            : dataLabel.unit.getAverage(
                getValuesFromPoints(filteredPoints, dataLabel)
              ),
          dataLabel.unit
        ),
        dataLabel,
      }
    })"
    class="min-w-[4rem] border-2 border-gray-100 px-2 text-right text-gray-600"
  >
    <p class="font-semibold">{{ t(dataLabel.name) }}</p>
    <p class="whitespace-nowrap text-xs">
      {{
        typeof dataLabel.unit === 'object'
          ? t(dataLabel.unit.currentUnit)
          : dataLabel.unit ?? ''
      }}
    </p>
    <p class="whitespace-nowrap font-semibold text-black">
      {{ mathNumber.displayedString }}
    </p>
  </td>
  <td class="w-12 border-2 border-gray-100 bg-gray-100" />
</template>
