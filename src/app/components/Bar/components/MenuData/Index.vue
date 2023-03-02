<script setup lang="ts">
  import store from '/src/store'

  import { colorsClasses } from '/src/scripts'

  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'

  import Button from '/src/components/Button.vue'

  import ColumnsSelection from './components/ColumnsSelection.vue'
  import ListboxGroupBy from './components/ListboxGroupBy.vue'
  import TablePoints from './components/TablePoints/Index.vue'
  import TableZones from './components/TableZones/Index.vue'

  const { t } = useI18n()

  const props = defineProps<{
    readonly menu: MenuProps
  }>()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const getDcarString = (zone: MachineZone) => {
    const dCar = zone.data.find(
      (data) => data.label.name === 'Characteristic deflection'
    )

    return dCar ? `Dcar = ${dCar.value.displayedStringWithUnit}` : ''
  }
</script>

<template>
  <ColumnsSelection />
  <ListboxGroupBy />
  <div class="-mx-2">
    <TableZones
      v-if="selectedReport?.dataLabels.table.selected?.group.from === 'Zone'"
      :zones="selectedReport.zones"
    />
    <TablePoints
      v-else-if="selectedReport?.settings.groupBy === 'Number'"
      :points="selectedReport.line.sortedPoints"
    />
    <div class="border-t-2 border-gray-100" v-else>
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
            <span>
              {{ getDcarString(zone) }}
            </span>
          </div>
          <div class="w-full" />
          <Button
            sm
            :icon="zone.settings.isVisible ? IconEye : IconEyeOff"
            @click="zone.settings.isVisible = !zone.settings.isVisible"
          />
        </div>
        <TablePoints :points="zone.points" />
      </div>
    </div>
  </div>
  <!-- TODO: When redesigning the dialog component
    <Button
    full
    :leftIcon="IconArrowsExpand"
    :rightIcon="IconArrowSmRight"
    disabled
  >
    Fullscreen
  </Button> -->
</template>
