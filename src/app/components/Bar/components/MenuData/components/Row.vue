<script setup lang="ts">
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconHand from '~icons/heroicons-solid/hand'

  const props = defineProps<{
    point: MachinePoint
    pointsTableDataLabels:
      | SelectableList<TableDataLabelsParameters, TableDataLabelsParameters>
      | undefined
  }>()

  const groupFrom = computed(
    () => props.pointsTableDataLabels?.selected?.group.from
  )
</script>

<template>
  <tr class="odd:bg-gray-50">
    <td class="border-2 border-l-0 border-gray-100 bg-gray-100 px-1 text-left">
      <Button sm :icon="IconHand" class="handle" />
    </td>
    <td
      class="border-2 border-gray-100 px-1 text-center font-bold"
      :class="[!props.point.settings.isVisible && 'opacity-0']"
    >
      <div class="flex justify-center space-x-1">
        <span
          v-if="typeof props.point.settings.previousNumber === 'number'"
          class="opacity-50"
        >
          {{ props.point.settings.previousNumber }}&nbsp;→
        </span>
        <span>
          {{ props.point.number }}
        </span>
      </div>
    </td>
    <td
      v-for="displayedString of props.pointsTableDataLabels?.selected?.dataLabels.map(
        (dataLabel) =>
          groupFrom
            ? props.point.getDisplayedString(
                groupFrom,
                dataLabel,
                props.pointsTableDataLabels?.selected?.index
              )
            : ''
      )"
      :class="!props.point.settings.isVisible && 'opacity-50'"
      class="border-2 border-gray-100 px-1 text-right"
    >
      {{ displayedString.replaceAll(' ', '&nbsp;') }}
    </td>
    <td class="border-2 border-r-0 border-gray-100 bg-gray-100 px-1 text-right">
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
