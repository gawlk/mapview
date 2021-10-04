<template>
  <table class="w-full text-sm font-medium">
    <thead class="h-8 text-gray-500">
      <td />
      <td />
      <td
        v-for="key in store.project?.selectedReport?.dropsSettings.data.names"
        :key="key"
        :class="[
          key !==
            store.project?.selectedReport?.dropsSettings.data.names[
              store.project?.selectedReport?.dropsSettings.data.selected
            ] && 'opacity-50',
        ]"
        class="font-bold text-right"
      >
        {{ t(key) }}
      </td>
      <td />
    </thead>
    <tbody>
      <tr class="h-0.5" />
      <tr
        v-for="(point, index) in store.project?.selectedReport?.points"
        :key="index"
      >
        <td class="text-left">
          <Button sm :icon="HandIcon" />
        </td>
        <td class="font-bold text-center">{{ point.number }}</td>
        <td
          v-for="key in store.project?.selectedReport?.dropsSettings.data.names"
          :key="`${index}-${key}`"
          :class="[
            key !==
              store.project?.selectedReport?.dropsSettings.data.names[
                store.project?.selectedReport?.dropsSettings.data.selected
              ] && 'opacity-50',
          ]"
          class="font-bold text-right text-red-800"
        >
          <!-- {{ point.finalData[key].displayString || point.finalData[key].value }} -->
        </td>
        <td class="text-right">
          <Button sm :icon="EyeIcon" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { HandIcon, EyeIcon } from '@heroicons/vue/solid'

  import store from '/src/store'

  import { Button } from '/src/components'

  const { t } = useI18n()
</script>

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
