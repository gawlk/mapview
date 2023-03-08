import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Button, Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

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

  return (
    <Show when={store.projects.list.length > 1}>
      <Dialog
        title={t('Delete project')}
        button={{
          icon: IconTablerTrash,
          color: 'red',
        }}
      >
        <Button>I'm sure</Button>
      </Dialog>
    </Show>
  )
}
