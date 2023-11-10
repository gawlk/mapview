import { Button, Dialog } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const DialogRemoveProject = () => {
  const { t } = useAppState()

  return (
    <Show when={store.projects.list().length > 1}>
      <Dialog
        closeable
        title={t('Delete project')}
        button={{
          icon: IconTablerTrash,
          color: 'red',
        }}
        onClose={(value) => {
          if (value === 'delete') {
            const index = store.projects
              .list()
              .findIndex((project) => project === store.selectedProject())

            const project = store.projects.removeIndex(index)

            if (project === store.selectedProject()) {
              const _project = store.projects.list().at(Math.max(index - 1, 0))

              if (_project) {
                store.selectProject(_project)
                _project.addToMap()
              } else {
                store.projects.resetSelected()
              }
            }
          }
        }}
        form={
          <div class="space-y-2">
            <p>
              {`${t('Are you sure that you want to delete the project')}${t(
                ':',
              )} `}
              <strong>
                {String(store.selectedProject()?.name.toString())}
              </strong>{' '}
              ?
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
