<script setup lang="ts">
  import store from '/src/store'
  import {
    createZone,
    setDisclosureOpenState,
    getDisclosureOpenState,
  } from '/src/scripts'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconIssueDraft from '~icons/octicon/issue-draft-16'
  import Button from '/src/components/Button.vue'
  import Divider from '/src/components/Divider.vue'

  const { t } = useI18n()

  const key = 'isPointsColorsDisclosureOpen'

  store.projects.selected?.reports.selected &&
    (store.projects.selected.reports.selected.zones[0].name = t('Default'))

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <Disclosure
    :icon="IconIssueDraft"
    :text="t('Zones settings')"
    @click="(open) => setDisclosureOpenState(key, open)"
    :defaultOpen="getDisclosureOpenState(key, false)"
  >
    <div class="space-y-2">
      <div
        v-for="(zone, index) of selectedReport?.zones"
        class="flex space-x-2"
      >
        <ListboxColors
          :icon="IconColorSwatch"
          @selectColor="(color: ColorName) => 
            (zone.color = color)
          "
          :color="zone.color"
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
              selectedReport?.points.forEach(
                (point) => point.zone === zone && (point.zone = null)
              )
              selectedReport?.zones.splice(index, 1)
            }
          "
          :icon="IconTrash"
        />
      </div>
      <Divider />
      <Button
        full
        :leftIcon="IconPlus"
        @click="
          () => {
            selectedReport?.zones.push(
              createZone({
                name: `${t('Zone')} ${selectedReport?.zones.length + 1}`,
                isVisible: true,
              })
            )
          }
        "
      >
        {{ t('Create a zone') }}
      </Button>
    </div>
  </Disclosure>
</template>

<i18n lang="yaml">
fr:
  'Zones settings': 'Configuration des zones'
  'Create a zone': 'Créer une zone'
</i18n>
