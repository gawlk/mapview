<script setup lang="ts">
  import store from '/src/store'
  import {
    createZone,
    setDisclosureOpenState,
    getDisclosureOpenState,
  } from '/src/scripts'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconIssueDraft from '~icons/octicon/issue-draft-16'
  import IconFold from '~icons/octicon/fold-16'

  const { t } = useI18n()

  const key = 'isPointsColorsDisclosureOpen'

  const selectedDataLabel = computed(
    () =>
      store.projects.selected?.reports.selected?.dataLabels.groups.selected
        ?.choices.selected
  )

  const formattedTresholdValue = computed(
    () =>
      `${
        selectedDataLabel.value?.unit.thresholds?.selected?.value.toLocaleString() ||
        '?'
      } ${selectedDataLabel.value?.unit.currentUnit}`
  )
</script>

<template>
  <Disclosure
    :icon="IconColorSwatch"
    :text="t('Colors settings')"
    @click="(open) => setDisclosureOpenState(key, open)"
    :defaultOpen="getDisclosureOpenState(key)"
  >
    <Listbox
      :icon="IconAdjustments"
      :values="[t('Colorization by threshold'), t('Colorization by zone')]"
      :selectedIndex="
        store.projects.selected?.reports.selected?.settings
          .selectedColorization === 'Threshold'
          ? 0
          : 1
      "
      @selectIndex="
        (index) =>
          store.projects.selected?.reports.selected &&
          (store.projects.selected.reports.selected.settings.selectedColorization =
            index === 0 ? 'Threshold' : 'Zone')
      "
      full
    />
    <Divider />
    <div
      v-if="
        store.projects.selected?.reports.selected?.settings
          .selectedColorization === 'Threshold'
      "
      class="space-y-2"
    >
      <Listbox
        :icon="IconFold"
        :values="
          selectedDataLabel?.unit.thresholds?.list.map(
            (threshold) => threshold.name
          )
        "
        @selectIndex="
          (index) =>
            selectedDataLabel?.unit.thresholds?.selected &&
            (selectedDataLabel.unit.thresholds.selected =
              selectedDataLabel.unit.thresholds.list[index])
        "
        :preSelected="`${t('Threshold')}${t(':')}`"
        :selected="selectedDataLabel?.unit.thresholds?.selected?.name"
        full
      />
      <ListboxColors
        :icon="IconColorSwatch"
        :color="
          store.projects.selected?.reports.selected?.settings.threshold.colors
            .low
        "
        @selectColor="(color: Color) => {
          store.projects.selected?.reports.selected && (store.projects.selected.reports.selected.settings.threshold.colors.low = color)
        }"
        :text="`0 < ${t(
          selectedDataLabel?.name || ''
        )} < ${formattedTresholdValue}`"
      />
      <ListboxColors
        :icon="IconColorSwatch"
        :color="
          store.projects.selected.reports.selected.settings.threshold.colors
            .high
        "
        @selectColor="(color: Color) => {
          store.projects.selected?.reports.selected && (store.projects.selected.reports.selected.settings.threshold.colors.high = color)
        }"
        :text="`${formattedTresholdValue} < ${t(
          selectedDataLabel?.name || ''
        )} < ∞`"
      />
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="(zone, index) of store.projects.selected?.reports.selected
          ?.zones"
        class="flex space-x-2"
      >
        <ListboxColors
          :icon="IconIssueDraft"
          @selectColor="(color: Color) => 
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
          @click="
            store.projects.selected?.reports.selected?.zones.splice(index, 1)
          "
          :icon="IconTrash"
        />
      </div>
      <Button
        full
        :leftIcon="IconPlus"
        @click="
          () => {
            store.projects.selected?.reports.selected?.zones.push(
              createZone({
                name: `${t('Zone')} ${
                  store.projects.selected?.reports.selected?.zones.length + 1
                }`,
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
  'Colors settings': 'Configurations des couleurs'
  'Colorization by threshold': 'Colorisation par seuil'
  'Colorization by zone': 'Colorisation par zone'
  'Create a zone': 'Créer une zone'
</i18n>
