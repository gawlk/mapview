<script setup lang="ts">
  import store from '/src/store'
  import { createZone, colorsClasses } from '/src/scripts'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconIssueDraft from '~icons/octicon/issue-draft-16'
  import IconFold from '~icons/octicon/fold-16'

  const { t } = useI18n()
</script>

<template>
  <Disclosure
    :icon="IconColorSwatch"
    :text="t('Colors settings')"
    @click="() => {}"
    :defaultOpen="true"
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
        :values="store.projects.selected?.reports.list.map((report) => 'r')"
        :preSelected="`${t('Threshold')}${t(':')}`"
        selected="N.S."
        full
      />
      <ListboxColors
        :icon="IconColorSwatch"
        :color="'green'"
        @selectColor="(color: Color) => {
 
        }"
        :text="`0 < ${
          ''
          // t(store.projects.selected?.reports.selected?.dropsSettings.data.names[
          //   store.projects.selected.reports.selected.dropsSettings.data.selected
          // ] as string)
        } < 30,0 um`"
      />
      <ListboxColors
        :icon="IconColorSwatch"
        :color="'red'"
        @selectColor="(color: Color) => {
 
        }"
        :text="`30,0 um < ${
          ''
          // t(store.projects.selected?.reports.selected?.dropsSettings.data.names[
          //   store.projects.selected.reports.selected.dropsSettings.data.selected
          // ] as string)
        } < ∞`"
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
          :text="`Zone ${index + 1}`"
          @selectColor="(color: Color) => {
            zone.color = color
          }"
          :color="zone.color"
        />
        <Button
          @click="
            store.projects.selected?.reports.selected?.zones.splice(index, 1)
          "
          :icon="IconTrash"
          :buttonColors="colorsClasses[zone.color].buttonColors"
          :iconsClasses="colorsClasses[zone.color].iconsClasses"
        />
      </div>
      <Button
        full
        :leftIcon="IconPlus"
        @click="
          () => {
            store.projects.selected?.reports.selected?.zones.push(createZone())
          }
        "
      >
        {{ t('Create a zone') }}
      </Button>
    </div>
  </Disclosure>
</template>

<i18n lang="yaml">
en:
  'Colors settings': 'Colors settings'
  'Colorization by threshold': 'Colorization by threshold'
  'Colorization by zone': 'Colorization by zone'
  'Create a zone': 'Create a zone'
fr:
  'Colors settings': 'Configurations des couleurs'
  'Colorization by threshold': 'Colorisation par seuil'
  'Colorization by zone': 'Colorisation par zone'
  'Create a zone': 'Créer une zone'
</i18n>
