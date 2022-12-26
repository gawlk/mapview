<script setup lang="ts">
  import { type Component } from 'vue'

  import store from '/src/store'

  import { downloadFile, mrvzExporter } from '/src/scripts'

  import Button from '/src/components/Button.vue'

  import Template from './Template.vue'

  const { t } = useI18n()

  const emit = defineEmits<{
    (event: 'component', value: Component, props?: any): void
  }>()
</script>

<template>
  <div class="space-y-2">
    <Button full>TODO: {{ t('Default') }} </Button>
    <Template
      @component="(component, props) => emit('component', component, props)"
      :n="1"
    />
    <Template
      @component="(component, props) => emit('component', component, props)"
      :n="2"
    />
    <Template
      @component="(component, props) => emit('component', component, props)"
      :n="3"
    />
    <Button
      @click="
        () =>
          (async () =>
            store.projects.selected &&
            downloadFile(await mrvzExporter.export(store.projects.selected)))()
      "
      full
    >
      Download MRVZ JSON
    </Button>
  </div>
</template>
