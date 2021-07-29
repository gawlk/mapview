<template>
  <MenuItem v-slot="{ active }">
    <Button @click.stop.prevent :truncate="truncate" :icon="props.icon">
      <slot />
    </Button>
  </MenuItem>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  import { MenuItem } from '@headlessui/vue'

  import { Button } from './'

  const props = defineProps<{
    truncate?: boolean
    icon?: () => any
  }>()
</script>
