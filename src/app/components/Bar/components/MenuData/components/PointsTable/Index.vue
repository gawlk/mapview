<script setup lang="ts">
  // @ts-ignore
  import { Sortable } from '@shopify/draggable'

  import store from '/src/store'

  import PointsHead from './components/Head.vue'
  import PointsRow from './components/Row.vue'

  const props = defineProps<{
    readonly points: MachinePoint[]
  }>()

  let tbody = ref(null)
  let sortable: any

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  onMounted(() => {
    console.log('points', props.points)

    if (tbody && selectedReport.value?.settings.groupBy === 'Number') {
      sortable = new Sortable(tbody.value, {
        draggable: 'tr',
        handle: '.handle',
        mirror: {
          constrainDimensions: true,
        },
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

  onUnmounted(() => {
    sortable?.destroy()
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
