<script setup lang="ts">
  import store from '/src/store'
  import { icons } from '/src/scripts'

  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconZoomIn from '~icons/heroicons-solid/zoom-in'

  import Button from '/src/components/Button.vue'
  import Popover from '/src/components/Popover.vue'
  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const selectReport = (report: MachineReport) => {
    if (store.projects.selected) {
      store.projects.selected.reports.selected = report
      report.fitOnMap()
    }
  }

  const toggleReport = (report: MachineReport) => {
    report.settings.isVisible = !report.settings.isVisible
  }

  const deleteReport = (index: number) => {
    const project = store.projects.selected

    if (project) {
      const report = project.reports.list.splice(index, 1)?.[0]

      if (report.settings.isVisible) {
        report.remove()
      }

      if (report === project.reports.selected) {
        project.reports.selected =
          project.reports.list.length - 1 >= index
            ? project.reports.list[index]
            : project.reports.list.slice(-1).pop() || null
      }
    }
  }

  const pointIconValues = Object.keys(icons).map((key) => {
    return icons[key as IconName]
  })

  const setIcon = (index: number) => {
    if (store.projects.selected?.reports.selected) {
      store.projects.selected.reports.selected.settings.iconName = Object.keys(
        icons
      )[index] as IconName
    }
  }
</script>

<template>
  <div class="flex space-x-2">
    <Popover
      :icon="IconViewList"
      :preText="`${t('Selected')}${t(':')}`"
      :buttonText="`${store.projects.selected?.reports.selected?.name.value}`"
      full
      class="w-full"
    >
      <div
        v-for="(report, index) of store.projects.selected?.reports.list"
        :key="(report.name.value as string)"
        class="flex space-x-1"
      >
        <Button
          :leftIcon="IconZoomIn"
          @click="selectReport(report)"
          truncate
          full
        >
          {{ report.name.value }}
        </Button>
        <Button
          :icon="report.settings.isVisible ? IconEye : IconEyeOff"
          @click="toggleReport(report)"
        />
        <Button
          v-if="
            store.projects.selected &&
            store.projects.selected.reports.list.length > 1
          "
          :icon="IconTrash"
          @click="deleteReport(index)"
        />
      </div>
    </Popover>
    <Listbox
      @selectIndex="setIcon"
      :selected="
        pointIconValues[
          Object.keys(icons).findIndex(
            (name) =>
              name ===
              store.projects.selected?.reports.selected?.settings.iconName
          )
        ]
      "
      :values="pointIconValues"
    />
  </div>
</template>

<i18n lang="yaml">
fr:
  'Circle': 'Cercle'
  'Triangle': 'Triangle'
  'Square': 'Carré'
  'Rhombus': 'Losange'
  'Flare': 'Éclat'
  'Pentagon': 'Pentagone'
  'Hexagon': 'Hexagone'
  'HexagonAlt': 'Hexagone alt.'
  'Heptagon': 'Heptagone'
  'Octagon': 'Octagone'
</i18n>
