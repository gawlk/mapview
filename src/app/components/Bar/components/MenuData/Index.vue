<script setup lang="ts">
  import { colorsClasses } from '/src/scripts'

  import ColumnsSelection from './components/ColumnsSelection.vue'
  import Table from './components/Table.vue'
  import ListboxGroupBy from './components/ListboxGroupBy.vue'

  import IconArrowsExpand from '~icons/heroicons-solid/arrows-expand'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'

  import store from '/src/store'

  const { t } = useI18n()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <ColumnsSelection />
  <ListboxGroupBy />
  <div class="-mx-2 border-t-2 border-gray-100">
    <Table
      v-if="selectedReport?.settings.groupBy === 'Nothing'"
      :points="selectedReport.points"
    />
    <div
      v-else
      v-for="{zone, points} of 
        selectedReport?.zones.map((zone) => {
          return {
            zone,
            points: selectedReport ? (selectedReport.points as MachinePoint[]).filter((point) => point.zone === zone) : [],
          }
        })
      "
    >
      <div class="flex items-center space-x-4 p-2">
        <span
          class="block h-6 w-6 flex-none rounded-full"
          :style="`background-color: ${colorsClasses[zone.color].hexColor}`"
        />
        <div class="flex-none space-x-2 text-sm">
          <span class="font-medium text-gray-500">{{
            `${t('Zone')}${t(':')}`
          }}</span>
          <span class="font-semibold">
            {{ zone?.name || t('None') }}
          </span>
        </div>
        <div class="w-full" />
        <Button
          sm
          :icon="zone.isVisible ? IconEye : IconEyeOff"
          @click="zone.isVisible = !zone.isVisible"
        />
      </div>
      <Table :points="points" />
    </div>
  </div>
  <Button full :leftIcon="IconArrowsExpand" disabled>Fullscreen</Button>
</template>
