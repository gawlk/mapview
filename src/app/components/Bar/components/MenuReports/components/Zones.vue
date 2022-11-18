<script setup lang="ts">
  import store from '/src/store'

  import {
    colorsClasses,
    createHeavydynZoneFromJSON,
    createMaxidynZoneFromJSON,
    createMinidynZoneFromJSON,
  } from '/src/scripts'

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
    const colorNames = Object.keys(colorsClasses)

    if (store.projects.selected && selectedReport.value && store.map) {
      const json: JSONMachineZone = {
        version: 1,
        base: {
          version: 1,
          name: `Zone ${selectedReport.value.zones.length + 1}`,
          settings: {
            version: 1,
            color: colorNames[
              Math.floor(Math.random() * colorNames.length)
            ] as ColorName,
            isVisible: true,
          },
          points: [],
        },
        distinct: {
          version: 1,
        },
      }

      const createZone =
        selectedReport.value?.machine === 'Heavydyn'
          ? createHeavydynZoneFromJSON
          : selectedReport.value?.machine === 'Maxidyn'
          ? createMaxidynZoneFromJSON
          : createMinidynZoneFromJSON

      const zone = createZone(json, store.map, {
        report: selectedReport.value,
      })

      zone.init()
      ;(selectedReport.value.zones as MachineZone[]).push(zone)
    }
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
