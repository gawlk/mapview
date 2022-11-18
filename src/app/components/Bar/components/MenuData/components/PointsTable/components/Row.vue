<script setup lang="ts">
  import store from '/src/store'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconHand from '~icons/heroicons-solid/hand'

  import Button from '/src/components/Button.vue'
  import Select from '/src/components/Select.vue'

  const props = defineProps<{
    readonly point: MachinePoint
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

        if (selectedReport.value?.settings.colorization === 'Zone') {
          point.updateColor()
          // selectedReport.value?.line.update()
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
      class="border-2 border-gray-100 bg-gray-100 px-1 text-right"
      v-if="selectedReport?.settings.groupBy === 'Number'"
    >
      <Button class="handle" sm :icon="IconHand" />
    </td>
    <td
      class="border-2 border-gray-100 bg-gray-100 px-1 text-right"
      v-if="selectedReport && selectedReport.zones.length > 1"
    >
      <Select
        sm
        :selected="point.zone.name"
        :values="selectedReport.zones.map((zone) => zone.name) || []"
        @selectIndex="(index) => movePointToZoneIndex(point, index)"
      />
    </td>
    <td
      class="cursor-pointer border-2 border-gray-100 px-2 text-right font-bold"
      @click="
        store.map?.flyTo({
          center: point.marker?.getLngLat(),
          zoom: 20,
        })
      "
      :style="`background-color: ${point.icon?.color}44`"
      :class="[!props.point.settings.isVisible && 'italic opacity-50']"
    >
      {{ props.point.number }}
    </td>
    <td
      class="whitespace-nowrap border-2 border-gray-100 px-2 text-right"
      v-for="dataLabel of selectedTableDataLabelsParameters?.dataLabels"
      :class="[!props.point.settings.isVisible && 'italic opacity-50']"
      @click="
        store.map?.flyTo({
          center: point.marker?.getLngLat(),
          zoom: 20,
        })
      "
      :style="`background-color: ${point.icon?.color}${
        matchingGroupAndIndex &&
        dataLabels?.groups.selected?.choices.selected === dataLabel
          ? '88'
          : '44'
      };`"
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
