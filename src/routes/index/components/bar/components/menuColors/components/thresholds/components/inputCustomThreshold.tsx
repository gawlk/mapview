import store from '/src/store'

import { Input, InputRadioHorizontal } from '/src/components'

interface Props extends InputProps {
  isRange: boolean
  setIsRange: (value: boolean) => void
  value: number
  setValue: (value: number) => void
}

export default (props: Props) => {
  let input: HTMLInputElement | undefined

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
          store.selectedReport &&
          props.setIsRange(value === 'range' ? true : false)
        }
      />
      <Input
        full
        {...props}
        value={props.value}
        onInput={(value) => {
          props.setValue(Number(value))
        }}
        type={props.isRange ? 'range' : 'text'}
        bind
      />
    </div>
  )
}
