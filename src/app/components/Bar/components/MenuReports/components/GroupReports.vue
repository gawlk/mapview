<script setup lang="ts">
  import store from '/src/store'

  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconEye from '~icons/heroicons-solid/eye'
  import IconEyeOff from '~icons/heroicons-solid/eye-off'
  import IconTrash from '~icons/heroicons-solid/trash'

  const { t } = useI18n()

  const selectReport = (report: MachineReport) => {
    if (store.selectedProject) {
      store.selectedProject.selectedReport = report
      report.fitOnMap()
    }
  }

  const toggleReport = (report: MachineReport) => {
    report.mapviewSettings.isVisible = !report.mapviewSettings.isVisible
  }

  const deleteReport = (index: number) => {
    const project = store.selectedProject

    if (project) {
      const report = project.reports.splice(index, 1)?.[0]

      if (report.mapviewSettings.isVisible) {
        report.remove()
      }

      if (report === project.selectedReport) {
        project.selectedReport =
          project.reports.length - 1 >= index
            ? project.reports[index]
            : project.reports.slice(-1).pop() || null
      }
    }
  }
</script>

<template>
  <div class="flex space-x-2">
    <Popover
      :icon="IconViewList"
      :buttonText="`${t('Name')}${t(':')} ${
        store.selectedProject?.selectedReport?.name.value
      } (${store.selectedProject?.machine})`"
      full
    >
      <div
        v-for="(report, index) of store.selectedProject?.reports"
        :key="(report.name.value as string)"
        class="flex space-x-1"
      >
        <Button @click="selectReport(report)" truncate full>
          {{ report.name.value }}
        </Button>
        <Button
          :icon="report.mapviewSettings.isVisible ? IconEye : IconEyeOff"
          @click="toggleReport(report)"
        />
        <Button :icon="IconTrash" @click="deleteReport(index)" />
      </div>
    </Popover>
  </div>
</template>
