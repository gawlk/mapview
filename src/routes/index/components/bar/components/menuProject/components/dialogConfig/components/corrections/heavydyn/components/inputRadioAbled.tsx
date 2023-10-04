import { InputRadioHorizontal } from '/src/components'
import { useAppState } from '/src/index'

interface Props {
  active: boolean
  onChange: (value: boolean) => void
}

export const InputRadioAbled = (props: Props) => {
  const { t } = useAppState()

  const enabledString = t('Enabled')
  const disabledString = t('Disabled')

  return (
    <InputRadioHorizontal
      full
      values={{
        selected: props.active ? enabledString : disabledString,
        list: [
          {
            value: enabledString,
            color: 'green',
          },
          { value: disabledString, color: 'red' },
        ],
      }}
      onChange={(value) => props.onChange(value === enabledString)}
    />
  )
}
