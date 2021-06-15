<template>
  <table class="w-full text-sm font-medium">
    <thead class="h-8 text-gray-500">
      <td />
      <td class="text-center font-bold">
        {{ t('Number') }}
      </td>
      <td class="text-right font-semibold">D0</td>
      <td class="text-right font-bold">D200</td>
      <td class="text-right font-semibold">D400</td>
      <td />
    </thead>
    <tbody>
      <tr class="h-0.5" />
      <tr v-for="number in [1, 2, 3, 4, 5, 6]">
        <td class="text-left">
          <Button sm :icon="HandIcon" />
        </td>
        <td class="font-bold text-center">{{ number }}</td>
        <td class="text-right">123,12</td>
        <td class="text-right text-red-800 font-bold">123,12</td>
        <td class="text-right">123,12</td>
        <td class="text-right">
          <Button sm :icon="EyeIcon" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import { HandIcon, EyeIcon } from '@heroicons/vue/solid'

  import { Button } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Number': 'Number'
fr:
  'Number': 'Numéro'
</i18n>
