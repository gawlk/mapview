import { Input, InputRadioHorizontal } from '/src/components'
import { store } from '/src/store'

interface Props extends InputProps {
  isRange: boolean
  setIsRange: (value: boolean) => void
  value: number
  setValue: (value: number) => void
}

export const InputCustomThreshold = (props: Props) => {
  const [input, setInput] = createSignal(
    undefined as HTMLInputElement | undefined,
  )

  createEffect(() => {
    const _input = input()
    if (!props.isRange && _input) {
      _input.value = String(props.value)
    }
  })

  return (
    <div class="flex space-x-1">
      <InputRadioHorizontal
        values={{
          selected: props.isRange ? 'range' : 'text',
          list: [
            {
              icon: IconTablerCursorText,
              value: 'text',
            },
            {
              icon: IconTablerAdjustmentsHorizontal,
              value: 'range',
            },
          ],
        }}
        onChange={(value) =>
          store.selectedReport && props.setIsRange(value === 'range')
        }
      />
      <Input
        full
        ref={setInput}
        {...props}
        value={props.value}
        onInput={(value) => {
          props.setValue(Number(value))
        }}
        type={props.isRange ? 'range' : 'number'}
        bind
      />
    </div>
  )
}
