<template>
  <div class="rounded-lg border-2 border-gray-100 p-1 pb-0.5">
    <table class="w-full text-sm font-medium">
      <thead class="h-8 text-gray-500">
        <td class="rounded-l-lg bg-gray-100" />
        <td class="text-center bg-gray-100 font-bold">
          {{ t('Number') }}
        </td>
        <td class="text-right bg-gray-100 font-semibold">D0</td>
        <td class="text-right bg-gray-100 font-bold">D200</td>
        <td class="text-right bg-gray-100 font-semibold">D400</td>
        <td class="rounded-r-lg bg-gray-100" />
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
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import { TableIcon, HandIcon, EyeIcon } from '@heroicons/vue/solid'

  import { Button, Disclosure } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Table': 'Table'
  'Number': 'Number'
fr:
  'Table': 'Table'
  'Number': 'Numéro'
</i18n>
