<script setup lang="ts">
  import IconEye from '~icons/heroicons-solid/eye'
  import IconHand from '~icons/heroicons-solid/hand'

  import store from '/src/store'

  const { t } = useI18n()

  const pointsTableDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.table
  )
</script>

<template>
  <table class="inset-x-auto w-full min-w-[444px] text-sm font-medium">
    <thead class="h-8 text-gray-500">
      <td />
      <td class="text-center">{{ t('Number') }}</td>
      <td
        v-for="(name, index) of pointsTableDataLabels?.selected?.dataLabels.map(
          (dataLabel) => dataLabel.name
        )"
      >
        {{ t(name) }}
      </td>
      <td />
    </thead>
    <tbody>
      <tr
        v-for="(point, index) in store.projects.selected?.reports.selected
          ?.points"
        :key="index"
      >
        <td class="text-left">
          <Button sm :icon="IconHand" />
        </td>
        <td class="text-center font-bold">{{ point.number }}</td>
        <td class="text-right">
          <Button sm :icon="IconEye" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<i18n lang="yaml">
'en':
  'Load bearing cap.': 'LBC'
  'Max. load': 'Load'
  'Max. displacement': 'Disp.'
  'Pulse time': 'Pulse'
'fr':
  'Load bearing cap.': 'Portance'
  'Max. load': 'F. max.'
  'Max. displacement': 'D. max.'
  'Pulse time': 'Impulsion'
</i18n>
