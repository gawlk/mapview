<script setup lang="ts">
  import store from '/src/store'

  import { colorsClasses } from '/src/scripts'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'

  import Button from '/src/components/Button.vue'

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

  const selectedTableDataLabelsParameters = computed(
    () => dataLabels.value?.table?.selected
  )
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
