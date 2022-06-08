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
          let points = [...props.points]

          const [movedPoint] = points.splice(oldIndex, 1)

          points = [
            ...points.slice(0, newIndex),
            movedPoint,
            ...points.slice(newIndex),
          ]

          let number = 1

          points.forEach((point, index) => {
            point.index = index
            point.number = number

            if (point.settings.isVisible) {
              number++
            }
          })

          selectedReport.value.line.update()
        }
      })
    }
  })
</script>

<template>
  <div class="max-h-[50vh] max-h-[45dvb] overflow-auto lg:max-h-max">
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
