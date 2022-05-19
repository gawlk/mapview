<script setup lang="ts">
  // @ts-ignore
  import { Sortable } from '@shopify/draggable'

  import PointsHead from './components/Head.vue'
  import PointsRow from './components/Row.vue'

  import store from '/src/store'

  const props = defineProps<{
    points: MachinePoint[]
  }>()

  let tbody = ref(null)

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  onMounted(() => {
    if (tbody && selectedReport.value?.settings.groupBy === 'Number') {
      new Sortable(tbody.value, {
        draggable: 'tr',
        handle: '.handle',
      }).on('sortable:stop', (event: any) => {
        const { oldIndex, newIndex } = event.data

        if (oldIndex !== newIndex && selectedReport.value) {
          const points = props.points

          points.forEach((point) => (point.settings.previousNumber = null))

          if (oldIndex < newIndex) {
            for (let i = oldIndex + 1; i <= newIndex; i++) {
              const point = points[i]
              point.settings.previousNumber = point.number
              point.number--
            }
          } else {
            for (let i = newIndex; i <= oldIndex - 1; i++) {
              const point = points[i]
              point.settings.previousNumber = point.number
              point.number++
            }
          }

          const movedPoint = points[oldIndex]

          movedPoint.settings.previousNumber = movedPoint.number

          const numberOfHiddenPoints = points
            .slice(0, newIndex + (oldIndex < newIndex ? 1 : 0))
            .filter(
              (point) => point !== movedPoint && !point.settings.isVisible
            ).length

          movedPoint.number = newIndex + 1 - numberOfHiddenPoints

          selectedReport.value.line.update()
        }
      })
    }
  })
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full table-auto text-sm font-medium">
      <thead>
        <PointsHead :points="props.points" />
      </thead>
      <tbody ref="tbody">
        <PointsRow
          v-for="point in props.points"
          :key="point.id"
          :point="point"
        />
      </tbody>
      <tfoot v-if="props.points.length >= 20">
        <PointsHead :points="props.points" />
      </tfoot>
    </table>
  </div>
</template>
