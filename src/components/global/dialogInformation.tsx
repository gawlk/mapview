import { useI18n } from '@solid-primitives/i18n'

import { Button, Dialog, Input, Label } from '/src/components'

interface Props {
  bulks: {
    title: any
    fields: Field[]
  }[]
}

export default (props: Props) => {
  const [t] = useI18n()

  // TODO: Donnée manquante

  return (
    <Dialog
      title={t('Informations')}
      button={{
        leftIcon: IconTablerInfoCircle,
        text: t('View information'),
        full: true,
      }}
      footer={
        <div class="flex justify-between">
          <Button rightIcon={IconTablerArrowBack}>{t('Cancel')}</Button>
          <Button rightIcon={IconTablerDoorExit}>{t('Save')}</Button>
        </div>
      }
    >
      <div class="space-y-8">
        <For each={props.bulks}>
          {(bulk) => (
            <Label label={bulk.title}>
              <For each={bulk.fields}>
                {(field) => {
                  let value: string | number | boolean | Date
                  // let setValue: (newValue: typeof value) => void
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
                        field.value.kind === 'longString' ||
                        field.value.kind === 'selectableString'
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
                          id={`'input-${field.label.toLowerCase()}`}
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
