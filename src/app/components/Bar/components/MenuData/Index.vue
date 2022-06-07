<script setup lang="ts">
  import { colorsClasses } from '/src/scripts'

  import Button from '/src/components/Button.vue'

  import ColumnsSelection from './components/ColumnsSelection.vue'
  import PointsTable from './components/PointsTable/Index.vue'
  import ListboxGroupBy from './components/ListboxGroupBy.vue'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconArrowsExpand from '~icons/heroicons-solid/arrows-expand'
  import IconArrowSmRight from '~icons/heroicons-solid/arrow-sm-right'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'

  import store from '/src/store'

  const { t } = useI18n()

  const props = defineProps<{
    menu: MenuProps
  }>()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <ColumnsSelection />
  <ListboxGroupBy />
  <div
    v-if="selectedReport?.dataLabels.table.selected?.group.from !== 'Zone'"
    class="-mx-2"
  >
    <PointsTable
      v-if="selectedReport?.settings.groupBy === 'Number'"
      :points="selectedReport.line.sortedPoints"
    />
    <div v-else class="border-t-2 border-gray-100">
      <div v-for="zone of selectedReport?.zones">
        <div class="flex items-center space-x-4 p-2">
          <span
            class="block h-6 w-6 flex-none rounded-full"
            :style="`background-color: ${
              colorsClasses[zone.settings.color].hexColor
            }`"
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
            :icon="zone.settings.isVisible ? IconEye : IconEyeOff"
            @click="zone.settings.isVisible = !zone.settings.isVisible"
          />
        </div>
        <PointsTable :points="zone.points" />
      </div>
    </div>
  </div>
  <!-- <Button
    full
    :leftIcon="IconArrowsExpand"
    :rightIcon="IconArrowSmRight"
    disabled
    >Fullscreen</Button
  > -->
</template>
