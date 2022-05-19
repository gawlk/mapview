<script setup lang="ts">
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconHand from '~icons/heroicons-solid/hand'

  import store from '/src/store'

  import Button from '/src/components/Button.vue'
  import Select from '/src/components/Select.vue'

  const props = defineProps<{
    point: MachinePoint
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

  const movePointToZoneIndex = (point: MachinePoint, zoneIndex: number) => {
    const zones = selectedReport.value?.zones as MachineZone[] | undefined

    zones?.some((zone) => {
      const index = (zone.points as MachinePoint[]).findIndex(
        (_point) => _point === point
      )

      if (index !== -1) {
        zone.points.splice(index, 1)
        ;(zones[zoneIndex].points as MachinePoint[]).push(point)
        point.zone = zones[zoneIndex]

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
      v-if="selectedReport?.settings.groupBy === 'Number'"
      class="border-2 border-gray-100 bg-gray-100 px-1 text-right"
    >
      <Button sm :icon="IconHand" class="handle" />
    </td>
    <td
      v-if="selectedReport && selectedReport.zones.length > 1"
      class="border-2 border-gray-100 bg-gray-100 px-1 text-right"
    >
      <Select
        :selected="point.zone.name"
        :values="selectedReport.zones.map((zone) => zone.name) || []"
        @selectIndex="(index) => movePointToZoneIndex(point, index)"
      />
    </td>
    <td
      @click="
        store.map?.flyTo({
          center: point.marker?.getLngLat(),
          zoom: 20,
        })
      "
      :style="`background-color: ${point.icon.color}44`"
      class="cursor-pointer border-2 border-gray-100 px-2 font-bold"
      :class="[!props.point.settings.isVisible && 'italic opacity-50']"
    >
      <div :title="props.point.id" class="flex justify-end space-x-1">
        <span
          v-if="typeof props.point.settings.previousNumber === 'number'"
          class="whitespace-nowrap opacity-50"
        >
          {{ props.point.settings.previousNumber }} →
        </span>
        <span>
          {{ props.point.number }}
        </span>
      </div>
    </td>
    <td
      v-for="dataLabel of selectedTableDataLabelsParameters?.dataLabels"
      :class="[!props.point.settings.isVisible && 'italic opacity-50']"
      :style="`background-color: ${point.icon.color}${
        matchingGroupAndIndex &&
        dataLabels?.groups.selected?.choices.selected === dataLabel
          ? '88'
          : '44'
      };`"
      class="whitespace-nowrap border-2 border-gray-100 px-2 text-right"
    >
      {{
        groupFrom &&
        props.point.getDisplayedString(
          groupFrom,
          dataLabel,
          selectedTableDataLabelsParameters?.index
        )
      }}
    </td>
    <td class="border-2 border-gray-100 bg-gray-100 px-1 text-right">
      <Button
        sm
        :icon="props.point.settings.isVisible ? IconEye : IconEyeOff"
        @click="
          props.point.settings.isVisible = !props.point.settings.isVisible
        "
      />
    </td>
  </tr>
</template>
