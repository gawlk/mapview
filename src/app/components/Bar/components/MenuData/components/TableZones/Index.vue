<script setup lang="ts">
  import Head from './components/Head.vue'
  import Row from './components/Row.vue'

  const props = defineProps<{
    readonly zones: BaseZone[]
  }>()

  let tbody = ref(null)
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full table-auto text-sm font-medium">
      <thead>
        <Head :zones="props.zones" />
      </thead>
      <tbody ref="tbody">
        <Row
          v-for="zone in props.zones"
          :key="`zone-${zone.name}`"
          :zone="zone"
        />
      </tbody>
      <tfoot v-if="props.zones.length >= 20">
        <Head :zones="props.zones" />
      </tfoot>
    </table>
  </div>
</template>
