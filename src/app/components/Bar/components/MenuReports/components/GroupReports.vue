<script setup lang="ts">
  import store from '/src/store'

  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconZoomIn from '~icons/heroicons-solid/zoom-in'

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
</script>

<template>
  <div class="flex space-x-2">
    <Popover
      :icon="IconViewList"
      :buttonText="`${t('Name')}${t(':')} ${
        store.projects.selected?.reports.selected?.name.value
      } (${store.projects.selected?.machine})`"
      full
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
          v-if="store.projects.selected?.reports.list.length > 1"
          :icon="IconTrash"
          @click="deleteReport(index)"
        />
      </div>
    </Popover>
  </div>
</template>
