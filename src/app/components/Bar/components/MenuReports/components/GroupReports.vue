<script setup lang="ts">
  import store from '/src/store'
  import { icons } from '/src/scripts'

  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconViewGrid from '~icons/heroicons-solid/view-grid'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'
  import Popover from '/src/components/Popover.vue'
  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const state = reactive({
    hideAll: true,
  })

  const selectReport = (report: MachineReport) => {
    if (store.projects.selected) {
      store.projects.selected.reports.selected = report
      report.fitOnMap()
    }
  }

  const toggleReport = (report: MachineReport) => {
    report.settings.isVisible = !report.settings.isVisible
  }

  const deleteReport = () => {
    const project = store.projects.selected

    if (project) {
      const index = project.reports.list.findIndex(
        (report) => project.reports.selected === report
      )

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
      hidePreTextOnMobile
      :buttonText="`${store.projects.selected?.reports.selected?.name.value}`"
      full
    >
      <div
        v-for="report of store.projects.selected?.reports.list"
        :key="(report.name.value as string)"
        class="flex space-x-1"
      >
        <Button
          :leftHTMLIcon="icons[report.settings.iconName]"
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
      </div>
      <Button
        :leftIcon="IconViewGrid"
        :rightIcon="state.hideAll ? IconEyeOff : IconEye"
        full
        @click="
          () => {
            store.projects.selected?.reports.list.forEach(
              (report) => (report.settings.isVisible = !state.hideAll)
            )
            state.hideAll = !state.hideAll
          }
        "
      >
        {{ t(state.hideAll ? 'Hide all reports' : 'Show all reports') }}
      </Button>
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
    <Dialog
      v-if="
        store.projects.selected &&
        store.projects.selected.reports.list.length > 1
      "
      :title="t('Delete report')"
      :icon="IconTrash"
      red
      deletable
      @delete="() => deleteReport()"
    >
      <template v-slot:dialog>
        {{ t('Are you sure that you want to delete the report') }} -
        <strong>{{
          store.projects.selected.reports.selected?.name.value
        }}</strong>
        - {{ t('from the project') }} -
        <strong>{{ store.projects.selected.name.value }}</strong> ?
      </template>
    </Dialog>
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
  'Delete report': 'Supprimer le rapport'
  'Are you sure that you want to delete the report': 'Êtes-vous sûr que vous souhaitez supprimer le rapport'
  'from the project': 'du projet'
  'Hide all reports': 'Cacher tous les rapports'
  'Show all reports': 'Afficher tous les rapports'
</i18n>
