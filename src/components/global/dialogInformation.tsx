import { Button, Dialog, Input, InputDataList, Label } from '/src/components'
import { useAppState } from '/src/index'

interface Props {
  readonly bulks: {
    readonly title: string | Element
    readonly fields: Field[]
  }[]
}

export const DialogInformation = (props: Props) => {
  const { t } = useAppState()

  const [state, setState] = createStore({
    open: false,
  })

  const pendingChanges = new Map<string, VoidFunction>()

  return (
    <Dialog
      title={t('Information')}
      button={{
        leftIcon: IconTablerInfoCircle,
        text: t('View information'),
        full: true,
      }}
      footer={
        <div class="flex justify-between">
          <Button color="red" leftIcon={IconTablerEraser}>
            {t('Cancel')}
          </Button>
          <Button
            color="green"
            rightIcon={IconTablerDeviceFloppy}
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
          {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
          {(bulk) => (
            <Label label={bulk.title}>
              <For each={bulk.fields}>
                {(field) => {
                  let input = undefined as HTMLInputElement | undefined
                  let value: string | number | boolean
                  let type: string | undefined

                  const fieldValue = field.value()

                  switch (typeof fieldValue) {
                    case 'object':
                      switch (fieldValue.kind) {
                        case 'dateValue':
                          value = fieldValue.value().split('T')[0]
                          type = 'date'
                          break
                        default:
                          value = fieldValue.value()
                          break
                      }

                      break

                    default:
                      value = fieldValue
                      break
                  }

                  const isLongString =
                    typeof fieldValue === 'object' &&
                    fieldValue.kind === 'longString'

                  const isInput =
                    typeof fieldValue === 'object'
                      ? fieldValue.kind === 'dateValue' || isLongString
                      : typeof value === 'string' || typeof value === 'number'

                  const id = createMemo(
                    () => `input-${field.label.toLowerCase()}`,
                  )

                  const readOnly = createMemo(
                    () => type === 'date' || field.settings.readOnly(),
                  )

                  createEffect(() => {
                    if (state.open && input && !readOnly()) {
                      input.value = String(value)
                    }
                  })

                  const onInput = (newValue: string | undefined) => {
                    pendingChanges.set(id(), () => {
                      // TODO: Keep one instead of both ?
                      field.setValue(newValue || '')
                      value = newValue || ''
                    })
                  }

                  return (
                    <Switch>
                      <Match when={isInput}>
                        <Input
                          ref={(ref) => {
                            input = ref
                          }}
                          full
                          label={t(field.label) || field.label}
                          readOnly={readOnly()}
                          long={isLongString}
                          value={value as string | number}
                          type={type}
                          id={id()}
                          onInput={onInput}
                        />
                      </Match>
                      <Match
                        when={
                          typeof fieldValue === 'object' &&
                          fieldValue.kind === 'selectableString' &&
                          fieldValue
                        }
                      >
                        {(_fieldValue) => (
                          <InputDataList
                            ref={(ref) => {
                              input = ref
                            }}
                            full
                            id={id()}
                            label={t(field.label)}
                            value={_fieldValue().value()}
                            list={_fieldValue().possibleValues.map(
                              (_value) => t(_value) || _value,
                            )}
                            onInput={onInput}
                          />
                        )}
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
