<script setup lang="ts">
  import store from '/src/store'
  import { importFile, acceptedExtensions } from '/src/scripts'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'
  import Popover from '/src/components/Popover.vue'

  import IconArchive from '~icons/heroicons-solid/archive'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconZoomIn from '~icons/heroicons-solid/zoom-in'

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

  const addProject = async (file: File | undefined) => {
    if (file) {
      const project = await importFile(file)

      if (project) {
        console.log(project)

        store.projects.selected = project
      }
    }
  }

  const deleteProject = () => {
    const index = store.projects.list.findIndex(
      (project) => project === store.projects.selected
    )

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
      :preText="`${t('Selected')}${t(':')}`"
      hidePreTextOnMobile
      :buttonText="`${store.projects.selected?.name.value} - ${store.projects.selected?.machine}`"
      full
      class="flex-1"
    >
      <div
        v-for="(name, index) of store.projects.list.map(
          (project) => `${project.name.value} - ${project.machine}`
        )"
        :key="name"
        class="flex space-x-1 truncate"
      >
        <Button
          :leftIcon="IconZoomIn"
          @click="selectProject(index)"
          truncate
          full
        >
          {{ name }}
        </Button>
      </div>
    </Popover>
    <Button
      @click="inputFile.click()"
      :icon="IconPlus"
      class="hidden sm:block"
    />
    <input
      @change="(event) => addProject((event.target as HTMLInputElement).files?.[0])"
      :accept="acceptedExtensions"
      type="file"
      ref="inputFile"
      class="hidden"
    />
    <Dialog
      v-if="store.projects.list.length > 1"
      :title="t('Delete project')"
      :icon="IconTrash"
      red
      deletable
      @delete="() => deleteProject()"
    >
      <template v-slot:dialog>
        <!-- <Button @click="deleteReport(index)"> Delete</Button> -->
        {{ t('Are you sure that you want to delete the project') }} -
        <strong>{{ store.projects.selected?.name.value }}</strong> ?
      </template>
    </Dialog>
  </div>
  <Button
    @click="inputFile.click()"
    :leftIcon="IconArchive"
    :rightIcon="IconPlus"
    full
    class="sm:hidden"
  >
    {{ t('Add a project') }}
  </Button>
</template>

<i18n lang="yaml">
fr:
  'Add a project': 'Ajouter un projet'
  'Delete project': 'Supprimer le projet'
  'Are you sure that you want to delete the project': 'Êtes-vous sûr que vous souhaitez supprimer le project'
</i18n>
