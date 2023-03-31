import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Button, Dialog } from '/src/components'

export default () => {
  const [t] = useI18n()

  return (
    <Show when={store.projects.list.length > 1}>
      <Dialog
        title={t('Delete project')}
        button={{
          icon: IconTablerTrash,
          color: 'red',
        }}
        onClose={(value) => {
          if (value === 'delete') {
            const index = store.projects.list.findIndex(
              (project) => project === store.selectedProject
            )

            const project = store.projects.list.splice(index, 1)?.[0]

            if (project === store.selectedProject) {
              store.selectedProject =
                store.projects.list.length - 1 >= index
                  ? store.projects.list[index]
                  : store.projects.list.slice(-1).pop() || null
            }
          }
        }}
        form={
          <div class="space-y-2">
            <p>
              {`${t('Are you sure that you want to delete the project')}${t(
                ':'
              )} `}
              <strong>{String(store.selectedProject?.name.value)}</strong> ?
            </p>
            <Button full color="red" value="delete">
              <span class="flex-1">{t("Yes, I'm sure")}</span>
            </Button>
          </div>
        }
      />
    </Show>
  )
}
