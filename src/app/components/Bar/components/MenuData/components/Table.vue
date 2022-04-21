<script setup lang="ts">
  // @ts-ignore
  import { Sortable } from '@shopify/draggable'

  import AverageRow from './AverageRow.vue'
  import Row from './Row.vue'

  import store from '/src/store'

  const { t } = useI18n()

  let tbody = ref(null)

  const pointsTableDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.table
  )

  onMounted(() => {
    if (tbody) {
      new Sortable(tbody.value, {
        draggable: 'tr',
        handle: '.handle',
      }).on('sortable:stop', (event: any) => {
        const { oldIndex, newIndex } = event.data

        if (
          oldIndex !== newIndex &&
          store.projects.selected?.reports.selected
        ) {
          const points = store.projects.selected.reports.selected.points

          points.forEach((point) => (point.settings.previousNumber = null))

          if (oldIndex < newIndex) {
            for (let i = oldIndex + 1; i <= newIndex; i++) {
              const point = points[i]
              point.settings.previousNumber = point.number
              point.number = point.number - 1
            }
          } else {
            for (let i = newIndex; i <= oldIndex - 1; i++) {
              const point = points[i]
              point.settings.previousNumber = point.number
              point.number = point.number + 1
            }
          }

          points[oldIndex].settings.previousNumber = points[oldIndex].number
          points[oldIndex].number = newIndex + 1

          points.sort((pointA, pointB) => pointA.number - pointB.number)
        }
      })
    }
  })
</script>

<template>
  <div class="-mx-2 min-w-[444px] overflow-x-auto">
    <table class="w-full text-sm font-medium">
      <thead class="h-8 text-gray-500">
        <td class="border-2 border-l-0 border-gray-100 bg-gray-100" />
        <td class="border-2 border-gray-100 px-1 text-center font-semibold">
          {{ t('Number') }}
        </td>
        <td
          v-for="dataLabel of pointsTableDataLabels?.selected?.dataLabels"
          class="font border-2 border-gray-100 px-1 text-right"
        >
          <p class="font-semibold">{{ t(dataLabel.name) }}</p>
          <div class="-space-y-0.5">
            <p class="text-xs">
              {{
                typeof dataLabel.unit === 'object'
                  ? t(dataLabel.unit.currentUnit).replaceAll(' ', '&nbsp;')
                  : dataLabel.unit ?? ''
              }}
            </p>
          </div>
        </td>
        <td class="border-2 border-r-0 border-gray-100 bg-gray-100" />
      </thead>
      <tbody ref="tbody">
        <AverageRow
          :points="store.projects.selected?.reports.selected?.points || []"
          :pointsTableDataLabels="pointsTableDataLabels"
        />
        <Row
          v-for="point in store.projects.selected?.reports.selected?.points"
          :key="point.id"
          :point="point"
          :pointsTableDataLabels="pointsTableDataLabels"
        />
      </tbody>
    </table>
  </div>
</template>
