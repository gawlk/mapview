<script setup lang="ts">
  import store from '/src/store'

  import { colorsClasses } from '/src/scripts'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconHand from '~icons/heroicons-solid/hand'

  import Button from '/src/components/Button.vue'
  import Select from '/src/components/Select.vue'

  const props = defineProps<{
    readonly zone: BaseZone
  }>()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const dataLabels = computed(() => selectedReport.value?.dataLabels)

  const color = computed(
    () => colorsClasses[props.zone.settings.color].hexColor
  )

  const matchingGroupAndIndex = computed(
    () =>
      dataLabels.value?.table.selected?.group ===
        dataLabels.value?.groups.selected &&
      (dataLabels.value?.groups.selected.from !== 'Drop' ||
        (dataLabels.value?.groups.selected?.from === 'Drop' &&
          dataLabels.value?.table.selected?.index ===
            dataLabels.value?.groups.selected.indexes?.selected))
  )

  const selectedTableDataLabelsParameters = computed(
    () => dataLabels.value?.table?.selected
  )

  const groupFrom = computed(
    () => selectedTableDataLabelsParameters.value?.group.from
  )

  const movePointToZoneIndex = (point: BasePoint, zoneIndex: number) => {
    const zones = selectedReport.value?.zones

    zones?.some((zone) => {
      const index = zone.points.findIndex((_point) => _point === point)

      if (index !== -1) {
        zone.points.splice(index, 1)

        const points: BasePoint[] = zones[zoneIndex].points

        points.push(point)

        point.zone = zones[zoneIndex]

        if (selectedReport.value?.settings.colorization === 'Zone') {
          point.updateColor()
        }

        return true
      } else {
        return false
      }
    })
  }
</script>

<template>
  <tr class="odd:bg-gray-100">
    <td
      class="cursor-pointer border-2 border-gray-100 px-2 text-right font-bold"
      :style="`background-color: ${color}44`"
      :class="[!props.zone.settings.isVisible && 'italic opacity-50']"
    >
      {{ props.zone.name }}
    </td>
    <td
      class="whitespace-nowrap border-2 border-gray-100 px-2 text-right"
      v-for="dataLabel of selectedTableDataLabelsParameters?.dataLabels"
      :class="[!props.zone.settings.isVisible && 'italic opacity-50']"
      :style="`background-color: ${color}${'44'};`"
    >
      {{
        props.zone.data.find((data) => data.label === dataLabel)?.value
          .displayedString || '-'
      }}
      <!-- {{
        // groupFrom &&
        // props.zone.getDisplayedString(
        //   groupFrom,
        //   dataLabel,
        //   selectedTableDataLabelsParameters?.index
        // )
      }} -->
    </td>
    <td class="border-2 border-gray-100 bg-gray-100 px-1 text-right">
      <Button
        sm
        :icon="props.zone.settings.isVisible ? IconEye : IconEyeOff"
        @click="props.zone.settings.isVisible = !props.zone.settings.isVisible"
      />
    </td>
  </tr>
</template>
