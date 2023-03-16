import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Dialog, Input, Label } from '/src/components'

export default () => {
  const [t] = useI18n()

  const bulks = createMemo(() => [
    {
      title: t('Informations'),
      fields: store.projects.selected
        ? [store.projects.selected.name, ...store.projects.selected.information]
        : [],
    },
    {
      title: t('Hardware'),
      fields: store.projects.selected ? store.projects.selected.hardware : [],
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
                          value = new Date(
                            field.value.value
                          ).toLocaleDateString()

                          console.log(value)

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
                      ? field.value.kind === 'dateValue'
                      : typeof value === 'string' || typeof value === 'number'

                  return (
                    <Switch>
                      <Match when={isInput}>
                        <Input
                          full
                          label={t(field.label)}
                          readOnly={field.settings.readOnly}
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
