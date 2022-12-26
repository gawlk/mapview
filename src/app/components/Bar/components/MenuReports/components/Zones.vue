<script setup lang="ts">
  import store from '/src/store'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'

  import Button from '/src/components/Button.vue'
  import Input from '/src/components/Input.vue'
  import ListboxColors from '/src/components/ListboxColors.vue'

  const { t } = useI18n()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const createZone = () => {
    selectedReport.value?.addZone()
  }
</script>

<template>
  <div class="space-y-2">
    <div class="flex space-x-2" v-for="(zone, index) of selectedReport?.zones">
      <ListboxColors
        :icon="IconColorSwatch"
        @selectColor="(color: ColorName) => 
            (zone.settings.color = color)
          "
        :color="zone.settings.color"
      />
      <Input
        :id="zone.name + '-name'"
        :value="zone.name"
        @input="(value) => (zone.name = String(value))"
      />
      <Button
        v-if="index !== 0"
        @click="
            () => {
              (selectedReport?.zones[0].points as MachinePoint[]).push(...zone.points)

              zone.clean()

              selectedReport?.zones.splice(index, 1)
            }
          "
        :icon="IconTrash"
      />
    </div>
    <Button full :leftIcon="IconPlus" @click="createZone">
      {{ t('Create a zone') }}
    </Button>
  </div>
</template>

<i18n lang="yaml">
fr:
  'Create a zone': 'Créer une zone'
</i18n>
