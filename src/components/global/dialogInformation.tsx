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

  const [state, setState] = createStore({
    open: false,
  })

  const pendingChanges = new Map<string, () => void>()

  return (
    <Dialog
      title={t('Informations')}
      hideCloseButton
      button={{
        leftIcon: IconTablerInfoCircle,
        text: t('View information'),
        full: true,
      }}
      footer={
        <div class="flex justify-between">
          <Button color="red" leftIcon={IconTablerArrowBack}>
            {t('Cancel')}
          </Button>
          <Button
            color="green"
            rightIcon={IconTablerDoorExit}
            onClick={() => {
              ;[...pendingChanges.values()].forEach((setter) => setter())
            }}
          >
            {t('Save')}
          </Button>
        </div>
      }
      onOpen={() => {
        setState('open', true)
        pendingChanges.clear()
      }}
      onClose={() => setState('open', false)}
    >
      <div class="space-y-8">
        <For each={props.bulks}>
          {(bulk) => (
            <Label label={bulk.title}>
              <For each={bulk.fields}>
                {(field) => {
                  let input = undefined as HTMLInputElement | undefined
                  let value: string | number | boolean
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

                  const id = createMemo(
                    () => `input-${field.label.toLowerCase()}`
                  )

                  const readOnly = createMemo(
                    () => type === 'date' || field.settings.readOnly
                  )

                  createEffect(() => {
                    if (state.open && input && !readOnly()) {
                      input.value = String(value)
                    }
                  })

                  return (
                    <Switch>
                      <Match when={isInput}>
                        <Input
                          copyRef={(ref) => (input = ref)}
                          full
                          // TODO: Set color to yellow when value is pending ?
                          color={undefined}
                          label={t(field.label)}
                          readOnly={readOnly()}
                          long={
                            typeof field.value === 'object' &&
                            field.value.kind === 'longString'
                          }
                          value={value as string | number}
                          type={type}
                          id={id()}
                          onInput={(newValue) => {
                            pendingChanges.set(id(), () => {
                              // TODO: Keep one instead of both
                              field.setValue(newValue || '')
                              value = newValue || ''
                            })
                          }}
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
