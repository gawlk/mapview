<script setup lang="ts">
  import store from '/src/store'
  import { importFile } from '/src/scripts'

  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'

  const { t } = useI18n()

  const inputFile = ref()

  const selectProject = (index: number) => {
    const project = store.projects.list[index]
    if (store.projects.selected === project) {
      project.fitOnMap()
    } else {
      store.projects.selected = project
    }
  }

  const addProject = (file: File | undefined) => {
    file && importFile(file)
  }

  const deleteProject = (index: number) => {
    const project = store.projects.list.splice(index, 1)?.[0]

    if (project === store.projects.selected) {
      store.projects.selected =
        store.projects.list.length - 1 >= index
          ? store.projects.list[index]
          : store.projects.list.slice(-1).pop() || null
    }
  }
</script>

<template>
  <div class="flex space-x-2">
    <Popover
      :icon="IconViewList"
      :buttonText="`${t('Name')}${t(':')} ${
        store.projects.selected?.name.value
      } (${store.projects.selected?.machine})`"
      full
    >
      <div
        v-for="(name, index) of store.projects.list.map(
          (project) => project.name.value as string
        )"
        :key="name"
        class="flex space-x-1"
      >
        <Button @click="selectProject(index)" truncate full>
          {{ name }}
        </Button>
        <Button :icon="IconTrash" @click="deleteProject(index)" />
      </div>
    </Popover>
    <Button @click="inputFile.click()" :icon="IconPlus" />
    <input
      @change="(event) => addProject((event.target as HTMLInputElement).files?.[0])"
      accept=".prjz, .mpvz"
      type="file"
      ref="inputFile"
      class="hidden"
    />
  </div>
</template>
