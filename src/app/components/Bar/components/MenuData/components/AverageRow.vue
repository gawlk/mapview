<script setup lang="ts">
  import { createMathNumber } from '/src/scripts'

  const { t } = useI18n()

  const props = defineProps<{
    points: MachinePoint[]
    pointsTableDataLabels:
      | SelectableList<TableDataLabelsParameters, TableDataLabelsParameters>
      | undefined
  }>()

  const groupFrom = computed(
    () => props.pointsTableDataLabels?.selected?.group.from
  )
</script>

<template>
  <tr class="font-semibold odd:bg-gray-50">
    <td class="h-8 border-2 border-l-0 border-gray-100 bg-gray-100 px-1" />
    <td class="border-2 border-gray-100 px-1 text-center text-gray-500">
      {{ t('Average') }}
    </td>
    <td
      v-for="displayedString of props.pointsTableDataLabels?.selected?.dataLabels.map(
        (dataLabel) => {
          const points = props.points.filter(
            (point) => point.settings.isVisible
          )

          return groupFrom
            ? createMathNumber(
                points
                  .map(
                    (point) =>
                      point.getSelectedMathNumber(
                        groupFrom,
                        dataLabel,
                        props.pointsTableDataLabels?.selected?.index
                      )?.value || 0
                  )
                  .reduce((acc, c) => acc + c, 0) / points.length,
                dataLabel.unit
              ).displayedString
            : ''
        }
      )"
      class="border-2 border-gray-100 px-1 text-right"
    >
      {{ displayedString.replaceAll(' ', '&nbsp;') }}
    </td>
    <td class="border-2 border-r-0 border-gray-100 bg-gray-100 px-1" />
  </tr>
</template>
