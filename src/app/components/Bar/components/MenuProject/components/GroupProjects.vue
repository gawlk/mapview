<script setup lang="ts">
  import store from '/src/store'

  import { acceptedExtensions, hasRawData, importFile } from '/src/scripts'

  import IconArchive from '~icons/heroicons-solid/archive'
  import IconData from '~icons/heroicons-solid/folder-open'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconZoomIn from '~icons/heroicons-solid/zoom-in'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'
  import Popover from '/src/components/Popover.vue'

  const { t } = useI18n()

  const inputFile = ref()

  const state = reactive({
    isOpen: false,
  })

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
      store.importingFile = true

      const project = await importFile(file)

      store.importingFile = false

      if (project) {
        store.projects.selected = project
      }
    }
  }

  const deleteProject = () => {
    state.isOpen = false

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
      class="flex-1"
      :icon="IconViewList"
      :preText="`${t('Selected')}${t(':')}`"
      hidePreTextOnMobile
      :buttonText="`${store.projects.selected?.name.value} - ${store.projects.selected?.machine}`"
      full
    >
      <div
        class="flex space-x-1 truncate"
        v-for="(project, index) of store.projects.list"
        :key="project.name.value.toString()"
      >
        <Button
          :leftIcon="IconZoomIn"
          :right-icon="
            !store.isProd && hasRawData(project) ? IconData : undefined
          "
          @click="selectProject(index)"
          truncate
          full
        >
          {{ `${project.name.value} - ${project.machine}` }}
        </Button>
      </div>
    </Popover>
    <Button
      class="hidden sm:block"
      @click="inputFile.click()"
      :icon="IconPlus"
    />
    <input
      class="hidden"
      @change="(event) => addProject((event.target as HTMLInputElement).files?.[0])"
      :accept="acceptedExtensions.join(', ')"
      type="file"
      ref="inputFile"
    />
    <Dialog
      v-if="store.projects.list.length > 1"
      :isOpen="state.isOpen"
      :title="t('Delete project')"
      :icon="IconTrash"
      red
      deletable
      @delete="() => deleteProject()"
      @open="() => (state.isOpen = true)"
      @close="() => (state.isOpen = false)"
    >
      <template v-slot:dialog>
        <!-- <Button @click="deleteReport(index)"> Delete</Button> -->
        {{ t('Are you sure that you want to delete the project') }} -
        <strong>{{ store.projects.selected?.name.value }}</strong> ?
      </template>
    </Dialog>
  </div>
  <Button
    class="sm:hidden"
    @click="inputFile.click()"
    :leftIcon="IconArchive"
    :rightIcon="IconPlus"
    full
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
