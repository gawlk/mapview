import { useI18n } from '@solid-primitives/i18n'

import { InputRadioHorizontal } from '/src/components'

interface Props {
  active: boolean
  onChange: (value: boolean) => void
}

export default (props: Props) => {
  const [t] = useI18n()

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
      onChange={(value) =>
        props.onChange(value === enabledString ? true : false)
      }
    />
  )
}
