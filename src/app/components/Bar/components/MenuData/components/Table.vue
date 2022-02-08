<script setup lang="ts">
  import IconEye from '~icons/heroicons-solid/eye'
  import IconHand from '~icons/heroicons-solid/hand'

  import store from '/src/store'

  const { t } = useI18n()
</script>

<template>
  <table class="w-full text-sm font-medium">
    <thead class="h-8 text-gray-500">
      <td />
      <td />
      <td
        v-for="key in store.selectedProject?.selectedReport?.dropsSettings.data
          .names"
        :key="key"
        :class="[
          key !==
            store.selectedProject?.selectedReport?.dropsSettings.data.names[
              store.selectedProject?.selectedReport?.dropsSettings.data.selected
            ] && 'opacity-50',
        ]"
        class="text-right font-bold"
      >
        {{ t(key) }}
      </td>
      <td />
    </thead>
    <tbody>
      <tr class="h-0.5" />
      <tr
        v-for="(point, index) in store.selectedProject?.selectedReport?.points"
        :key="index"
      >
        <td class="text-left">
          <Button sm :icon="IconHand" />
        </td>
        <td class="text-center font-bold">{{ point.number }}</td>
        <td
          v-for="key in store.selectedProject?.selectedReport?.dropsSettings
            .data.names"
          :key="`${index}-${key}`"
          :class="[
            key !==
              store.selectedProject?.selectedReport?.dropsSettings.data.names[
                store.selectedProject?.selectedReport?.dropsSettings.data
                  .selected
              ] && 'opacity-50',
          ]"
          class="text-right font-bold text-red-800"
        >
          <!-- {{ point.finalData[key].displayString || point.finalData[key].value }} -->
        </td>
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
