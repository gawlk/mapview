import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Button, Dialog, Input, Label } from '/src/components'

export default () => {
  const [t] = useI18n()

  const bulks = createMemo(() => [
    {
      title: t('Informations'),
      fields: store.selectedProject
        ? [store.selectedProject.name, ...store.selectedProject.information]
        : [],
    },
    {
      title: t('Hardware'),
      fields: store.selectedProject ? store.selectedProject.hardware : [],
    },
  ])

  return (
    <Dialog
      title={t('Informations')}
      button={{
        leftIcon: IconTablerInfoCircle,
        text: t('View information'),
        full: true,
      }}
      footer={
        <div class="flex justify-end">
          <Button rightIcon={IconTablerDoorExit}>{t('Save and close')}</Button>
        </div>
      }
    >
      <div class="space-y-8">
        <For each={bulks()}>
          {(bulk) => (
            <Label label={bulk.title}>
              <For each={bulk.fields}>
                {(field) => {
                  let value: string | number | boolean | Date
                  let type: string | undefined

                  switch (typeof field.value) {
                    case 'object':
                      switch (field.value.kind) {
                        case 'dateValue':
                          value = field.value.value.split('T')[0]
                          type = 'date'
                          break
                        default:
                          value = field.value.value
                          break
                      }

                      break

                    default:
                      value = field.value
                      break
                  }

                  const isInput =
                    typeof field.value === 'object'
                      ? field.value.kind === 'dateValue' ||
                        field.value.kind === 'longString'
                      : typeof value === 'string' || typeof value === 'number'

                  return (
                    <Switch>
                      <Match when={isInput}>
                        <Input
                          full
                          label={t(field.label)}
                          readOnly={type === 'date' || field.settings.readOnly}
                          long={
                            typeof field.value === 'object' &&
                            field.value.kind === 'longString'
                          }
                          value={value as string | number}
                          type={type}
                        />
                      </Match>
                    </Switch>
                  )
                }}
              </For>
            </Label>
          )}
        </For>
      </div>
    </Dialog>
  )
}
