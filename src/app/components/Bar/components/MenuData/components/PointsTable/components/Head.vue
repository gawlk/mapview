<script setup lang="ts">
  import { createMathNumber } from '/src/scripts'
  import store from '/src/store'

  const { t } = useI18n()

  const props = defineProps<{
    points: MachinePoint[]
  }>()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const dataLabels = computed(() => selectedReport.value?.dataLabels)

  const matchingGroupAndIndex = computed(
    () =>
      dataLabels.value?.table.selected?.group ===
        dataLabels.value?.groups.selected &&
      dataLabels.value?.table.selected?.index ===
        dataLabels.value?.groups.selected.indexes?.selected
  )

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
</script>

<template>
  <td
    v-if="selectedReport?.settings.groupBy === 'Nothing'"
    class="w-12 border-2 border-gray-100 bg-gray-100 text-right font-semibold"
  ></td>
  <td
    v-if="selectedReport?.zones.length > 1"
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
        mathNumber: groupFrom
          ? createMathNumber(
              (typeof dataLabel.unit === 'string'
                ? getBasicAverage
                : dataLabel.unit.getAverage)(
                filteredPoints.map(
                  (point) =>
                    (groupFrom &&
                      point.getSelectedMathNumber(
                        groupFrom,
                        dataLabel,
                        selectedTableDataLabelsParameters?.index
                      )?.value) ||
                    0
                )
              ),
              dataLabel.unit
            )
          : null,
        dataLabel,
      }
    })"
    :style="
      mathNumber &&
      matchingGroupAndIndex &&
      dataLabels?.groups.selected?.choices.selected === dataLabel
        ? `background-color: ${selectedReport?.thresholds.groups
            .find((grouped) => grouped.unit === dataLabel.unit)
            ?.choices.selected?.getColor(
              mathNumber,
              selectedReport.thresholds.colors
            )}88`
        : ''
    "
    class="min-w-[4rem] border-2 border-gray-100 px-2 text-right text-gray-600"
  >
    <p class="font-semibold">{{ t(dataLabel.name) }}</p>
    <p class="text-xs">
      {{
        typeof dataLabel.unit === 'object'
          ? t(dataLabel.unit.currentUnit).replaceAll(' ', '&nbsp;')
          : dataLabel.unit ?? ''
      }}
    </p>
    <p class="font-semibold text-black">
      {{ mathNumber?.displayedString.replaceAll(' ', '&nbsp;') }}
    </p>
  </td>
  <td class="w-12 border-2 border-gray-100 bg-gray-100" />
</template>
